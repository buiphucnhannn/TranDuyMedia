/**
 * Chuẩn hoá logo đối tác (public/images/partners/*.png|jpg) → WebP lossless nền trong suốt, cắt sát viền.
 * - Logo nền trắng: tách nền trắng thành trong suốt (giữ nguyên mép khử răng cưa).
 * - Logo chữ trắng trên khối màu (Elipsport, Move): đảo thành chữ màu thương hiệu trên nền trong suốt
 *   → hiển thị đồng bộ với các logo khác trên dải đối tác nền sáng.
 * - Logo đã trong suốt: chỉ cắt viền.
 * Không phóng to ảnh gốc (giữ độ nét thật). In ra bề rộng tương ứng chiều cao 160px cho data/partners.js.
 * Chạy: node scripts/partner-logos.mjs   (xoá ảnh gốc sau khi chuyển)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve(import.meta.dirname, "..", "public", "images", "partners");
const MAX_H = 480; // đủ nét cho màn hình mật độ 3x (logo hiển thị cao tối đa ~52px)

// Logo chữ trắng trên khối màu → màu dùng cho phần chữ sau khi bỏ khối nền
// (Elipsport & Move hiện dùng nguyên khối đỏ chính thức — xử lý riêng, không đi qua bước đảo màu này)
const ON_COLOR = { elipsport: [237, 28, 36], move: [171, 30, 36] };

const slug = (f) => path.parse(f).name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

for (const file of fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f))) {
  const name = slug(file);
  const src = path.join(dir, file);
  const meta = await sharp(src).metadata();
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  const out = Buffer.alloc(px * 4);
  const tint = ON_COLOR[name];
  // nền đã trong suốt sẵn ở góc → giữ nguyên
  const transparent = meta.hasAlpha && data[3] < 10;

  for (let i = 0; i < px; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a0 = data[i * 4 + 3] / 255;
    let R = r;
    let G = g;
    let B = b;
    let A = a0;
    if (transparent) {
      // giữ nguyên
    } else if (tint) {
      // độ "trắng" so với khối nền đỏ → độ đậm của chữ
      const lum = Math.min(r, g, b);
      A = Math.min(1, Math.max(0, (lum - 120) / 120)) * a0; // nền đỏ (kênh thấp nhất ~70–80) → 0
      [R, G, B] = tint;
    } else {
      // color-to-alpha với nền trắng: phần trắng → trong suốt, mép mịn giữ màu đúng
      const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
      A = a * a0;
      if (a > 0) {
        R = Math.round(255 - (255 - r) / a);
        G = Math.round(255 - (255 - g) / a);
        B = Math.round(255 - (255 - b) / a);
      }
    }
    out[i * 4] = R;
    out[i * 4 + 1] = G;
    out[i * 4 + 2] = B;
    out[i * 4 + 3] = Math.round(A * 255);
  }

  const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  const h = Math.min(trimmed.info.height, MAX_H);
  const target = path.join(dir, `${name}.webp`);
  const res = await sharp(trimmed.data, {
    raw: { width: trimmed.info.width, height: trimmed.info.height, channels: 4 },
  })
    .resize({ height: h, withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(target);
  fs.unlinkSync(src);
  console.log(`${name}.webp  ${res.width}x${res.height}  w@160=${Math.round((res.width / res.height) * 160)}`);
}
