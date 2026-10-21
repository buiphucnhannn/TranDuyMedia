import { bookingService } from "#services/booking.service.js";
import { created, ok } from "#utils/response.js";

/**
 * TẦNG CONTROLLER — chỉ nhận dữ liệu đã validate (req.validated), gọi service và trả response.
 * Không chứa nghiệp vụ. Express 5 tự chuyển lỗi của hàm async sang error-handler.
 */
export const bookingController = {
  async create(req, res) {
    const booking = await bookingService.create(req.validated.body);
    created(res, { id: booking.id, status: booking.status, createdAt: booking.createdAt });
  },

  async list(req, res) {
    const { items, total, page, limit, counts } = await bookingService.list(req.validated.query);
    ok(res, items, {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      counts,
    });
  },

  async getById(req, res) {
    ok(res, await bookingService.getById(req.validated.params.id));
  },

  async remove(req, res) {
    await bookingService.remove(req.validated.params.id, req.user.id);
    res.status(204).end();
  },

  async restore(req, res) {
    ok(res, await bookingService.restore(req.validated.params.id, req.user.id));
  },

  async updateStatus(req, res) {
    ok(res, await bookingService.updateStatus(req.validated.params.id, req.validated.body.status));
  },
};
