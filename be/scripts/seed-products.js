/**
 * Đồng bộ dữ liệu sản phẩm mẫu (trước đây viết cứng ở fe/src/data/products.js) lên MongoDB.
 *   npm run seed:products            → thêm các sản phẩm chưa có (bỏ qua slug đã tồn tại)
 *   npm run seed:products -- --force → ghi đè thông tin + ảnh của các sản phẩm mẫu
 *   npm run seed:products -- --local → không upload, dùng ảnh tĩnh của website (/images/...)
 *
 * Ảnh lấy từ fe/public/images/... và được upload lên Cloudinary (thư mục <CLOUDINARY_FOLDER>/products/<slug>).
 * public_id cố định theo tên file → chạy lại không tạo bản trùng. Chưa cấu hình Cloudinary → giữ đường dẫn
 * tĩnh của website (/images/...).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cloudinary } from "#config/cloudinary.js";
import { connectDatabase, disconnectDatabase } from "#config/database.js";
import { env } from "#config/env.js";
import { IMAGE_UPLOAD } from "#services/media.service.js";
import { Product } from "#models/product.model.js";

const force = process.argv.includes("--force");
const local = process.argv.includes("--local") || !env.hasCloudinary;
const root = path.resolve(import.meta.dirname, "..", "..");
const seed = JSON.parse(
  await readFile(path.join(import.meta.dirname, "seed-products.json"), "utf8"),
);

async function uploadLocal(file, slug) {
  if (local) return { type: "image", url: file, publicId: null };
  const r = await cloudinary.uploader.upload(path.join(root, "fe", "public", file), {
    folder: `${env.CLOUDINARY_FOLDER}/products/${slug}`,
    public_id: path.parse(file).name,
    overwrite: force,
    unique_filename: false,
    resource_type: "image",
    ...IMAGE_UPLOAD, // lưu dạng WebP như ảnh upload từ trang quản trị
  });
  return {
    type: "image",
    url: r.secure_url,
    publicId: r.public_id,
    width: r.width,
    height: r.height,
  };
}

await connectDatabase(undefined, { retries: 1 });
let created = 0;
let skipped = 0;
try {
  if (local) console.log("ℹ️  Dùng ảnh tĩnh của website (/images/...), không upload Cloudinary.");
  for (const p of seed) {
    const exists = await Product.exists({ slug: p.slug, deletedAt: null });
    if (exists && !force) {
      console.log(`↷ Bỏ qua ${p.slug} (đã có)`);
      skipped++;
      continue;
    }
    process.stdout.write(`↑ ${p.slug}: `);
    const media = [];
    for (const m of p.media) {
      media.push({ ...(await uploadLocal(m.file, p.slug)), pos: m.pos, alt: `${p.title}` });
      process.stdout.write(".");
    }
    const info = { ...p };
    delete info.media;
    await Product.findOneAndUpdate(
      { slug: p.slug, deletedAt: null },
      { $set: { ...info, media, published: true } },
      { upsert: true, setDefaultsOnInsert: true },
    );
    console.log(` ${media.length} ảnh ✓`);
    created++;
  }
  console.log(`\n✅ Xong: ${created} sản phẩm được đồng bộ, ${skipped} bỏ qua.`);
} finally {
  await disconnectDatabase();
}
