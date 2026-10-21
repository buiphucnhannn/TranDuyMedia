/**
 * Ảnh trên Cloudinary → luôn tải bản WebP chất lượng cao nhất của chế độ tự động (f_webp,q_auto:best).
 * Áp cho cả ảnh cũ tải lên trước đây ở dạng JPG/PNG. Link đã có biến đổi riêng / không phải Cloudinary → giữ nguyên.
 */
const UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!f_|q_|c_|w_|so_)(.+)$/;

export const cdn = (url) =>
  typeof url === "string" ? url.replace(UPLOAD, "$1f_webp,q_auto:best/$2") : url;
