import { cloudinary } from "#config/cloudinary.js";
import { env } from "#config/env.js";
import { logger } from "#config/logger.js";
import { mediaRepository } from "#repositories/media.repository.js";
import { ApiError } from "#utils/api-error.js";
import { downloadRemoteFile } from "#utils/remote-file.js";

/**
 * TẦNG SERVICE — ảnh & video. Upload lên Cloudinary rồi lưu metadata vào MongoDB (qua repository).
 * Nếu lưu DB thất bại sau khi upload → xoá file vừa upload trên Cloudinary để không bị "rác".
 */
export class MediaService {
  constructor(repo = mediaRepository, storage = cloudinary) {
    this.repo = repo;
    this.storage = storage;
  }

  /** Lỗi Cloudinary → thông báo dễ hiểu (key thiếu quyền, hết dung lượng…). */
  static explain(err, fallback) {
    const msg = String(err?.message ?? err?.error?.message ?? "");
    if (/missing permissions/i.test(msg) || err?.http_code === 403) {
      return ApiError.serviceUnavailable(
        "Tài khoản Cloudinary chưa cho phép tải tệp lên. Vui lòng dùng API key có quyền upload.",
        { code: "CLOUDINARY_FORBIDDEN" },
      );
    }
    if (/file size too large/i.test(msg))
      return ApiError.payloadTooLarge("Tệp vượt quá dung lượng Cloudinary cho phép");
    return ApiError.serviceUnavailable(fallback);
  }

