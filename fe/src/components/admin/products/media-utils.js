/** Tiện ích cho trình quản lý ảnh / video của sản phẩm (phía trình duyệt). */
import { cdn } from "@/lib/cdn";

export const MAX_IMAGE_MB = 10;
export const MAX_VIDEO_MB = 200;
export const MAX_FILES = 60; // khớp giới hạn của backend (product.validator.js)
export const ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/quicktime,video/webm";

let seq = 0;
export const newKey = () => `m${Date.now().toString(36)}${(seq++).toString(36)}`;

/** "Bộ ảnh Giáng sinh!" → "bo-anh-giang-sinh" */
export const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

/** YouTube / Vimeo → { type: "embed", url, poster } — hiển thị xem trước ngay khi dán link. */
export function parseEmbed(raw) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id = null;
  if (host === "youtu.be") id = u.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com")
    id = u.searchParams.get("v") || u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,})/)?.[1];
  if (id && /^[\w-]{6,20}$/.test(id)) {
    return {
      type: "embed",
      url: `https://www.youtube-nocookie.com/embed/${id}`,
      poster: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }
  const vimeo = /(^|\.)vimeo\.com$/.test(host) ? u.pathname.match(/(\d{6,})/)?.[1] : null;
  if (vimeo) return { type: "embed", url: `https://player.vimeo.com/video/${vimeo}`, poster: null };
  return null;
}

/** Đoán loại link trực tiếp theo đuôi file. */
export const guessLinkType = (url) =>
  /\.(mp4|mov|webm|m4v)(\?|#|$)/i.test(url) ? "video" : "image";

/** Kiểm tra tệp chọn từ máy → null nếu hợp lệ, ngược lại là câu báo lỗi. */
export function checkFile(file) {
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) return `“${file.name}” không phải ảnh hoặc video.`;
  if (!ACCEPT.split(",").includes(file.type))
    return `Định dạng của “${file.name}” chưa được hỗ trợ.`;
  const mb = file.size / 1024 / 1024;
  if (isImage && mb > MAX_IMAGE_MB)
    return `“${file.name}” nặng ${mb.toFixed(1)}MB (ảnh tối đa ${MAX_IMAGE_MB}MB).`;
  if (isVideo && mb > MAX_VIDEO_MB)
    return `“${file.name}” nặng ${mb.toFixed(0)}MB (video tối đa ${MAX_VIDEO_MB}MB).`;
  return null;
}

/** Ảnh xem trước của một mục (tệp mới dùng object URL). */
export const previewOf = (m) => cdn(m.type === "image" ? (m.preview ?? m.url) : (m.poster ?? null));

/** Số ảnh đầu bị đóng khung trên website (ảnh bìa + ảnh tiêu biểu) — chỉ những ảnh này cắt được. */
export const CROPPABLE = 3;

/** Địa chỉ phát của video / link nhúng (tệp mới chọn từ máy dùng object URL). */
export const playUrl = (m) => (m.source === "file" ? m.preview : m.url);

export const isImage = (m) => m.type === "image";

/**
 * Ảnh bìa + ảnh nổi bật (CROPPABLE ô đầu) chỉ dùng ảnh: đưa CROPPABLE ảnh đầu tiên lên trước,
 * các mục còn lại (kể cả video) giữ nguyên thứ tự.
 */
export function keepImagesFirst(list) {
  const top = list.filter(isImage).slice(0, CROPPABLE);
  return [...top, ...list.filter((m) => !top.includes(m))];
}
