import mongoose from "mongoose";

/**
 * Phiên bản Chính sách bảo mật đang áp dụng (= ngày hiệu lực, khớp PRIVACY_POLICY.version ở fe/src/data/privacy.js).
 * Đổi nội dung chính sách → đổi phiên bản ở CẢ 2 nơi để biết mỗi khách đã đồng ý với bản nào.
 */
export const PRIVACY_VERSION = "2026-11-09";

/** Trạng thái xử lý: Chưa giải quyết → Đang liên hệ → Đã giải quyết. */
export const BOOKING_STATUSES = ["pending", "contacting", "resolved"];

// Trạng thái của phiên bản cũ → trạng thái mới (chạy 1 lần khi khởi động, xem server.js)
export const LEGACY_STATUS_MAP = {
  new: "pending",
  contacted: "contacting",
  done: "resolved",
  cancelled: "resolved",
};

/** Yêu cầu đặt lịch tư vấn gửi từ form trên website. */
const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, index: true },
    service: { type: String, default: null }, // slug dịch vụ (san-xuat-video-short…)
    date: { type: String, default: null }, // YYYY-MM-DD khách mong muốn
    budget: { type: String, default: null },
    note: { type: String, default: "", maxlength: 2000 },
    // Bằng chứng khách ĐỒNG Ý xử lý dữ liệu cá nhân (Luật Bảo vệ dữ liệu cá nhân 2025: bên kiểm soát dữ liệu
    // phải chứng minh được sự đồng ý) — thời điểm, phiên bản chính sách, nơi gửi.
    consent: {
      at: { type: Date, default: null },
      version: { type: String, default: null },
      ip: { type: String, default: null },
      userAgent: { type: String, default: null, maxlength: 300 },
    },
    status: { type: String, enum: BOOKING_STATUSES, default: "pending", index: true },
    statusChangedAt: { type: Date, default: null },
    // Xoá mềm: bản ghi vẫn còn trong DB (khôi phục / đối soát được) nhưng ẩn khỏi mọi truy vấn
    deletedAt: { type: Date, default: null, index: true },
    deletedBy: { type: String, default: null },
  },
  { timestamps: true, versionKey: false },
);

bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });

export const Booking = mongoose.models.Booking ?? mongoose.model("Booking", bookingSchema);
