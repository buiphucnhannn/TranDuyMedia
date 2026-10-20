import mongoose from "mongoose";
import {
  adminConfigured,
  adminUser,
  checkAdminCredentials,
  credentialFingerprint,
} from "#config/admin.js";
import { env } from "#config/env.js";
import { logger } from "#config/logger.js";
import { sessionRepository } from "#repositories/session.repository.js";
import {
  REFRESH_TTL_MS,
  sha256,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "#services/token.service.js";
import { ApiError } from "#utils/api-error.js";

const INVALID = () =>
  new ApiError(401, "ID hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.", {
    code: "INVALID_CREDENTIALS",
  });
const SESSION_EXPIRED = () =>
  new ApiError(401, "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", {
    code: "SESSION_EXPIRED",
  });

/**
 * TẦNG SERVICE — đăng nhập / làm mới phiên / đăng xuất cho tài khoản quản trị (cấu hình trong .env).
 * Phiên (refresh token) lưu MongoDB để thu hồi được, xoay vòng mỗi lần làm mới.
 */
export class AuthService {
  constructor(sessions = sessionRepository) {
    this.sessions = sessions;
  }

  /** Tạo phiên mới + cặp token. */
  async #issue(user, meta) {
    const sessionId = new mongoose.Types.ObjectId();
    const refreshToken = signRefreshToken(String(sessionId), user.id);
    await this.sessions.create({
      _id: sessionId,
      user: user.id,
      credential: credentialFingerprint(),
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      userAgent: (meta.userAgent ?? "").slice(0, 300),
      ip: meta.ip ?? "",
    });
    return { accessToken: signAccessToken(user), refreshToken, sessionId };
  }

  async login({ username, password }, meta = {}) {
    if (!adminConfigured()) {
      logger.error("Chưa cấu hình ADMIN_ID / ADMIN_PASSWORD trong be/.env");
      throw ApiError.serviceUnavailable(
        "Tài khoản quản trị chưa được thiết lập. Vui lòng liên hệ kỹ thuật.",
        { code: "ADMIN_NOT_CONFIGURED" },
      );
    }
    if (!checkAdminCredentials(username, password)) {
      logger.warn("Đăng nhập thất bại", { username, ip: meta.ip });
      throw INVALID();
    }
    const user = adminUser();
    const tokens = await this.#issue(user, meta);
    // Giới hạn số thiết bị đăng nhập cùng lúc
    const kicked = await this.sessions.revokeOldest(user.id, env.MAX_SESSIONS);
    logger.info("Đăng nhập thành công", { username, ip: meta.ip, kicked });
    return { user, ...tokens };
  }

  /** Rotation: thu hồi refresh token cũ, cấp cặp token mới. */
  async refresh(refreshToken, meta = {}) {
    const payload = refreshToken && verifyRefreshToken(refreshToken);
    if (!payload || !adminConfigured()) throw SESSION_EXPIRED();

    const session = await this.sessions.findByTokenHash(sha256(refreshToken));
    if (!session || session.id !== payload.sid) throw SESSION_EXPIRED();

    // Phiên đã bị thu hồi do đăng xuất / vượt số thiết bị → chỉ đơn giản là hết hạn
    if (session.revokedAt && !session.replacedBy) throw SESSION_EXPIRED();
    if (session.revokedAt) {
      // Token ĐÃ ĐƯỢC XOAY VÒNG (có token mới thay thế) mà vẫn bị dùng lại → có thể bị đánh cắp: huỷ mọi phiên
      await this.sessions.revokeAllForUser(session.user);
      logger.warn("Phát hiện dùng lại refresh token — đã thu hồi toàn bộ phiên", { ip: meta.ip });
      throw SESSION_EXPIRED();
    }

    // ID / mật khẩu trong .env đã đổi kể từ lúc đăng nhập → phiên không còn hợp lệ
    const user = adminUser();
    if (session.user !== user.id || session.credential !== credentialFingerprint()) {
      await this.sessions.revokeIfActive(session.id);
      throw SESSION_EXPIRED();
    }

    const next = await this.#issue(user, meta);
    // Nguyên tử: nếu request khác đã kịp dùng token này thì huỷ phiên vừa tạo
    if (!(await this.sessions.revokeIfActive(session.id, next.sessionId))) {
      await this.sessions.revokeIfActive(String(next.sessionId));
      throw SESSION_EXPIRED();
    }
    return { user, ...next };
  }

  async logout(refreshToken) {
    if (!refreshToken) return;
    const session = await this.sessions.findByTokenHash(sha256(refreshToken));
    if (session) await this.sessions.revokeIfActive(session.id);
  }

  me(userId) {
    const user = adminUser();
    if (!adminConfigured() || userId !== user.id) throw SESSION_EXPIRED();
    return user;
  }
}

export const authService = new AuthService();
