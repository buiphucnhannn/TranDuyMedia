/**
 * Tạo toàn bộ icon, favicon, OG image và ảnh placeholder từ logo SVG.
 * Chạy lại khi thay logo:  npm run assets
 *
 * Đầu vào:  public/images/logo-mark.svg
 * Đầu ra:   src/app/{favicon.ico, icon.svg, apple-icon.png}
 *           public/icons/*.png, public/images/{og-image.png, hero.jpg, about.jpg, portfolio/*.jpg}
 */
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const pub = (...p) => path.join(root, "public", ...p);
const app = (...p) => path.join(root, "src", "app", ...p);

const BRAND = "#FE4C11";
const INK = "#0B0F19";
const markPath = pub("images", "logo-mark.svg");
const mark = await readFile(markPath);

await mkdir(pub("icons"), { recursive: true });
await mkdir(pub("images", "portfolio"), { recursive: true });

const png = (input, size) => sharp(input, { density: 512 }).resize(size, size).png().toBuffer();

// ---------- Icons ----------
await writeFile(pub("icons", "icon-192.png"), await png(mark, 192));
await writeFile(pub("icons", "icon-512.png"), await png(mark, 512));
await writeFile(pub("icons", "apple-touch-icon.png"), await png(mark, 180));

// Maskable: logo nằm trong vùng an toàn 80% trên nền thương hiệu
const maskable = await sharp({
  create: { width: 512, height: 512, channels: 4, background: BRAND },
})
  .composite([{ input: await png(mark, 360), gravity: "center" }])
  .png()
  .toBuffer();
await writeFile(pub("icons", "icon-maskable-512.png"), maskable);

// App Router metadata files
await copyFile(markPath, app("icon.svg"));
await writeFile(app("apple-icon.png"), await png(mark, 180));

// favicon.ico (ICO chứa nhiều PNG: 16, 32, 48)
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map((s) => png(mark, s)));
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

// ---------- OG image 1200x630 ----------
const markInline = mark
  .toString()
  .replace(/<svg[^>]*>/, "")
  .replace("</svg>", "");
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="85%" cy="10%" r="70%">
      <stop offset="0" stop-color="${BRAND}" stop-opacity=".45"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(80 80) scale(1.5)">${markInline}</g>
  <text x="80" y="330" font-family="Arial, sans-serif" font-size="76" font-weight="800" fill="#fff">TRẦN DUY MEDIA</text>
  <text x="80" y="400" font-family="Arial, sans-serif" font-size="34" fill="#d4d4d8">Sản xuất video &amp; truyền thông sáng tạo</text>
  <rect x="80" y="470" width="120" height="6" rx="3" fill="${BRAND}"/>
  <text x="80" y="540" font-family="Arial, sans-serif" font-size="26" fill="#a1a1aa">TVC · Video doanh nghiệp · Chụp ảnh · Social Content</text>
</svg>`;
await sharp(Buffer.from(ogSvg)).png().toFile(pub("images", "og-image.png"));

// ---------- Ảnh placeholder (thay bằng ảnh thật) ----------
const palettes = [
  ["#1e1b4b", "#fe4c11"],
  ["#0f172a", "#0ea5e9"],
  ["#18181b", "#eab308"],
  ["#3b0764", "#ec4899"],
  ["#022c22", "#10b981"],
  ["#450a0a", "#f97316"],
];

function placeholder(w, h, [from, to], label) {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${w * 0.8}" cy="${h * 0.2}" r="${h * 0.45}" fill="#fff" fill-opacity=".06"/>
  <circle cx="${w * 0.1}" cy="${h * 0.95}" r="${h * 0.35}" fill="#000" fill-opacity=".15"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(h / 14)}" font-weight="700" fill="#fff" fill-opacity=".35">${label}</text>
</svg>`);
}

const jpg = (svg, file) => sharp(svg).jpeg({ quality: 82, mozjpeg: true }).toFile(file);

await jpg(
  placeholder(1920, 1080, ["#0b0f19", "#7e1a10"], "HERO 1920×1080"),
  pub("images", "hero.jpg"),
);
await jpg(placeholder(1200, 900, palettes[1], "ABOUT 1200×900"), pub("images", "about.jpg"));
await Promise.all(
  palettes.map((p, i) =>
    jpg(
      placeholder(1200, 900, p, `PROJECT ${i + 1}`),
      pub("images", "portfolio", `project-${i + 1}.jpg`),
    ),
  ),
);

console.log("✓ Đã tạo xong icons, favicon, OG image và ảnh placeholder.");
