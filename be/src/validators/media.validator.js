import { z } from "zod";
import { MEDIA_TYPES } from "#models/media.model.js";
import { paginationQuery } from "#validators/common.validator.js";

/** Field văn bản đi kèm file khi upload (multipart/form-data). */
export const uploadMediaSchema = z.object({
  // Thư mục con trong CLOUDINARY_FOLDER, vd "san-pham/bo-anh-giang-sinh"
  folder: z
    .string()
    .trim()
    .regex(/^[a-z0-9/_-]*$/i, "Tên thư mục chỉ gồm chữ, số, - _ /")
    .max(120)
    .optional()
    .default(""),
  alt: z.string().trim().max(300).optional().default(""),
  // "tag1,tag2"
  tags: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
});

export const listMediaQuerySchema = z.object({
  type: z.enum(MEDIA_TYPES).optional(),
  folder: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  ...paginationQuery,
});

export const updateMediaSchema = z
  .object({
    alt: z.string().trim().max(300).optional(),
    tags: z.array(z.string().trim().min(1)).max(30).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "Cần ít nhất một trường để cập nhật");
