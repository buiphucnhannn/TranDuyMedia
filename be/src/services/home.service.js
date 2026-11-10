import { logger } from "#config/logger.js";
import { Home } from "#models/home.model.js";
import { Product } from "#models/product.model.js";
import { assetsOf } from "#services/product.service.js";
import { MediaService, mediaService } from "#services/media.service.js";
import { ApiError } from "#utils/api-error.js";

const KEY = "home";
const TIMEOUT = 8000;

/** Mọi tệp Cloudinary của website đang được trang chủ dùng → Map<public_id, "image">. */
function homeAssets(h) {
  const out = new Map();
  const add = (img) => {
    const id = MediaService.publicIdOf(img?.url);
    if (id) out.set(id, "image");
  };
  (h?.hero ?? []).forEach(add);
  add(h?.showreel?.poster);
  add(h?.intro?.main);
  add(h?.intro?.side);
  (h?.services ?? []).forEach((s) => add(s.image));
  return out;
}

const badLink = (message) => ApiError.badRequest(message, { code: "VIDEO_LINK_INVALID" });

/** Gọi thử một địa chỉ (không tải nội dung lớn). Lỗi mạng → null (không chặn việc lưu). */
async function probe(url, init = {}) {
  try {
    return await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(TIMEOUT), ...init });
  } catch {
    return null;
  }
}

/** TẦNG SERVICE — nội dung trang chủ (ảnh hero, video showreel, ảnh giới thiệu, thẻ dịch vụ). */
export class HomeService {
  async get() {
    const doc = await Home.findOne({ key: KEY }).lean();
    return doc ? HomeService.toDto(doc) : HomeService.toDto({});
  }

  static toDto(d) {
    return {
      hero: d.hero ?? [],
      showreel: {
        url: d.showreel?.url ?? null,
        embed: d.showreel?.embed ?? null,
        provider: d.showreel?.provider ?? null,
        autoPoster: d.showreel?.autoPoster ?? null,
        poster: d.showreel?.poster ?? null,
        title: d.showreel?.title ?? "",
        caption: d.showreel?.caption ?? "",
      },
      intro: { main: d.intro?.main ?? null, side: d.intro?.side ?? null },
      services: d.services?.length ? d.services : null,
      features: { products: Boolean(d.features?.products) },
      updatedAt: d.updatedAt ?? null,
    };
  }

