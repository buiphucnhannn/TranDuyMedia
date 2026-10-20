import { env } from "#config/env.js";
import { ApiError } from "#utils/api-error.js";

/**
 * Chống CSRF cho request thay đổi dữ liệu (POST/PUT/PATCH/DELETE), bổ sung cho SameSite=Strict:
 * - bắt buộc header `X-Requested-With: fetch` (frontend lib/api.js luôn gửi);
 * - header Origin — nếu có — phải thuộc CORS_ORIGINS.
 * Trình duyệt luôn gửi Origin cho các request này; request không có Origin là gọi từ server
 * (vd. Next.js proxy làm mới phiên) nên được cho qua.
 */
const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

export function originGuard(req, _res, next) {
  if (SAFE.has(req.method)) return next();
  // Header tuỳ chỉnh: form HTML / thẻ <img> của trang lạ KHÔNG gửi được header này,
  // còn fetch từ trang khác bị CORS chặn → lớp chống CSRF thứ ba.
  if (req.get("x-requested-with") !== "fetch") {
    return next(new ApiError(403, "Yêu cầu không hợp lệ", { code: "CSRF_REJECTED" }));
  }
  const origin = req.get("origin");
  if (origin && !env.CORS_ORIGINS.includes(origin)) {
    return next(new ApiError(403, "Nguồn yêu cầu không hợp lệ", { code: "BAD_ORIGIN" }));
  }
  next();
}
