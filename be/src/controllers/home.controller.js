import { homeService } from "#services/home.service.js";
import { ok } from "#utils/response.js";

/** TẦNG CONTROLLER — nội dung trang chủ. */
export const homeController = {
  async get(_req, res) {
    ok(res, await homeService.get());
  },
  async update(req, res) {
    ok(res, await homeService.update(req.validated.body));
  },
  async checkVideo(req, res) {
    ok(res, await homeService.checkVideo(req.validated.body.url));
  },
};
