import mongoose from "mongoose";

/** Số ô ảnh / thẻ cố định trên trang chủ (khớp giao diện). */
export const HOME_HERO_SLOTS = 4;
export const HOME_SERVICES_MAX = 9;

/**
 * Một ảnh trên trang chủ: ảnh GỐC trên Cloudinary + cách cắt khung (pos = điểm giữ lại, zoom = mức phóng).
 * Cắt không phá ảnh → website luôn lấy từ bản gốc, đủ nét ở mọi kích thước màn hình.
 */
const homeImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, maxlength: 1000 },
    publicId: { type: String, default: null },
    width: Number,
    height: Number,
    pos: { type: String, default: "center" },
    zoom: { type: Number, default: 1, min: 1, max: 4 },
  },
  { _id: false },
);

const serviceCardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    desc: { type: String, default: "", trim: true, maxlength: 160 },
    image: { type: homeImageSchema, default: null },
    link: { type: String, default: "", trim: true, maxlength: 500 }, // nút "Xem thêm" + bấm ảnh / tên thẻ
    booking: { type: String, default: "", trim: true, maxlength: 80 }, // dịch vụ chọn sẵn ở form tư vấn
  },
  { _id: false },
);

/**
 * Nội dung trang chủ do quản trị viên chỉnh (1 bản ghi duy nhất, key = "home").
 * Ô nào để trống (null) → website dùng nội dung mặc định có sẵn.
 */
const homeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "home" },
    hero: { type: [{ type: homeImageSchema, default: null }], default: [] },
    showreel: {
      url: { type: String, default: null, maxlength: 500 }, // link người dùng dán (YouTube / Drive)
      embed: { type: String, default: null, maxlength: 500 }, // link nhúng đã chuẩn hoá
      provider: { type: String, enum: ["youtube", "drive", null], default: null },
      autoPoster: { type: String, default: null, maxlength: 500 }, // ảnh bìa lấy từ YouTube / Drive
      poster: { type: homeImageSchema, default: null }, // ảnh bìa tự tải lên (ưu tiên)
      title: { type: String, default: "", trim: true, maxlength: 80 },
      caption: { type: String, default: "", trim: true, maxlength: 120 },
    },
    intro: {
      main: { type: homeImageSchema, default: null }, // ảnh lớn 4:5
      side: { type: homeImageSchema, default: null }, // ảnh nhỏ 1:1
    },
    services: { type: [serviceCardSchema], default: undefined }, // không có → thẻ mặc định
    // Bật / tắt các mục của website ngay trong trang quản trị (không cần sửa code)
    features: {
      // Trang "Sản phẩm" (/san-pham): hiện mục trên menu + các link dẫn tới. Mặc định ẩn.
      products: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export const Home = mongoose.models.Home ?? mongoose.model("Home", homeSchema);
