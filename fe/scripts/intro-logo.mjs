/**
 * Logo màn chào (IntroSplash) nhúng thẳng vào HTML dạng data URI → hiện ngay ở khung hình đầu, không chờ tải
 * ảnh qua mạng (logo là phần tử LCP khi có màn chào — trên 4G chậm của điện thoại, chờ tải ảnh làm LCP chậm vài giây).
 * Bản WebP rộng 384px: đủ nét cho logo cao tối đa ~144px trên màn hình mật độ 2x.
 * Chạy lại khi đổi logo: node scripts/intro-logo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const buf = await sharp(path.join(root, "public/images/brand/logo-light.webp"))
  .resize({ width: 384 })
  .webp({ quality: 90, alphaQuality: 90, effort: 6 })
  .toBuffer({ resolveWithObject: true });
const out = path.join(root, "src/components/fx/intro-logo.js");
fs.writeFileSync(
  out,
  `// Tự sinh bởi scripts/intro-logo.mjs — không sửa tay.\nexport const INTRO_LOGO = {\n  src: "data:image/webp;base64,${buf.data.toString("base64")}",\n  width: ${buf.info.width},\n  height: ${buf.info.height},\n};\n`,
);
console.log(`intro-logo: ${buf.info.width}x${buf.info.height}, ${buf.data.length} B`);
