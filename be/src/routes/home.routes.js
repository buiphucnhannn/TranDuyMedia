import { Router } from "express";
import { homeController } from "#controllers/home.controller.js";
import { requireAdmin } from "#middlewares/auth.js";
import { validate } from "#middlewares/validate.js";
import {
  checkVideoSchema,
  updateFeaturesSchema,
  updateHomeSchema,
} from "#validators/home.validator.js";

const router = Router();
const noStore = (_req, res, next) => (res.set("Cache-Control", "no-store"), next());

// Công khai: website đọc để hiển thị trang chủ
router.get("/", noStore, homeController.get);
// Quản trị: lưu toàn bộ nội dung trang chủ
router.put("/", requireAdmin, noStore, validate(updateHomeSchema), homeController.update);
// Quản trị: bật / tắt các mục của website (vd. trang Sản phẩm)
router.patch(
  "/features",
  requireAdmin,
  noStore,
  validate(updateFeaturesSchema),
  homeController.setFeatures,
);
// Quản trị: kiểm tra link video (YouTube / Google Drive) trước khi lưu
router.post(
  "/video-check",
  requireAdmin,
  noStore,
  validate(checkVideoSchema),
  homeController.checkVideo,
);

export default router;
