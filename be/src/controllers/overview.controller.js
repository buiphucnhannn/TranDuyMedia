import { overviewService } from "#services/overview.service.js";
import { ok } from "#utils/response.js";

/** TẦNG CONTROLLER — trang Tổng quan của quản trị. */
export const overviewController = {
  async get(_req, res) {
    ok(res, await overviewService.get());
  },
};
