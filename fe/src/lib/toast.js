/**
 * Toast dùng chung — gọi được ở bất kỳ đâu (không cần hook):
 *   import { toast } from "@/lib/toast";
 *   toast.success("Đã lưu");  toast.error("Không lưu được", { title: "Lỗi" });
 * <Toaster /> (đặt 1 lần ở app/layout.js) hiển thị các toast.
 *
 * Thời gian hiển thị theo mức độ quan trọng (đọc kịp nhưng không làm phiền):
 *   success 3.5s · info 4.5s · warning 5.5s · error 7s — rê chuột / chạm vào toast sẽ tạm dừng đếm.
 *   loading: hiện đến khi được cập nhật — const id = toast.loading("Đang lưu…"); toast.update(id, { type: "success", message });
 *   progress (0–1) hiển thị thanh tiến độ cho tác vụ dài (upload).
 */
export const DURATION = {
  success: 3500,
  info: 4500,
  warning: 5500,
  error: 7000,
  loading: Infinity,
};
const MAX = 4;

let items = [];
let seq = 0;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l(items));

export function subscribe(fn) {
  listeners.add(fn);
  fn(items);
  return () => listeners.delete(fn);
}

export function dismiss(id) {
  items = items.filter((t) => t.id !== id);
  emit();
}

function push(type, message, { title, duration, progress } = {}) {
  // Không hiện trùng cùng một thông báo đang hiển thị
  const dup = items.find((t) => t.type === type && t.message === message);
  if (dup) dismiss(dup.id);
  const id = ++seq;
  items = [
    ...items,
    { id, type, title, message, progress, duration: duration ?? DURATION[type] },
  ].slice(-MAX);
  emit();
  return id;
}

/** Cập nhật một toast đang hiển thị (đổi nội dung / tiến độ / chuyển sang success|error). */
export function update(id, patch) {
  let found = false;
  items = items.map((t) => {
    if (t.id !== id) return t;
    found = true;
    const type = patch.type ?? t.type;
    return {
      ...t,
      ...patch,
      type,
      // đổi loại → đếm lại thời gian theo loại mới
      duration: patch.duration ?? (patch.type ? DURATION[type] : t.duration),
      version: (t.version ?? 0) + 1,
    };
  });
  if (!found && patch.type && patch.type !== "loading")
    return push(patch.type, patch.message, patch);
  emit();
  return id;
}

export const toast = {
  success: (message, opts) => push("success", message, opts),
  error: (message, opts) => push("error", message, opts),
  info: (message, opts) => push("info", message, opts),
  warning: (message, opts) => push("warning", message, opts),
  loading: (message, opts) => push("loading", message, opts),
  update,
  dismiss,
};
