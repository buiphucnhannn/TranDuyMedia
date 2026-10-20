import rateLimit from "express-rate-limit";

const DEFAULT_MESSAGE = "Bạn thao tác hơi nhanh. Vui lòng đợi một chút rồi thử lại.";

/**
 * Bộ giới hạn tần suất dùng chung — khi bị chặn luôn trả lỗi THÂN THIỆN:
 * - Request gọi API (fetch)            → JSON { success: false, error: { code, message } } + mã 429.
 * - Điều hướng trình duyệt (/auth/resume) → chuyển sang trang /429 của website (có nút thử lại),
 *   thay vì hiện dòng chữ trơn "Too many requests".
 * message: câu báo lỗi tiếng Việt (mặc định DEFAULT_MESSAGE).
 */
export function limiter({ message = DEFAULT_MESSAGE, ...options }) {
  return rateLimit({
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ...options,
    handler(req, res, _next, opts) {
      const retryAfter = Math.max(
        1,
        Math.ceil(((req.rateLimit?.resetTime?.getTime() ?? Date.now()) - Date.now()) / 1000),
      );
      res.setHeader("Retry-After", String(retryAfter));

      if (req.method === "GET" && req.originalUrl.startsWith("/api/v1/auth/resume")) {
        const raw = String(req.query.next ?? "/admin");
        const next =
          raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\") ? raw : "/admin";
        const url = `/429?next=${encodeURIComponent(next.replace(/[?&]resumed=1/, ""))}&retry=${retryAfter}`;
        return res.redirect(303, url);
      }

      res.status(opts.statusCode).json({
        success: false,
        error: { code: "TOO_MANY_REQUESTS", message, retryAfter },
      });
    },
  });
}