  /**
   * Kiểm tra link video showreel: chỉ nhận YouTube (công khai / không công khai) hoặc Google Drive
   * đã chia sẻ "Bất kỳ ai có đường liên kết". Trả { url, embed, provider, autoPoster }.
   */
  async checkVideo(raw) {
    const url = raw.trim();
    const embed = MediaService.parseEmbed(url);
    const provider = embed?.url.includes("youtube")
      ? "youtube"
      : embed?.url.includes("drive.google")
        ? "drive"
        : null;
    if (!provider)
      throw badLink(
        "Chỉ hỗ trợ link YouTube (công khai hoặc không công khai) hoặc Google Drive đã chia sẻ.",
      );

    if (provider === "youtube") {
      const id = embed.url.split("/embed/")[1];
      // oEmbed trả 200 cho video công khai & không công khai; video riêng tư / đã xoá → 401 / 403 / 404
      const res = await probe(
        `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`,
        { redirect: "follow" },
      );
      if (res && [401, 403].includes(res.status))
        throw badLink(
          "Video YouTube đang ở chế độ Riêng tư. Hãy chuyển sang Công khai hoặc Không công khai rồi dán lại.",
        );
      if (res && [400, 404].includes(res.status))
        throw badLink("Không tìm thấy video YouTube này. Hãy kiểm tra lại link.");
      // Ảnh bìa nét nhất có sẵn (maxres 1280×720; video cũ / độ phân giải thấp chỉ có hq 480×360)
      const max = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
      const hasMax = (await probe(max, { method: "HEAD" }))?.status === 200;
      return {
        url,
        provider,
        embed: embed.url,
        autoPoster: hasMax ? max : `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      };
    }

    // Google Drive: tệp chia sẻ công khai → trang xem trước trả 200; chưa chia sẻ / không tồn tại → 401 / 403 /
    // 404 hoặc chuyển sang trang đăng nhập Google
    const id = embed.url.match(/\/file\/d\/([\w-]+)/)[1];
    const res = await probe(embed.url);
    if (res && res.status !== 200)
      throw badLink(
        res.status === 404
          ? "Không tìm thấy tệp Google Drive này. Hãy kiểm tra lại link."
          : "Tệp Google Drive chưa được chia sẻ. Hãy bật “Bất kỳ ai có đường liên kết” (Người xem) rồi dán lại.",
      );
    if (res) {
      const page = await probe(`https://drive.google.com/file/d/${id}/view`, {
        redirect: "follow",
      });
      const mime = page?.ok
        ? (await page.text().catch(() => "")).match(
            /"(video|image|audio|application)\/[\w.+-]+"/,
          )?.[1]
        : null;
      if (mime && mime !== "video") throw badLink("Link Google Drive này không phải là video.");
    }
    return {
      url,
      provider,
      embed: embed.url,
      autoPoster: `https://drive.google.com/thumbnail?id=${id}&sz=w1920`,
    };
  }

  async update(input) {
    const before = await Home.findOne({ key: KEY }).lean();
    const showreel = { ...input.showreel, embed: null, provider: null, autoPoster: null };
    if (input.showreel.url) {
      // Link không đổi → giữ kết quả kiểm tra cũ (không gọi YouTube / Drive lại mỗi lần lưu)
      const same = before?.showreel?.url === input.showreel.url && before.showreel.embed;
      Object.assign(
        showreel,
        same
          ? {
              embed: before.showreel.embed,
              provider: before.showreel.provider,
              autoPoster: before.showreel.autoPoster,
            }
          : await this.checkVideo(input.showreel.url),
      );
    }
    const withId = (img) => (img ? { ...img, publicId: MediaService.publicIdOf(img.url) } : null);
    const data = {
      hero: input.hero.map(withId),
      showreel: { ...showreel, poster: withId(showreel.poster) },
      intro: { main: withId(input.intro.main), side: withId(input.intro.side) },
    };
    // Thẻ dịch vụ: null → bỏ thẻ đã lưu, website quay về các thẻ mặc định
    if (input.services)
      data.services = input.services.map((s) => ({ ...s, image: withId(s.image) }));
    const doc = await Home.findOneAndUpdate(
      { key: KEY },
      { $set: data, ...(input.services ? {} : { $unset: { services: 1 } }) },
      { upsert: true, new: true, runValidators: true, lean: true },
    );
    this.#purgeRemoved(before, doc); // chạy nền
    return HomeService.toDto(doc);
  }

  /** Bật / tắt các mục của website (vd. trang Sản phẩm). Không đụng tới nội dung trang chủ. */
  async setFeatures(input) {
    const $set = Object.fromEntries(Object.entries(input).map(([k, v]) => [`features.${k}`, v]));
    const doc = await Home.findOneAndUpdate(
      { key: KEY },
      { $set },
      { upsert: true, new: true, runValidators: true, lean: true },
    );
    logger.info("Đổi trạng thái hiển thị mục website", input);
    return HomeService.toDto(doc);
  }

  /** Ảnh đã bị thay khỏi trang chủ (và không sản phẩm nào dùng) → xoá khỏi Cloudinary. */
  async #purgeRemoved(before, after) {
    if (!before) return;
    try {
      const removed = homeAssets(before);
      for (const id of homeAssets(after).keys()) removed.delete(id);
      if (!removed.size) return;
      const products = await Product.find({}).lean();
      for (const p of products) for (const id of assetsOf(p).keys()) removed.delete(id);
      await mediaService.purge(removed);
    } catch (err) {
      logger.warn("Chưa dọn được ảnh cũ của trang chủ", { message: err?.message });
    }
  }
}

export const homeService = new HomeService();
