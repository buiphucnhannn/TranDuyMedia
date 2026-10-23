"use client";

import { siteConfig } from "@/config/site";
import { api, ApiError, refreshSession } from "@/lib/api";
import { toast } from "@/lib/toast";

/**
 * Hàng đợi lưu sản phẩm chạy NỀN: bấm "Lưu" → popup đóng ngay, việc tải tệp lên Cloudinary và ghi
 * dữ liệu diễn ra phía sau, tiến độ hiện trên toast. Người dùng vẫn thao tác tiếp được.
 * - Tệp từ máy: upload qua XHR để có % tiến độ (fetch không báo tiến độ upload).
 * - Link: backend nhập về Cloudinary (hoặc giữ dạng nhúng với YouTube / Vimeo).
 * - Lỗi: giữ lại bản nháp để "Mở lại & thử lại" mà không mất dữ liệu đã nhập.
 */
let jobs = [];
const listeners = new Set();
const emit = () => listeners.forEach((l) => l(jobs));
export const subscribeJobs = (fn) => {
  listeners.add(fn);
  fn(jobs);
  return () => listeners.delete(fn);
};
const setJob = (id, patch) => {
  jobs = jobs.map((j) => (j.id === id ? { ...j, ...patch } : j));
  emit();
};
export const dismissJob = (id) => {
  jobs = jobs.filter((j) => j.id !== id);
  emit();
};
export const hasRunningJobs = () => jobs.some((j) => j.status === "running");

// Cảnh báo khi đóng tab lúc đang tải
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e) => {
    if (hasRunningJobs()) e.preventDefault();
  });
}

/** Upload 1 tệp kèm tiến độ (0–1). Hết hạn phiên → làm mới (dùng chung với lib/api) rồi thử lại 1 lần. */
function uploadFile(file, folder, onProgress, retried = false) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${siteConfig.apiUrl}/media`);
    xhr.withCredentials = true;
    xhr.setRequestHeader("X-Requested-With", "fetch");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onerror = () => reject(new ApiError(0, null));
    xhr.onload = async () => {
      let body = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {}
      if (
        xhr.status === 401 &&
        ["TOKEN_EXPIRED", "UNAUTHENTICATED"].includes(body?.error?.code) &&
        !retried &&
        (await refreshSession())
      ) {
        return uploadFile(file, folder, onProgress, true).then(resolve, reject);
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body.data);
      else reject(new ApiError(xhr.status, body));
    };
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    xhr.send(fd);
  });
}

/** Chạy tối đa `limit` tác vụ song song. */
async function pool(tasks, limit = 3) {
  const out = new Array(tasks.length);
  let i = 0;
  const worker = async () => {
    while (i < tasks.length) {
      const k = i++;
      out[k] = await tasks[k]();
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return out;
}

/** Lỗi → câu thông báo dễ hiểu cho người dùng. */
export function describeError(err) {
  if (err?.code === "VALIDATION_ERROR") return "Thông tin chưa hợp lệ, vui lòng kiểm tra lại.";
  if (["CLOUDINARY_FORBIDDEN", "IMPORT_FAILED", "STORAGE_NOT_CONFIGURED"].includes(err?.code))
    return err.message;
  if (err?.status === 413)
    return /link/i.test(err.message ?? "")
      ? err.message // tệp từ link quá nặng — backend đã nói rõ giới hạn
      : "Có tệp vượt quá dung lượng cho phép (ảnh ≤ 10MB, video ≤ 200MB).";
  if (err?.status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
  if (err?.status === 404) return "Sản phẩm không còn tồn tại hoặc đã bị xoá.";
  if (err?.status === 0) return "Mất kết nối mạng. Vui lòng kiểm tra rồi thử lại.";
  return err?.message || "Đã có lỗi xảy ra, vui lòng thử lại.";
}

/** Báo website làm mới dữ liệu sản phẩm ngay (không phải chờ cache hết hạn). */
export const revalidateSite = () =>
  fetch("/api/revalidate", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
    body: JSON.stringify({ tag: "products" }),
  }).catch(() => {});

/**
 * Lưu sản phẩm ở chế độ nền.
 * draft: { id?, form, media: [{ source: "existing"|"file"|"link", file?, url?, ... }] }
 */
export function saveProductInBackground(draft, { onDone } = {}) {
  const isEdit = Boolean(draft.id);
  const name = draft.form.title.trim();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const pending = draft.media.filter((m) => m.source !== "existing");
  const toastId = toast.loading(
    pending.length ? `Đang tải ${pending.length} tệp lên…` : "Đang lưu thay đổi…",
    {
      title: `${isEdit ? "Đang cập nhật" : "Đang tạo"} “${name}”`,
      progress: pending.length ? 0 : undefined,
    },
  );
  jobs = [...jobs, { id, name, isEdit, status: "running", draft, progress: 0 }];
  emit();

  (async () => {
    try {
      const folder = `products/${draft.form.slug || "moi"}`;
      const progress = new Array(pending.length).fill(0);
      const report = () => {
        const p = pending.length ? progress.reduce((a, b) => a + b, 0) / pending.length : 1;
        const done = progress.filter((x) => x >= 1).length;
        setJob(id, { progress: p });
        toast.update(toastId, {
          progress: p * 0.95,
          message: `Đã tải ${done}/${pending.length} tệp…`,
        });
      };

      const uploaded = await pool(
        draft.media.map((m) => async () => {
          if (m.source === "existing") return m;
          const k = pending.indexOf(m);
          const res =
            m.source === "file"
              ? await uploadFile(m.file, folder, (p) => ((progress[k] = p), report()))
              : (await api("/media/import", { method: "POST", body: { url: m.url, folder } })).data;
          progress[k] = 1;
          report();
          return {
            ...m,
            type: res.type,
            url: res.url,
            publicId: res.publicId ?? null,
            poster: res.poster ?? null,
            width: res.width,
            height: res.height,
          };
        }),
      );

      toast.update(toastId, { progress: 0.97, message: "Đang lưu thông tin sản phẩm…" });
      // Tự nhận dạng loại sản phẩm: video nhiều hơn ảnh → "video", ngược lại "photo"
      const videos = uploaded.filter((m) => m.type !== "image").length;
      const body = {
        ...draft.form,
        kind: videos > uploaded.length - videos ? "video" : "photo",
        media: uploaded.map((m) => ({
          type: m.type,
          url: m.url,
          publicId: m.publicId ?? null,
          poster: m.poster ?? null,
          pos: m.pos ?? "center",
          zoom: m.zoom ?? 1,
          ...(m.width && { width: m.width }),
          ...(m.height && { height: m.height }),
          alt: m.alt ?? "",
        })),
      };
      if (!body.slug) delete body.slug;
      const res = isEdit
        ? await api(`/products/${draft.id}`, { method: "PATCH", body })
        : await api("/products", { method: "POST", body });
      await revalidateSite();

      dismissJob(id);
      toast.update(toastId, {
        type: "success",
        title: isEdit ? "Đã cập nhật sản phẩm" : "Đã tạo sản phẩm",
        message: `“${res.data.title}” ${res.data.published ? "đã hiển thị trên website." : "đã được lưu (đang ẩn)."}`,
        progress: undefined,
      });
      onDone?.(res.data);
    } catch (err) {
      setJob(id, { status: "failed", error: describeError(err) });
      toast.update(toastId, {
        type: "error",
        title: isEdit ? "Chưa cập nhật được sản phẩm" : "Chưa tạo được sản phẩm",
        message: `${describeError(err)} Bản nháp đã được giữ lại để bạn thử lại.`,
        progress: undefined,
      });
    }
  })();
}
