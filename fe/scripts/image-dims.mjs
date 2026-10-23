/**
 * Ghi kích thước thật (rộng × cao) của mọi ảnh trong public/images + public/media vào
 * src/data/image-dims.json — SmartImage dùng để biết ảnh bị object-cover phóng bao nhiêu trong khung
 * và tải đúng bản đủ nét. Chạy lại khi thêm / đổi ảnh tĩnh: npm run images:dims
 * (chạy tự động trước mỗi lần build qua "prebuild").
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public");
const out = path.join(root, "src", "data", "image-dims.json");
const dims = {};

const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(webp|png|jpe?g|avif)$/i.test(e.name)) dims["/" + path.relative(pub, p).split(path.sep).join("/")] = p;
  }
};
for (const d of ["images", "media"]) if (fs.existsSync(path.join(pub, d))) walk(path.join(pub, d));

const result = {};
for (const [src, file] of Object.entries(dims).sort()) {
  const m = await sharp(file).metadata();
  result[src] = [m.width, m.height];
}
fs.writeFileSync(out, JSON.stringify(result) + "\n");
console.log(`image-dims: ${Object.keys(result).length} ảnh → src/data/image-dims.json`);
