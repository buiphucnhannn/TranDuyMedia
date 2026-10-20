import mongoose from "mongoose";

export const MEDIA_TYPES = ["image", "video"];

/**
 * Metadata của ảnh / video đã upload lên Cloudinary. File thật nằm trên Cloudinary;
 * DB chỉ giữ publicId + URL + thông số để truy vấn, gắn vào sản phẩm và xoá khi cần.
 */
const mediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true },
    type: { type: String, enum: MEDIA_TYPES, required: true, index: true },
    url: { type: String, required: true }, // secure_url
    poster: { type: String, default: null }, // ảnh đại diện (video)
    format: String,
    bytes: Number,
    width: Number,
    height: Number,
    duration: Number, // giây (video)
    folder: { type: String, index: true },
    alt: { type: String, default: "", maxlength: 300 },
    tags: { type: [String], default: [], index: true },
  },
  { timestamps: true, versionKey: false },
);

mediaSchema.index({ createdAt: -1 });

export const Media = mongoose.models.Media ?? mongoose.model("Media", mediaSchema);
