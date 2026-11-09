import { z } from "zod";
import { HOME_HERO_SLOTS, HOME_SERVICES_MAX } from "#models/home.model.js";

const homeImage = z.object({
  // Ảnh trên Cloudinary (https) hoặc ảnh có sẵn của website (/images/... — ảnh mặc định được cắt lại)
  url: z
    .string()
    .max(1000)
    .regex(/^(https:\/\/\S+|\/images\/[\w./-]+)$/, "Ảnh không hợp lệ"),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
  pos: z
    .string()
    .trim()
    .regex(/^[\w%. -]{1,40}$/, "Vị trí cắt ảnh không hợp lệ")
    .optional()
    .default("center"),
  zoom: z.number().min(1).max(4).optional().default(1),
});

/** "Xem thêm": trang trong website ("/dich-vu/...") hoặc link ngoài đầy đủ (https://...). */
const link = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || /^\/(?!\/)[^\s]*$/.test(v) || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(v),
    "Link “Xem thêm” phải là trang trong website (bắt đầu bằng /) hoặc link đầy đủ (https://...)",
  );

const serviceCard = z.object({
  name: z
    .string({ error: "Vui lòng nhập tên thẻ" })
    .trim()
    .min(1, "Vui lòng nhập tên thẻ")
    .max(60, "Tên thẻ tối đa 60 ký tự"),
  desc: z.string().trim().max(160, "Mô tả tối đa 160 ký tự").optional().default(""),
  image: homeImage.nullable().optional().default(null),
  link: link.optional().default(""),
  booking: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/)
    .max(80)
    .optional()
    .default(""),
});

export const updateHomeSchema = z.object({
  hero: z
    .array(homeImage.nullable())
    .max(HOME_HERO_SLOTS, `Tối đa ${HOME_HERO_SLOTS} ảnh hero`)
    .optional()
    .default([]),
  showreel: z
    .object({
      url: z.string().trim().max(500).nullable().optional().default(null),
      poster: homeImage.nullable().optional().default(null),
      title: z.string().trim().max(80, "Tiêu đề video tối đa 80 ký tự").optional().default(""),
      caption: z.string().trim().max(120, "Dòng mô tả tối đa 120 ký tự").optional().default(""),
    })
    .optional()
    .default({}),
  intro: z
    .object({
      main: homeImage.nullable().optional().default(null),
      side: homeImage.nullable().optional().default(null),
    })
    .optional()
    .default({}),
  // null → dùng các thẻ mặc định của website
  services: z
    .array(serviceCard)
    .min(1, "Cần ít nhất 1 thẻ dịch vụ")
    .max(HOME_SERVICES_MAX, `Tối đa ${HOME_SERVICES_MAX} thẻ dịch vụ`)
    .nullable()
    .optional()
    .default(null),
});

export const checkVideoSchema = z.object({
  url: z
    .string({ error: "Vui lòng dán link video" })
    .trim()
    .min(1, "Vui lòng dán link video")
    .max(500),
});
