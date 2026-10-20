/**
 * Định dạng response thống nhất cho toàn API:
 *   thành công: { success: true, data, meta? }
 *   lỗi:        { success: false, error: { code, message, details? } }  (xem error-handler)
 */
export const ok = (res, data, meta) =>
  res.status(200).json({ success: true, data, ...(meta && { meta }) });

export const created = (res, data) => res.status(201).json({ success: true, data });
