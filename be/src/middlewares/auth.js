import { verifyAccessToken } from "#services/token.service.js";
import { ApiError } from "#utils/api-error.js";
import { ACCESS_COOKIE } from "#utils/auth-cookies.js";

/**
 * Bắt buộc đăng nhập: đọc access token từ cookie HttpOnly, gắn req.user = { id, role }.
 * Token hết hạn → 401 TOKEN_EXPIRED để frontend gọi /auth/refresh rồi thử lại.
 */
export function requireAuth(req, _res, next) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) return next(new ApiError(401, "Bạn chưa đăng nhập", { code: "UNAUTHENTICATED" }));
  const payload = verifyAccessToken(token);
  if (!payload) {
    return next(new ApiError(401, "Phiên đăng nhập đã hết hạn", { code: "TOKEN_EXPIRED" }));
  }
  req.user = { id: payload.sub, role: payload.role };
  next();
}

/** Chỉ cho phép các vai trò nhất định (dùng SAU requireAuth). */
export const requireRole =
  (...roles) =>
  (req, _res, next) =>
    roles.includes(req.user?.role)
      ? next()
      : next(new ApiError(403, "Bạn không có quyền thực hiện thao tác này", { code: "FORBIDDEN" }));

export const requireAdmin = [requireAuth, requireRole("admin")];
