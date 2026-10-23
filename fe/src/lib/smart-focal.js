"use client";

import { formatPos } from "@/lib/crop";
import { focalFromPixels } from "@/lib/smart-focal-core";

/**
 * TỰ CĂN CHỈNH ẢNH BÌA ngay khi thêm ảnh (tệp từ máy / link ảnh):
 * phân tích ảnh thu nhỏ ngay trên trình duyệt, tìm vùng chủ thể và trả object-position ("x% y%")
 * sao cho khi đóng vào khung 3:4 trên website, phần quan trọng của ảnh được giữ lại — thay vì
 * mặc định căn giữa dễ cắt mất chủ thể ở rìa. Đây chỉ là giá trị MẶC ĐỊNH BAN ĐẦU: người dùng
 * vẫn mở công cụ cắt khung (ImageCropper) để chỉnh tay như trước, và kết quả chỉnh tay luôn
 * được ưu tiên (xem MediaManager — ảnh đã cắt tay không bị ghi đè).
 * Mọi lỗi (ảnh khác tên miền không cho đọc pixel, định dạng lạ…) → trả null, giữ căn giữa.
 */
const MAX_EDGE = 160; // đủ để nhận diện chủ thể, nhẹ và nhanh

export function detectSmartPos(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, width, height);
        const { data } = ctx.getImageData(0, 0, width, height);
        const focal = focalFromPixels({ data, width, height });
        resolve(focal.x === 50 && focal.y === 50 ? null : formatPos(focal));
      } catch {
        resolve(null); // canvas bị chặn (CORS) → giữ mặc định căn giữa
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
