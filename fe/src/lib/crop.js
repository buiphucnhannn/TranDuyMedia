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
