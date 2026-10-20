import { Router } from "express";
import { limiter } from "#middlewares/rate-limit.js";
import { authController } from "#controllers/auth.controller.js";
import { requireAuth } from "#middlewares/auth.js";
import { validate } from "#middlewares/validate.js";
import { loginSchema } from "#validators/auth.validator.js";

const router = Router();

// Chống dò mật khẩu: tối đa 5 lần đăng nhập SAI / 15 phút / IP (lần đúng không bị tính)
const loginLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.",
});

// Chống dò mật khẩu phân tán (nhiều IP / botnet): tối đa 10 lần SAI / 15 phút cho MỖI ID đăng nhập,
// bất kể đến từ IP nào. Kết hợp với giới hạn theo IP ở trên.
const accountLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: (req) =>
    `login:${String(req.body?.username ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 100)}`,
  message: "Tài khoản tạm khoá đăng nhập do nhập sai nhiều lần. Vui lòng thử lại sau 15 phút.",
});

// Cầu dao toàn hệ thống: tối đa 50 lần đăng nhập SAI / 15 phút cộng dồn mọi IP & mọi ID.
// Lớp cuối cùng khi IP bị giả (thiếu reverse proxy ghi đè X-Forwarded-For) hoặc tấn công phân tán.
const globalLoginLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  skipSuccessfulRequests: true,
  keyGenerator: () => "login:global",
  message:
    "Hệ thống tạm dừng đăng nhập do phát hiện nhiều lần thử sai. Vui lòng thử lại sau 15 phút.",
});

const refreshLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 60,
});

router.post(
  "/login",
  globalLoginLimiter,
  loginLimiter,
  accountLimiter,
  validate(loginSchema),
  authController.login,
);
router.post("/refresh", refreshLimiter, authController.refresh);
router.get("/resume", refreshLimiter, authController.resume);
// Đăng xuất cũng phải đăng nhập (access hết hạn → frontend refresh rồi thử lại)
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
