/**
 * Lỗi nghiệp vụ có mã HTTP — ném ở service/controller, error-handler sẽ chuyển thành response JSON.
 * Lỗi không phải ApiError được coi là lỗi hệ thống (500) và không lộ chi tiết ra ngoài.
 */
export class ApiError extends Error {
  constructor(status, message, { code, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message = "Yêu cầu không hợp lệ", opts) {
    return new ApiError(400, message, { code: "BAD_REQUEST", ...opts });
  }

  static notFound(message = "Không tìm thấy tài nguyên", opts) {
    return new ApiError(404, message, { code: "NOT_FOUND", ...opts });
  }

  static payloadTooLarge(message = "File vượt quá dung lượng cho phép", opts) {
    return new ApiError(413, message, { code: "PAYLOAD_TOO_LARGE", ...opts });
  }

  static serviceUnavailable(message = "Dịch vụ tạm thời không khả dụng", opts) {
    return new ApiError(503, message, { code: "SERVICE_UNAVAILABLE", ...opts });
  }

  static conflict(message = "Dữ liệu bị trùng", opts) {
    return new ApiError(409, message, { code: "CONFLICT", ...opts });
  }
}
