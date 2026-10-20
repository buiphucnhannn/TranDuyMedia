import { Router } from "express";
import { limiter } from "#middlewares/rate-limit.js";
import { bookingController } from "#controllers/booking.controller.js";
import { requireAdmin } from "#middlewares/auth.js";
import { validate } from "#middlewares/validate.js";
import {
  bookingIdSchema,
  createBookingSchema,
  listBookingsQuerySchema,
  updateBookingStatusSchema,
} from "#validators/booking.validator.js";

const router = Router();

// Form công khai: giới hạn chặt hơn để chống spam (5 yêu cầu / 15 phút / IP)
const submitLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Bạn gửi quá nhiều yêu cầu, thử lại sau ít phút.",
});

router.post("/", submitLimiter, validate(createBookingSchema), bookingController.create);

// Quản trị — bắt buộc đăng nhập admin; dữ liệu khách hàng không được cache ở bất kỳ đâu
const noStore = (_req, res, next) => (res.set("Cache-Control", "no-store"), next());
router.get(
  "/",
  requireAdmin,
  noStore,
  validate(listBookingsQuerySchema, "query"),
  bookingController.list,
);
router.get(
  "/:id",
  requireAdmin,
  noStore,
  validate(bookingIdSchema, "params"),
  bookingController.getById,
);
router.patch(
  "/:id/status",
  requireAdmin,
  noStore,
  validate(bookingIdSchema, "params"),
  validate(updateBookingStatusSchema),
  bookingController.updateStatus,
);
router.delete(
  "/:id",
  requireAdmin,
  noStore,
  validate(bookingIdSchema, "params"),
  bookingController.remove,
);

export default router;
