import { logger } from "#config/logger.js";
import { productRepository } from "#repositories/product.repository.js";
import { ApiError } from "#utils/api-error.js";

/** "Bộ ảnh Giáng sinh!" → "bo-anh-giang-sinh" */
export const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "san-pham";

/** TẦNG SERVICE — sản phẩm đã thực hiện. */
export class ProductService {
  constructor(repo = productRepository) {
    this.repo = repo;
  }

  /** Slug duy nhất: "ten-sp", "ten-sp-2"… */
  async #uniqueSlug(wanted, exceptId) {
    let slug = wanted;
    for (let i = 2; await this.repo.slugTaken(slug, exceptId); i++) slug = `${wanted}-${i}`;
    return slug;
  }

  listPublic() {
    return this.repo.list({ publishedOnly: true });
  }

  listAll({ q } = {}) {
    return this.repo.list({ q });
  }

  async getPublicBySlug(slug) {
    const p = await this.repo.findBySlug(slug, { publishedOnly: true });
    if (!p) throw ApiError.notFound("Không tìm thấy sản phẩm");
    return p;
  }

  async getById(id) {
    const p = await this.repo.findById(id);
    if (!p) throw ApiError.notFound("Sản phẩm không còn tồn tại hoặc đã bị xoá");
    return p;
  }

  async create(input) {
    const slug = await this.#uniqueSlug(input.slug || slugify(input.title));
    const product = await this.repo.create({ ...input, slug, order: await this.repo.nextOrder() });
    logger.info("Tạo sản phẩm", { id: product.id, slug });
    return product;
  }

  async update(id, input) {
    await this.getById(id);
    const patch = { ...input };
    if (input.slug) patch.slug = await this.#uniqueSlug(input.slug, id);
    const product = await this.repo.update(id, patch);
    if (!product) throw ApiError.notFound("Sản phẩm không còn tồn tại hoặc đã bị xoá");
    return product;
  }

  async remove(id) {
    if (!(await this.repo.softDelete(id))) {
      throw ApiError.notFound("Sản phẩm không còn tồn tại hoặc đã bị xoá trước đó");
    }
    logger.info("Xoá sản phẩm", { id });
  }
}

export const productService = new ProductService();
