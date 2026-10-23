/**
 * Ảnh xem trước trong TRANG QUẢN TRỊ (thẻ <img> thường, không qua next/image) → tải bản WebP nhẹ, chất lượng
 * cao nhất của chế độ tự động (f_webp,q_auto:best) thay vì cả file gốc. Website công khai dùng thẳng bản gốc
 * (xem lib/products.js) để next/image tự nén từ bản gốc.
 * Áp cho cả ảnh cũ tải lên trước đây ở dạng JPG/PNG. Link đã có biến đổi riêng / không phải Cloudinary → giữ nguyên.
 */
const UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!f_|q_|c_|w_|so_)(.+)$/;

export const cdn = (url) =>
  typeof url === "string" ? url.replace(UPLOAD, "$1f_webp,q_auto:best/$2") : url;
