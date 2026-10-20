import multer from "multer";
import { env } from "#config/env.js";
import { logger } from "#config/logger.js";
import { ApiError } from "#utils/api-error.js";

/** Route không tồn tại → 404 dạng JSON thống nhất. */
export const notFound = (req, _res, next) =>
  next(ApiError.notFound(`Không tìm thấy ${req.method} ${req.originalUrl}`));

/**
 * Bộ xử lý lỗi cuối cùng (Express 5 tự chuyển lỗi của handler async vào đây).
 * - ApiError: trả đúng mã & thông điệp.
 * - Body JSON sai cú pháp: 400.
 * - Lỗi khác: 500, log đầy đủ nhưng chỉ lộ stack ra response khi không phải production.
 */
export const errorHandler = (err, req, res, _next) => {
  if (err.type === "entity.parse.failed") err = ApiError.badRequest("Body JSON không hợp lệ");
  // Lỗi của multer khi upload (quá dung lượng, sai field…)
  if (err instanceof multer.MulterError) {
    err =
      err.code === "LIMIT_FILE_SIZE"
        ? ApiError.payloadTooLarge()
        : ApiError.badRequest(`Upload không hợp lệ: ${err.message}`, { code: err.code });
  }
  // Mongoose: id sai định dạng / vi phạm unique
  if (err.name === "CastError") err = ApiError.badRequest("ID không hợp lệ");
  if (err.code === 11000) err = ApiError.conflict("Dữ liệu đã tồn tại");

  const isApi = err instanceof ApiError;
  const status = isApi ? err.status : 500;

  if (status >= 500) logger.error(err.message, { path: req.originalUrl, stack: err.stack });

  res.status(status).json({
    success: false,
    error: {
      code: isApi ? (err.code ?? "ERROR") : "INTERNAL_SERVER_ERROR",
      message: isApi ? err.message : "Đã có lỗi xảy ra, vui lòng thử lại sau",
      ...(isApi && err.details && { details: err.details }),
      ...(!env.isProd && !isApi && { stack: err.stack }),
    },
  });
};
