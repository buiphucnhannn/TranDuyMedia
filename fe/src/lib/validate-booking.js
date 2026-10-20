/**
 * Kiểm tra 2 trường bắt buộc của form đặt lịch — cùng quy tắc với backend
 * (be/src/validators/booking.validator.js) để báo lỗi ngay trên trình duyệt.
 */
const NAME_CHARS = /^[\p{L}\p{M}\s'.-]+$/u;

/** Chuẩn hoá họ tên: gộp dấu tách rời (NFC), bỏ khoảng trắng thừa. */
export const normalizeName = (raw) => raw.normalize("NFC").replace(/\s+/g, " ").trim();

export function validateName(raw) {
  const v = normalizeName(raw);
  if (!v) return "Vui lòng nhập họ và tên";
  if (v.length < 2) return "Họ và tên quá ngắn";
  if (v.length > 60) return "Họ và tên tối đa 60 ký tự";
  if (!NAME_CHARS.test(v) || !/\p{L}/u.test(v)) return "Chỉ nhập chữ cái và khoảng trắng";
  return null;
}

/** "+84 971.542-026" → "0971542026" */
export const normalizePhone = (raw) =>
  raw.replace(/[\s.()-]/g, "").replace(/^\+?84(?=\d{9,10}$)/, "0");

export function validatePhone(raw) {
  const v = normalizePhone(raw);
  if (!v) return "Vui lòng nhập số điện thoại";
  if (!/^\d+$/.test(v)) return "Số điện thoại chỉ gồm chữ số";
  // Di động 10 số (03/05/07/08/09) hoặc cố định 11 số (02x)
  if (!/^0[35789]\d{8}$/.test(v) && !/^02\d{9}$/.test(v))
    return "Số điện thoại chưa đúng định dạng";
  return null;
}
