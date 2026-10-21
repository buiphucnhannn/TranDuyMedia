/**
 * Hoàn tác xoá — cách DUY NHẤT để lấy lại dữ liệu đã xoá: nút "Hoàn tác" trên toast (hiện 8 giây).
 * Máy chủ chỉ cho khôi phục trong khoảng này (cộng thêm thời gian dự phòng cho mạng chậm);
 * quá hạn thì bản ghi coi như đã xoá hẳn với người dùng (vẫn nằm trong DB để đối soát).
 */
export const UNDO_WINDOW_MS = 20_000;

/** Điều kiện MongoDB: bản ghi vừa bị xoá mềm trong khoảng cho phép hoàn tác. */
export const undoable = () => ({ $ne: null, $gte: new Date(Date.now() - UNDO_WINDOW_MS) });
