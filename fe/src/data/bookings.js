/**
 * Nhãn & màu cho dữ liệu yêu cầu đặt lịch — khớp với backend (be/src/models/booking.model.js,
 * be/src/validators/booking.validator.js).
 */
export const BOOKING_STATUSES = [
  {
    value: "pending",
    label: "Chưa giải quyết",
    short: "Chưa xử lý",
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 ring-orange-200",
    active: "bg-orange-500 text-white ring-orange-500",
  },
  {
    value: "contacting",
    label: "Đang liên hệ",
    short: "Đang liên hệ",
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
    active: "bg-sky-500 text-white ring-sky-500",
  },
  {
    value: "resolved",
    label: "Đã giải quyết",
    short: "Đã xong",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    active: "bg-emerald-500 text-white ring-emerald-500",
  },
];

export const statusOf = (value) =>
  BOOKING_STATUSES.find((s) => s.value === value) ?? BOOKING_STATUSES[0];

export const BUDGETS = ["Dưới 20 triệu", "20 – 50 triệu", "50 – 100 triệu", "Trên 100 triệu"];
