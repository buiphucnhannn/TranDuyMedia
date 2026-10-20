import multer from "multer";
import { env } from "#config/env.js";
import { ApiError } from "#utils/api-error.js";

/**
 * Nhận file upload vào bộ nhớ (không ghi đĩa) rồi media.service đẩy thẳng lên Cloudinary.
 * - Chỉ nhận ảnh (jpeg/png/webp/avif/gif) và video (mp4/quicktime/webm).
 * - Multer giới hạn theo mức lớn nhất (video); ảnh vượt UPLOAD_MAX_IMAGE_MB bị chặn ở bước sau.
 */
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MB = 1024 * 1024;

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.UPLOAD_MAX_VIDEO_MB * MB, files: 1 },
  fileFilter: (_req, file, cb) => {
    if ([...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.mimetype)) return cb(null, true);
    cb(
      ApiError.badRequest(`Định dạng ${file.mimetype} không được hỗ trợ`, {
        code: "UNSUPPORTED_MEDIA",
      }),
    );
  },
});

/** Middleware nhận 1 file ở field `file`, gắn `req.file.kind` = "image" | "video". */
export const uploadSingle = (field = "file") => [
  uploader.single(field),
  (req, _res, next) => {
    if (!req.file) return next(ApiError.badRequest(`Thiếu file ở field "${field}"`));
    const kind = req.file.mimetype.startsWith("video/") ? "video" : "image";
    if (kind === "image" && req.file.size > env.UPLOAD_MAX_IMAGE_MB * MB) {
      return next(ApiError.payloadTooLarge(`Ảnh tối đa ${env.UPLOAD_MAX_IMAGE_MB}MB`));
    }
    req.file.kind = kind;
    next();
  },
];
