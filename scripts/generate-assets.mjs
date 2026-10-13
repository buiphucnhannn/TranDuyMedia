/**
 * Tạo favicon, icon PWA và ảnh Open Graph từ logo thật của khách.
 * Chạy lại khi thay logo:  npm run assets
 *
 * Đầu vào:  public/images/brand/logo-mark.png  (biểu tượng TD, nền trong suốt) → icon tab trình duyệt
 *           public/images/brand/logo.png       (logo đầy đủ navy + cam) → icon màn hình chính / PWA
 *           public/images/brand/logo-light.png (logo trắng + cam, cho OG image nền tối)
 * Đầu ra:   src/app/{favicon.ico, icon.png, apple-icon.png}
 *           public/icons/*.png, public/images/og-image.png
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const pub = (...p) => path.join(root, "public", ...p);
const app = (...p) => path.join(root, "src", "app", ...p);

const NAVY = "#0b1220";
const ORANGE = "#f86808";
// Logo màu gốc (navy + cam) trên nền trắng — giống logo của khách
const mark = await readFile(pub("images", "brand", "logo-mark.png")); // chỉ biểu tượng TD
const logoFull = await readFile(pub("images", "brand", "logo.png")); // TD + TRAN DUY MEDIA
const logoLight = await readFile(pub("images", "brand", "logo-light.png"));

await mkdir(pub("icons"), { recursive: true });

// Trọng tâm thị giác theo chiều ngang (tính theo độ đậm của nét). Logo TD "nặng" bên phải (chữ D đặc +
// tam giác cam), nên căn theo khung bao thì mắt thấy lệch phải → dịch ngang để trọng tâm về đúng giữa.
async function opticalCenterX(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let mass = 0;
  let cx = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      mass += a;
      cx += x * a;
    }
  return { cx: mass ? cx / mass : info.width / 2, width: info.width, height: info.height };
}

// Ô vuông nền trắng bo góc, logo căn giữa theo THỊ GIÁC (ngang) và theo khung bao (dọc)
// optical: chỉ dùng cho biểu tượng TD đứng riêng. Logo đầy đủ có dòng chữ đã căn giữa sẵn → căn theo khung
// bao (nếu dịch theo trọng tâm, dòng chữ sẽ lệch).
async function tile(size, { src = mark, radius = 0.22, pad = 0.16, optical = src === mark } = {}) {
  const r = Math.round(size * radius);
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#ffffff"/></svg>`,
  );
  const inner = Math.round(size * (1 - pad * 2));
  const logo = await sharp(src).trim().resize(inner, inner, { fit: "inside" }).png().toBuffer();
  const { cx, width, height } = await opticalCenterX(logo);
  // Dịch tối đa 6% khung để không lệch quá đà; giữ logo nằm trọn trong ô
  const shift = optical ? Math.max(-size * 0.06, Math.min(size * 0.06, width / 2 - cx)) : 0;
  const left = Math.round(Math.max(0, Math.min(size - width, (size - width) / 2 + shift)));
  const top = Math.round((size - height) / 2);
  return sharp(bg)
    .composite([{ input: logo, left, top }])
    .png()
    .toBuffer();
}

// Icon lớn (màn hình chính điện thoại, PWA): logo ĐẦY ĐỦ có chữ — đủ to để đọc
const full = { src: logoFull, pad: 0.12 };
await writeFile(pub("icons", "icon-192.png"), await tile(192, full));
await writeFile(pub("icons", "icon-512.png"), await tile(512, full));
await writeFile(
  pub("icons", "icon-maskable-512.png"),
  await tile(512, { src: logoFull, radius: 0, pad: 0.22 }),
);
await writeFile(pub("icons", "apple-touch-icon.png"), await tile(180, { ...full, radius: 0 }));
await writeFile(app("apple-icon.png"), await tile(180, { ...full, radius: 0 }));
// Icon tab trình duyệt (16–32px hiển thị): chỉ biểu tượng TD — chữ ở cỡ này không đọc được
await writeFile(app("icon.png"), await tile(256, { pad: 0.13 }));

// favicon.ico (ICO chứa nhiều PNG: 16, 32, 48) — biểu tượng TD trên nền trắng
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map((s) => tile(s, { radius: 0.2, pad: 0.09 })));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);
let offset = 6 + 16 * icoImages.length;
const entries = icoImages.map((buf, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(icoSizes[i], 0);
  e.writeUInt8(icoSizes[i], 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += buf.length;
  return e;
});
await writeFile(app("favicon.ico"), Buffer.concat([header, ...entries, ...icoImages]));

// ---------- OG image 1200x630: nền navy + ảnh hậu trường mờ + logo trắng ----------
const bts = await sharp(pub("images", "bts", "bts-02.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .modulate({ brightness: 0.45, saturation: 0.6 })
  .toBuffer();
const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${NAVY}" stop-opacity=".35"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity=".95"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="80" y="468" width="120" height="6" rx="3" fill="${ORANGE}"/>
  <text x="80" y="530" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#fff" font-weight="700">Sản xuất video thương mại · Studio cho thuê · Chụp ảnh thương mại</text>
  <text x="80" y="572" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#c9cdd6">10+ năm gia công trọn gói video quảng cáo · 097 154 2026 · Nhà Bè, TP.HCM</text>
</svg>`);
const logoForOg = await sharp(logoLight).resize({ height: 300 }).png().toBuffer();
await sharp(bts)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logoForOg, top: 110, left: 80 },
  ])
  .png()
  .toFile(pub("images", "og-image.png"));

// ---------- Ảnh nền dải CTA cuối trang: 7 ảnh ghép kiểu contact sheet ----------
{
  const W = 1920;
  const H = 640;
  const GAP = 10;
  // Ảnh "sạch" (không chữ / watermark in sẵn), xen kẽ bối cảnh & hậu trường
  const shots = [
    ["vintage-green", "vintage-green-03.jpg"],
    ["box-studio", "box-studio-04.jpg"],
    ["christmas", "christmas-07.jpg"],
    ["bts", "bts-05.jpg"],
    ["tet", "tet-05.jpg"],
    ["vintage-green", "vintage-green-14.jpg"],
    ["bts", "bts-07.jpg"],
  ];
  const tileW = Math.floor((W - GAP * (shots.length - 1)) / shots.length);
  const tiles = await Promise.all(
    shots.map(async ([dir, file], i) => ({
      input: await sharp(pub("images", dir, file))
        .resize(tileW, H, { fit: "cover", position: "attention" })
        .modulate({ saturation: 0.7 })
        .toBuffer(),
      left: i * (tileW + GAP),
      top: 0,
    })),
  );
  await sharp({ create: { width: W, height: H, channels: 3, background: NAVY } })
    .composite(tiles)
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(pub("images", "cta-collage.jpg"));
}

console.log("✓ Đã tạo favicon, icons và OG image từ logo thật.");
