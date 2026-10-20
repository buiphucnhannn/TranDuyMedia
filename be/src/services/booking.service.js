import { logger } from "#config/logger.js";
import { bookingRepository } from "#repositories/booking.repository.js";
import { ApiError } from "#utils/api-error.js";

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000; // cùng SĐT gửi lại trong 10 phút → coi là trùng

/**
 * TẦNG SERVICE — nghiệp vụ của yêu cầu đặt lịch. Không biết gì về HTTP (req/res) hay cách lưu trữ;
 * nhận repository qua constructor để dễ thay thế / viết test.
 */
export class BookingService {
  constructor(repo = bookingRepository) {
    this.repo = repo;
  }

  async create({ website, ...input }) {
    // Honeypot bị điền → bot: trả về như thành công nhưng không lưu
    if (website) {
      logger.warn("Chặn yêu cầu đặt lịch từ bot (honeypot)");
      return { id: null, status: "pending", createdAt: new Date().toISOString(), spam: true };
    }
    const dup = await this.repo.findRecentByPhone(input.phone, DUPLICATE_WINDOW_MS);
    if (dup) {
      throw ApiError.conflict(
        "Bạn vừa gửi yêu cầu, chúng tôi sẽ liên hệ sớm. Vui lòng không gửi lại.",
        {
          code: "DUPLICATE_BOOKING",
        },
      );
    }
    const booking = await this.repo.create({ ...input, status: "pending" });
    logger.info("Yêu cầu đặt lịch mới", { id: booking.id, service: booking.service });
    // TODO: gửi thông báo cho studio (email / Zalo OA / Telegram) — đặt ở đây, không ở controller
    return booking;
  }

  /** Danh sách cho trang quản trị + số lượng theo trạng thái (cho các tab). */
  async list({ status, q, page, limit }) {
    const filter = this.repo.buildFilter({ status, q });
    const [result, counts] = await Promise.all([
      this.repo.findAll({ filter, page, limit }),
      this.repo.countByStatus(filter),
    ]);
    return { ...result, counts };
  }

  async getById(id) {
    const booking = await this.repo.findById(id);
    if (!booking) throw ApiError.notFound("Không tìm thấy yêu cầu đặt lịch");
    return booking;
  }

  /** Chỉ xoá được yêu cầu đã giải quyết (xoá mềm). */
  async remove(id, by) {
    const booking = await this.repo.findById(id);
    if (!booking)
      throw ApiError.notFound("Yêu cầu này không còn tồn tại hoặc đã được xoá trước đó.");
    if (booking.status !== "resolved") {
      throw ApiError.conflict("Chỉ xoá được yêu cầu ở trạng thái “Đã giải quyết”.", {
        code: "BOOKING_NOT_RESOLVED",
      });
    }
    // Điều kiện kiểm tra lại trong cùng câu lệnh → không lỡ xoá nếu trạng thái vừa bị đổi
    if (!(await this.repo.softDelete(id, { requiredStatus: "resolved", by }))) {
      throw ApiError.conflict("Trạng thái yêu cầu vừa thay đổi, vui lòng tải lại danh sách.", {
        code: "BOOKING_CHANGED",
      });
    }
    logger.info("Đã xoá yêu cầu đặt lịch", { id, by });
  }

  async updateStatus(id, status) {
    const booking = await this.repo.update(id, { status, statusChangedAt: new Date() });
    if (!booking) throw ApiError.notFound("Không tìm thấy yêu cầu đặt lịch");
    return booking;
  }
}

export const bookingService = new BookingService();
