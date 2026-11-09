"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { coverCdn } from "@/lib/cdn";
import { zoomStyle } from "@/lib/crop";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { ImageCropper } from "@/components/admin/products/ImageCropper";
import { describeError, uploadFile } from "@/components/admin/products/jobs";
import { MAX_IMAGE_MB } from "@/components/admin/products/media-utils";

const IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/avif";
const FOLDER = "trang-chu";

/** Đọc kích thước gốc của ảnh chọn từ máy (để next/image tải đúng bản đủ nét). */
const measure = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({});
    img.src = src;
  });

/**
 * Một ô ảnh trên trang chủ (khung tỉ lệ cố định, giống hệt website):
 * - "Thay ảnh": chọn ảnh từ máy → CẮT KHUNG trước (đúng tỉ lệ ô) → tải lên chạy nền (ảnh gốc, không nén lại).
 * - Rê chuột: "Cắt lại" (chỉnh vùng hiển thị bất kỳ lúc nào) · "Dùng ảnh mặc định".
 * Cắt khung không phá ảnh gốc (chỉ lưu điểm giữ lại + mức phóng) → website luôn lấy bản gốc, nét ở mọi màn hình.
 *
 * value: null (đang dùng ảnh mặc định) | { url, width, height, pos, zoom } | ảnh đang tải { preview, uploading }
 * fallback: ảnh mặc định của website { src, pos, zoom }
 */
export function ImageSlot({
  label,
  hint,
  frame, // { ratio, label }
  previews,
  value,
  fallback,
  onChange,
  onUploadingChange,
  className,
  boxWidth = 480,
  defaultLabel = "Ảnh mặc định",
}) {
  const input = useRef(null);
  const [crop, setCrop] = useState(null); // { src, pos, zoom, file? }
  const custom = Boolean(value);
  const shown = value ?? fallback;
  const src = value ? (value.preview ?? value.url) : fallback?.src;
  const busy = Boolean(value?.uploading);

  const thumb =
    src && !src.startsWith("blob:")
      ? coverCdn(src, shown, boxWidth, Math.round(boxWidth / frame.ratio))
      : src;

  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.split(",").includes(file.type))
      return toast.error(`“${file.name}” không phải ảnh JPG, PNG, WebP hoặc AVIF.`, {
        title: "Chưa chọn được ảnh",
      });
    if (file.size / 1024 / 1024 > MAX_IMAGE_MB)
      return toast.error(
        `“${file.name}” nặng ${(file.size / 1024 / 1024).toFixed(1)}MB (ảnh tối đa ${MAX_IMAGE_MB}MB).`,
        { title: "Ảnh quá nặng" },
      );
    setCrop({ src: URL.createObjectURL(file), pos: "center", zoom: 1, file });
  };

  /** Áp dụng cắt khung: ảnh mới → hiện ngay + tải lên nền; ảnh cũ → chỉ đổi vùng hiển thị. */
  const apply = async ({ pos, zoom }) => {
    const c = crop;
    setCrop(null);
    if (!c.file)
      return onChange(value ? { ...value, pos, zoom } : { ...toSaved(fallback), pos, zoom });
    const dims = await measure(c.src);
    const draft = { preview: c.src, uploading: true, progress: 0, pos, zoom, ...dims };
    onChange(draft);
    onUploadingChange?.(1);
    try {
      const res = await uploadFile(c.file, FOLDER, (p) =>
        onChange((cur) => (cur?.preview === c.src ? { ...cur, progress: p } : cur)),
      );
      onChange((cur) =>
        cur?.preview === c.src
          ? {
              url: res.url,
              width: res.width ?? cur.width,
              height: res.height ?? cur.height,
              pos: cur.pos,
              zoom: cur.zoom,
              preview: c.src, // giữ ảnh trên máy để xem tiếp không phải tải lại
            }
          : cur,
      );
    } catch (err) {
      onChange((cur) => (cur?.preview === c.src ? null : cur));
      toast.error(describeError(err), { title: "Chưa tải được ảnh lên" });
    } finally {
      onUploadingChange?.(-1);
    }
  };

  return (
    <figure className={cn("min-w-0", className)}>
      <div
        className="group relative overflow-hidden rounded-xl bg-paper-200 ring-1 ring-ink/10"
        style={{ aspectRatio: frame.ratio }}
      >
        {src && (
          <span className="absolute inset-0" style={zoomStyle(shown)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ảnh xem trước trong trang quản trị */}
            <img
              src={thumb}
              alt=""
              draggable={false}
              className="size-full object-cover"
              style={{ objectPosition: shown?.pos }}
            />
          </span>
        )}

        {/* Nhãn trạng thái */}
        <span
          className={cn(
            "absolute top-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-sm",
            custom ? "bg-emerald-500 text-white" : "bg-white/95 text-ink-soft",
          )}
        >
          {custom ? "Ảnh đã thay" : defaultLabel}
        </span>

        {busy ? (
          <span className="absolute inset-x-0 bottom-0 bg-navy-950/70 px-3 py-2 text-[11px] font-medium text-white">
            Đang tải lên… {Math.round((value.progress ?? 0) * 100)}%
            <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/25">
              <span
                className="block h-full rounded-full bg-orange-500 transition-[width]"
                style={{ width: `${Math.round((value.progress ?? 0) * 100)}%` }}
              />
            </span>
          </span>
        ) : (
          // Rê chuột (máy tính) / luôn hiện (màn cảm ứng): thao tác nhanh
          <span className="absolute inset-0 flex items-center justify-center gap-2 bg-navy-950/45 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:items-end pointer-coarse:justify-end pointer-coarse:bg-transparent pointer-coarse:p-2 pointer-coarse:opacity-100">
            <SlotButton icon="image" onClick={() => input.current?.click()}>
              Thay ảnh
            </SlotButton>
            {src && (
              <SlotButton
                icon="pen"
                onClick={() =>
                  setCrop({ src: value?.preview ?? src, pos: shown.pos, zoom: shown.zoom ?? 1 })
                }
              >
                Cắt lại
              </SlotButton>
            )}
            {custom && (
              <SlotButton icon="refresh" onClick={() => onChange(null)} title="Dùng ảnh mặc định">
                <span className="sr-only">Dùng ảnh mặc định</span>
              </SlotButton>
            )}
          </span>
        )}
      </div>
      <figcaption className="mt-2 text-left">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-ink-muted">
          Khung {frame.label}
          {hint && ` · ${hint}`}
        </span>
      </figcaption>

      <input ref={input} type="file" accept={IMAGE_TYPES} hidden onChange={pick} />

      {crop && (
        <ImageCropper
          item={crop}
          ratio={frame.ratio}
          hint={`Kéo ảnh để chọn vùng hiển thị — khung ${frame.label} giống trên trang chủ`}
          previews={
            previews ?? [{ caption: label, note: `Khung ${frame.label}`, ratio: frame.ratio }]
          }
          onApply={apply}
          onClose={() => {
            if (crop.file) URL.revokeObjectURL(crop.src);
            setCrop(null);
          }}
        />
      )}
    </figure>
  );
}

/** Ảnh mặc định (/images/...) cắt lại → lưu như ảnh đã thay (cùng ảnh, vùng hiển thị mới). */
const toSaved = (img) => ({ url: img.src, width: img.width, height: img.height });

function SlotButton({ icon, children, ...props }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-ink shadow-md transition hover:bg-orange-500 hover:text-white"
      {...props}
    >
      <Icon name={icon} className="size-3.5" />
      {children}
    </button>
  );
}
