import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { env } from "#config/env.js";

/**
 * Tài khoản quản trị duy nhất, cấu hình bằng ADMIN_ID / ADMIN_PASSWORD trong be/.env.
 *
 * - So khớp ID & mật khẩu bằng timingSafeEqual trên mã băm cùng độ dài → không lộ thông tin qua
 *   thời gian phản hồi (không đoán dần được từng ký tự).
 * - `credentialFingerprint`: HMAC của ID + mật khẩu (không suy ngược ra mật khẩu). Gắn vào token
 *   và phiên; khi đổi ID / mật khẩu trong .env, dấu vân tay đổi → mọi phiên cũ tự hết hiệu lực.
 */
const digest = (value) => createHash("sha256").update(String(value), "utf8").digest();
const same = (a, b) => timingSafeEqual(digest(a), digest(b));

export const adminConfigured = () => Boolean(env.ADMIN_ID && env.ADMIN_PASSWORD);

export const adminUser = () => ({
  id: env.ADMIN_ID,
  username: env.ADMIN_ID,
  name: env.ADMIN_NAME,
  role: "admin",
});

/** true nếu ID + mật khẩu khớp. Luôn so sánh cả hai (không dừng sớm khi ID sai). */
export function checkAdminCredentials(username, password) {
  if (!adminConfigured()) return false;
  const idOk = same(username, env.ADMIN_ID);
  const pwOk = same(password, env.ADMIN_PASSWORD);
  return idOk && pwOk;
}

export const credentialFingerprint = () =>
  createHmac("sha256", env.JWT_ACCESS_SECRET)
    .update(`${env.ADMIN_ID}\u0000${env.ADMIN_PASSWORD}`)
    .digest("hex")
    .slice(0, 24);
