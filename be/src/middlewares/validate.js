import { ApiError } from "#utils/api-error.js";

/**
 * Kiểm tra req.body / req.query / req.params bằng schema zod.
 * Dữ liệu đã làm sạch được gắn vào req.validated[part] để controller dùng (không dùng thẳng req.body).
 *   router.post("/", validate(createBookingSchema), controller.create)
 *   router.get("/", validate(listQuerySchema, "query"), controller.list)
 */
export const validate =
  (schema, part = "body") =>
  (req, _res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(
        ApiError.badRequest("Dữ liệu gửi lên không hợp lệ", { code: "VALIDATION_ERROR", details }),
      );
    }
    req.validated = { ...req.validated, [part]: result.data };
    next();
  };
