/**
 * Cắt khung ảnh theo "điểm giữ lại" (pos, giống object-position) + mức phóng (zoom ≥ 1).
 * Cùng một cách cắt dùng được cho mọi khung (3:4, 4:5, 4:3…): điểm pos luôn nằm đúng vị trí
 * tương ứng trong khung, phóng to quanh điểm đó. Ảnh trong lightbox vẫn hiện trọn vẹn.
 */
const KEYWORDS = { center: 50, left: 0, top: 0, right: 100, bottom: 100 };

const toPercent = (v, fallback = 50) => {
  if (v == null) return fallback;
  if (v in KEYWORDS) return KEYWORDS[v];
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : fallback;
};

/** "center" | "top" | "center 40%" | "30% 70%" → { x, y } (0–100) */
export function parsePos(pos = "center") {
  const parts = String(pos).trim().split(/\s+/);
  if (parts.length === 1) {
    const [p] = parts;
    if (p === "top" || p === "bottom") return { x: 50, y: KEYWORDS[p] };
    if (p === "left" || p === "right") return { x: KEYWORDS[p], y: 50 };
    return { x: toPercent(p), y: 50 };
  }
  return { x: toPercent(parts[0]), y: toPercent(parts[1]) };
}

const round = (n) => Math.round(n * 100) / 100;
export const formatPos = ({ x, y }) => `${round(x)}% ${round(y)}%`;

/** Style cho lớp bọc ảnh (đặt `absolute inset-0` quanh <Image fill>) — chỉ có tác dụng khi zoom > 1. */
export const zoomStyle = ({ pos, zoom } = {}) =>
  zoom > 1 ? { transform: `scale(${zoom})`, transformOrigin: pos || "center" } : undefined;

/**
 * `sizes` của ảnh bị phóng (zoom > 1) — nhân kích thước khai báo lên đúng mức phóng để trình duyệt tải
 * bản ảnh lớn tương ứng → ảnh bìa cắt / phóng từ ảnh to vẫn nét (không bị kéo giãn bản nhỏ).
 * "(min-width: 1024px) 33vw, 100vw" × 1.5 → "(min-width: 1024px) 50vw, 150vw"
 */
export function zoomSizes(sizes, zoom = 1) {
  const z = Math.min(Math.max(Number(zoom) || 1, 1), 4);
  if (z === 1) return sizes;
  return sizes.replace(
    /(?<![\w-])(\d+(?:\.\d+)?)(vw|px)(?!\))/g,
    (_, n, u) => `${Math.ceil(n * z)}${u}`,
  );
}

/**
 * `sizes` cho ảnh object-cover trong khung có tỉ lệ `frameRatio` (rộng / cao). Ảnh ngang đặt vào khung dọc
 * thực chất được phóng to (chỉ hiện một phần) → khai báo bề rộng khung là chưa đủ, trình duyệt tải bản
 * nhỏ rồi kéo giãn → mờ. Nhân thêm hệ số phóng của object-cover (và zoom cắt khung) để luôn đủ nét.
 */
export function coverSizes(sizes, { width, height, zoom } = {}, frameRatio = 1) {
  const cover = width && height ? Math.max(1, width / height / frameRatio) : 1;
  return zoomSizes(sizes, (Number(zoom) || 1) * cover);
}
