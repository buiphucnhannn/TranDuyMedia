import { z } from "zod";

/** ObjectId của MongoDB (24 ký tự hex). */
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "ID không hợp lệ");

export const idParamSchema = z.object({ id: objectId });

/** Query phân trang dùng chung. */
export const paginationQuery = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};
