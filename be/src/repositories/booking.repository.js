import { BOOKING_STATUSES, Booking, LEGACY_STATUS_MAP } from "#models/booking.model.js";
import { MongoRepository } from "#repositories/base.repository.js";
import { undoable } from "#utils/undo.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Repository cho yêu cầu đặt lịch tư vấn (form "Đặt lịch tư vấn miễn phí" trên website).
 * Truy vấn đặc thù của booking đặt ở đây để service không phải biết cách lưu trữ.
 */
export class BookingRepository extends MongoRepository {
  constructor() {
    super(Booking);
  }

  // ---- Mọi truy vấn chỉ thấy bản ghi CHƯA xoá mềm ----
  findById(id) {
    return this.findOne({ _id: id, deletedAt: null });
  }

  async update(id, patch) {
    const doc = await this.model
      .findOneAndUpdate({ _id: id, deletedAt: null }, patch, { new: true, runValidators: true })
      .lean();
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: String(_id), ...rest };
  }

  /** Xoá mềm có điều kiện, nguyên tử: chỉ khi bản ghi còn tồn tại và đang ở `requiredStatus`. */
  async softDelete(id, { requiredStatus, by }) {
    const res = await this.model.updateOne(
      { _id: id, deletedAt: null, status: requiredStatus },
      { $set: { deletedAt: new Date(), deletedBy: by } },
    );
    return res.modifiedCount === 1;
  }

  /** Hoàn tác xoá — chỉ trong vài giây ngay sau khi xoá (xem utils/undo.js). */
  async restore(id) {
    const doc = await this.model
      .findOneAndUpdate(
        { _id: id, deletedAt: undoable() },
        { $set: { deletedAt: null, deletedBy: null } },
        { new: true },
      )
      .lean();
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: String(_id), ...rest };
  }

  /** Yêu cầu cùng số điện thoại gửi trong `withinMs` gần nhất (chống gửi trùng). */
  findRecentByPhone(phone, withinMs) {
    return this.findOne(
      { phone, deletedAt: null, createdAt: { $gte: new Date(Date.now() - withinMs) } },
      { sort: { createdAt: -1 } },
    );
  }

  /** Bộ lọc danh sách quản trị: trạng thái + tìm theo tên / SĐT (đã escape → không chèn regex). */
  buildFilter({ status, q } = {}) {
    const filter = { deletedAt: null };
    if (status) filter.status = status;
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      const digits = q.replace(/\D/g, "");
      filter.$or = [{ name: rx }, ...(digits.length >= 3 ? [{ phone: new RegExp(digits) }] : [])];
    }
    return filter;
  }

  /** Số yêu cầu theo từng trạng thái (cho các tab), áp cùng điều kiện tìm kiếm. */
  async countByStatus(filter = {}) {
    const rest = { ...filter };
    delete rest.status;
    const rows = await this.model.aggregate([
      { $match: rest },
      { $group: { _id: "$status", n: { $sum: 1 } } },
    ]);
    const counts = Object.fromEntries(BOOKING_STATUSES.map((s) => [s, 0]));
    for (const r of rows) if (r._id in counts) counts[r._id] = r.n;
    counts.all = Object.values(counts).reduce((a, b) => a + b, 0);
    return counts;
  }

  // ---- Thống kê cho trang Tổng quan ----

  /** Số yêu cầu mỗi ngày kể từ `since`, gom theo ngày ở múi giờ `timezone` → [{ date: "YYYY-MM-DD", n }]. */
  async dailyCounts(since, timezone) {
    const rows = await this.model.aggregate([
      { $match: { deletedAt: null, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone } },
          n: { $sum: 1 },
        },
      },
    ]);
    return rows.map((r) => ({ date: r._id, n: r.n }));
  }

  /** Số yêu cầu theo dịch vụ (slug; null = chưa chọn), nhiều nhất trước. */
  async countByService() {
    const rows = await this.model.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: "$service", n: { $sum: 1 } } },
      { $sort: { n: -1 } },
    ]);
    return rows.map((r) => ({ service: r._id ?? null, n: r.n }));
  }

  countSince(since) {
    return this.model.countDocuments({ deletedAt: null, createdAt: { $gte: since } });
  }

  countBetween(from, to) {
    return this.model.countDocuments({ deletedAt: null, createdAt: { $gte: from, $lt: to } });
  }

  /** Yêu cầu chưa xong (chưa giải quyết / đang liên hệ), mới nhất trước. */
  async recentOpen(limit = 5) {
    const { items } = await this.findAll({
      filter: { deletedAt: null, status: { $in: ["pending", "contacting"] } },
      sort: { createdAt: -1 },
      limit,
    });
    return items;
  }

  /** Yêu cầu "Chưa giải quyết" đã chờ lâu nhất (để nhắc xử lý). */
  oldestPending() {
    return this.findOne({ deletedAt: null, status: "pending" }, { sort: { createdAt: 1 } });
  }

  /** Chuyển trạng thái cũ (new/contacted/done/cancelled) sang bộ 3 trạng thái mới. */
  async migrateLegacyStatuses() {
    let changed = 0;
    for (const [from, to] of Object.entries(LEGACY_STATUS_MAP)) {
      const r = await this.model.updateMany({ status: from }, { $set: { status: to } });
      changed += r.modifiedCount;
    }
    return changed;
  }
}

export const bookingRepository = new BookingRepository();
