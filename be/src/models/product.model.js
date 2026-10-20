import mongoose from "mongoose";

export const PRODUCT_KINDS = ["photo", "video"];
export const MEDIA_ITEM_TYPES = ["image", "video", "embed"]; // embed = YouTube / Vimeo

/**
 * Một tệp trong thư viện của sản phẩm. Thứ tự trong mảng = thứ tự hiển thị;
 * phần tử đầu tiên là ảnh bìa, 3 phần tử đầu là bộ ảnh tiêu biểu ở trang chi tiết.
 */
const mediaItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: MEDIA_ITEM_TYPES, required: true },
    url: { type: String, required: true, maxlength: 1000 }, // ảnh/video trên Cloudinary hoặc link nhúng
    publicId: { type: String, default: null }, // Cloudinary public_id (null nếu là link nhúng)
    poster: { type: String, default: null }, // ảnh đại diện của video / link nhúng
    pos: { type: String, default: "center" }, // điểm giữ lại khi cắt khung (object-position)
    zoom: { type: Number, default: 1, min: 1, max: 4 }, // mức phóng ảnh khi cắt khung
    width: Number,
    height: Number,
    duration: Number,
    alt: { type: String, default: "", maxlength: 300 },
  },
  { _id: false },
);

/** Sản phẩm đã thực hiện (bộ ảnh / video) — hiển thị ở /san-pham. */
const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    summary: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", trim: true, maxlength: 3000 },
    usage: { type: String, default: "", trim: true, maxlength: 300 },
    location: { type: String, default: "", trim: true, maxlength: 120 }, // bối cảnh thực hiện
    studioSet: { type: String, default: null }, // slug bối cảnh studio (liên kết thẻ bối cảnh)
    kind: { type: String, enum: PRODUCT_KINDS, default: "photo" },
    media: { type: [mediaItemSchema], default: [] },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, versionKey: false },
);

// slug duy nhất trong số sản phẩm chưa xoá
productSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
productSchema.index({ order: 1, createdAt: -1 });

export const Product = mongoose.models.Product ?? mongoose.model("Product", productSchema);
