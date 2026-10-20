import { Session } from "#models/session.model.js";
import { MongoRepository } from "#repositories/base.repository.js";

export class SessionRepository extends MongoRepository {
  constructor() {
    super(Session);
  }

  findByTokenHash(tokenHash) {
    return this.findOne({ tokenHash });
  }

  /**
   * Thu hồi phiên NGUYÊN TỬ: chỉ thành công nếu phiên còn hiệu lực (chưa bị thu hồi).
   * Hai request refresh đồng thời với cùng token → chỉ một request thắng.
   */
  async revokeIfActive(id, replacedBy = null) {
    const res = await this.model.updateOne(
      { _id: id, revokedAt: null },
      { $set: { revokedAt: new Date(), replacedBy } },
    );
    return res.modifiedCount === 1;
  }

  /** Giữ lại tối đa `keep` phiên mới nhất còn hiệu lực, thu hồi các phiên cũ hơn. */
  async revokeOldest(userId, keep) {
    const stale = await this.model
      .find({ user: userId, revokedAt: null })
      .sort({ createdAt: -1, _id: -1 }) // _id tăng dần theo thời điểm tạo → thứ tự chắc chắn
      .skip(keep)
      .select("_id")
      .lean();
    if (stale.length) {
      await this.model.updateMany(
        { _id: { $in: stale.map((s) => s._id) } },
        { $set: { revokedAt: new Date() } },
      );
    }
    return stale.length;
  }

  revokeAllForUser(userId) {
    return this.model.updateMany(
      { user: userId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  }
}

export const sessionRepository = new SessionRepository();
