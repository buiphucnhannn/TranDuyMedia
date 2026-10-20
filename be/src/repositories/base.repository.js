/**
 * TẦNG REPOSITORY — chỉ lo đọc/ghi dữ liệu (MongoDB qua Mongoose), không chứa nghiệp vụ.
 * Repository cụ thể kế thừa lớp này và thêm truy vấn đặc thù. Service chỉ gọi các phương thức
 * dưới đây nên không phụ thuộc trực tiếp vào Mongoose.
 *
 * Mọi kết quả trả về là object thuần (lean) với `id` dạng chuỗi thay cho `_id`.
 */
const toPlain = (doc) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
};

export class MongoRepository {
  constructor(model) {
    this.model = model;
  }

  /** Danh sách có lọc / sắp xếp / phân trang. */
  async findAll({ filter = {}, sort = { createdAt: -1 }, page = 1, limit = 20 } = {}) {
    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.model.countDocuments(filter),
    ]);
    return { items: docs.map(toPlain), total, page, limit };
  }

  async findOne(filter, { sort } = {}) {
    return toPlain(await this.model.findOne(filter).sort(sort).lean());
  }

  async findById(id) {
    return toPlain(await this.model.findById(id).lean());
  }

  async create(data) {
    const doc = await this.model.create(data);
    return toPlain(doc.toObject());
  }

  async update(id, patch) {
    return toPlain(
      await this.model.findByIdAndUpdate(id, patch, { new: true, runValidators: true }).lean(),
    );
  }

  async delete(id) {
    return toPlain(await this.model.findByIdAndDelete(id).lean());
  }
}
