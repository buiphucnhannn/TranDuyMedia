import { v2 as cloudinary } from "cloudinary";
import { env } from "#config/env.js";

/**
 * Cấu hình Cloudinary SDK (lưu ảnh & video). Luôn dùng HTTPS.
 * Khi chưa điền key (phát triển), các API upload trả 503 thay vì làm sập server — xem media.service.js.
 */
if (env.hasCloudinary) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };
