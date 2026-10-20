import { Router } from "express";
import { overviewController } from "#controllers/overview.controller.js";
import { requireAdmin } from "#middlewares/auth.js";

const router = Router();

// Số liệu nội bộ (có thông tin khách hàng) → chỉ admin, không cache ở bất kỳ đâu
router.get(
  "/",
  requireAdmin,
  (_req, res, next) => (res.set("Cache-Control", "no-store"), next()),
  overviewController.get,
);

export default router;