  #ensureConfigured() {
    if (!env.hasCloudinary) {
      throw ApiError.serviceUnavailable(
        "Hệ thống lưu trữ ảnh / video chưa được thiết lập. Vui lòng liên hệ kỹ thuật.",
        { code: "STORAGE_NOT_CONFIGURED" },
      );
    }
  }

  /** Đẩy buffer lên Cloudinary qua stream (không ghi file tạm). Video lớn → upload theo từng phần 20MB. */
  #uploadBuffer(buffer, options) {
    return new Promise((resolve, reject) => {
      const done = (err, result) => (err ? reject(err) : resolve(result));
      const chunked = options.resource_type === "video" && buffer.length > 20 * 1024 * 1024;
      const stream = chunked
        ? this.storage.uploader.upload_chunked_stream({ ...options, chunk_size: 20_000_000 }, done)
        : this.storage.uploader.upload_stream(options, done);
      stream.end(buffer);
    });
  }

  /** Ảnh đại diện của video Cloudinary: khung hình giây thứ 1, định dạng jpg. */
  static posterOf(result) {
    if (result.resource_type !== "video") return null;
    return (
      result.secure_url
        // so_auto: Cloudinary tự chọn khung hình đẹp nhất (tránh khung đen ở đầu video)
        .replace("/upload/", "/upload/so_auto,q_auto/")
        .replace(/\.[a-z0-9]+$/i, ".jpg")
    );
  }

  #record(result, { target, alt = "", tags = [] }) {
    return this.repo.create({
      publicId: result.public_id,
      type: result.resource_type === "video" ? "video" : "image",
      url: result.secure_url,
      poster: MediaService.posterOf(result),
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
      folder: target,
      alt,
      tags,
    });
  }

  /**
   * Thêm tệp từ link:
   * - YouTube / Vimeo → trả về dạng nhúng (không tải về).
   * - Link ảnh / video trực tiếp → máy chủ tải về (như trình duyệt) rồi lưu lên Cloudinary như tệp upload.
   */
  async importFromUrl(url, { folder = "" } = {}) {
    const embed = MediaService.parseEmbed(url);
    if (embed) return embed;
    this.#ensureConfigured();
    const target = [env.CLOUDINARY_FOLDER, folder].filter(Boolean).join("/");

    // Máy chủ tự tải tệp về (giả lập trình duyệt) rồi đẩy lên Cloudinary như tệp upload thường —
    // nhiều trang chặn máy chủ của Cloudinary tải trực tiếp, hoặc link không có đuôi .jpg/.mp4.
    let file;
    try {
      file = await downloadRemoteFile(url, {
        maxImageMb: env.UPLOAD_MAX_IMAGE_MB,
        maxVideoMb: env.UPLOAD_MAX_VIDEO_MB,
      });
    } catch (err) {
      logger.warn("Không tải được tệp từ link", { url, message: err.message });
      throw err;
    }

    let result;
    try {
      result = await this.#uploadBuffer(file.buffer, { folder: target, resource_type: file.kind });
    } catch (err) {
      logger.warn("Cloudinary từ chối tệp tải từ link", { url, message: err?.message });
      if (/invalid image|unsupported|not a valid/i.test(String(err?.message))) {
        throw ApiError.badRequest("Tệp ở link này bị hỏng hoặc định dạng chưa được hỗ trợ.", {
          code: "IMPORT_FAILED",
        });
      }
      throw MediaService.explain(err, "Chưa lưu được tệp lên kho lưu trữ, vui lòng thử lại.");
    }
    return this.#record(result, { target });
  }

  /** YouTube / Vimeo → { type: "embed", url (link nhúng), poster } */
  static parseEmbed(raw) {
    let u;
    try {
      u = new URL(raw);
    } catch {
      return null;
    }
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "youtube-nocookie.com")
      id =
        u.searchParams.get("v") || u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,})/)?.[1];
    if (id && /^[\w-]{6,20}$/.test(id)) {
      return {
        type: "embed",
        url: `https://www.youtube-nocookie.com/embed/${id}`,
        poster: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        publicId: null,
      };
    }
    const vimeo =
      host === "vimeo.com" || host === "player.vimeo.com"
        ? u.pathname.match(/(\d{6,})/)?.[1]
        : null;
    if (vimeo) {
      return {
        type: "embed",
        url: `https://player.vimeo.com/video/${vimeo}`,
        poster: null,
        publicId: null,
      };
    }
    return null;
  }

  async upload(file, { folder = "", alt = "", tags = [] } = {}) {
    this.#ensureConfigured();
    const target = [env.CLOUDINARY_FOLDER, folder].filter(Boolean).join("/");

    let result;
    try {
      result = await this.#uploadBuffer(file.buffer, {
        folder: target,
        resource_type: file.kind, // "image" | "video"
        use_filename: true,
        unique_filename: true,
        tags,
      });
    } catch (err) {
      logger.error("Upload Cloudinary thất bại", { message: err.message });
      throw MediaService.explain(err, "Không tải được tệp lên, vui lòng thử lại.");
    }

    try {
      return await this.#record(result, { target, alt, tags });
    } catch (err) {
      await this.storage.uploader
        .destroy(result.public_id, { resource_type: file.kind })
        .catch(() => {});
      throw err;
    }
  }

  list({ type, folder, tag, page, limit }) {
    const filter = {};
    if (type) filter.type = type;
    if (folder) filter.folder = folder;
    if (tag) filter.tags = tag;
    return this.repo.findAll({ filter, page, limit });
  }

  async getById(id) {
    const media = await this.repo.findById(id);
    if (!media) throw ApiError.notFound("Không tìm thấy file");
    return media;
  }

  async update(id, patch) {
    const media = await this.repo.update(id, patch);
    if (!media) throw ApiError.notFound("Không tìm thấy file");
    return media;
  }

  /** Xoá trên Cloudinary trước, thành công mới xoá metadata trong DB. */
  async remove(id) {
    this.#ensureConfigured();
    const media = await this.getById(id);
    const res = await this.storage.uploader.destroy(media.publicId, {
      resource_type: media.type,
      invalidate: true,
    });
    if (res.result !== "ok" && res.result !== "not found") {
      throw ApiError.serviceUnavailable("Không xoá được file trên Cloudinary");
    }
    await this.repo.delete(id);
  }
}

export const mediaService = new MediaService();
