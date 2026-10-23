/**
 * Lõi thuần của cơ chế TỰ CĂN CHỈNH ẢNH BÌA (không phụ thuộc trình duyệt → kiểm thử được bằng
 * Node): tìm vùng "đáng giữ nhất" trong ảnh rồi quy về object-position (%) cho khung đóng sẵn.
 *
 * Cách làm (content-aware cropping rút gọn):
 * - Điểm "quan trọng" của mỗi pixel = độ chênh sáng với pixel kề (cạnh / chi tiết) + độ bão hoà
 *   màu (vùng màu nổi bật thường là chủ thể).
 * - Dựng ảnh tích phân (integral image) để tính tổng điểm của mọi cửa sổ trượt trong O(1).
 * - Cửa sổ có kích thước lớn nhất đúng tỉ lệ khung bìa (mặc định 3:4 — tỉ lệ thẻ sản phẩm và
 *   ảnh nổi bật trên website); cửa sổ có tổng điểm cao nhất thắng.
 * - Ảnh gần như không có chi tiết (mọi cửa sổ xấp xỉ nhau) → giữ nguyên căn giữa 50% 50%.
 */

/** object-position (%) để cửa sổ [winW×winH] có tâm (cx, cy) — cùng công thức trình duyệt dùng cho object-cover. */
export function objectPositionForWindow({ cx, cy, width, height, winW, winH }) {
  const axis = (c, size, win) => {
    const free = size - win;
    if (free <= 0.5) return 50;
    const offset = Math.min(Math.max(c * size - win / 2, 0), free);
    return Math.round(((offset / free) * 100 + Number.EPSILON) * 100) / 100;
  };
  return { x: axis(cx, width, winW), y: axis(cy, height, winH) };
}

/**
 * Tìm điểm tập trung cho ảnh từ dữ liệu pixel RGBA (đã thu nhỏ, tối đa ~160px mỗi chiều).
 * Trả { x, y } dạng phần trăm (0–100) hoặc tâm mặc định khi không có chủ thể rõ ràng.
 */
export function focalFromPixels({ data, width, height }, ratio = 3 / 4) {
  const center = { x: 50, y: 50 };
  if (!data || width < 4 || height < 4) return center;

  const lum = new Float32Array(width * height);
  const imp = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    lum[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    imp[i] = mx === 0 ? 0 : ((mx - mn) / mx) * 40; // bão hoà: nền xám/trắng gần 0, chủ thể màu nổi cao
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const gx = Math.abs(lum[y * width + Math.min(x + 1, width - 1)] - lum[y * width + Math.max(x - 1, 0)]);
      const gy = Math.abs(lum[Math.min(y + 1, height - 1) * width + x] - lum[Math.max(y - 1, 0) * width + x]);
      imp[i] += gx + gy;
    }
  }

  // Ảnh tích phân
  const stride = width + 1;
  const sum = new Float64Array(stride * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += imp[y * width + x];
      sum[(y + 1) * stride + x + 1] = sum[y * stride + x + 1] + row;
    }
  }
  const windowSum = (x, y, w, h) =>
    sum[(y + h) * stride + x + w] - sum[y * stride + x + w] - sum[(y + h) * stride + x] + sum[y * stride + x];

  // Cửa sổ lớn nhất đúng tỉ lệ khung
  let winW = width;
  let winH = Math.round(width / ratio);
  if (winH > height) {
    winH = height;
    winW = Math.round(height * ratio);
  }
  if (winW < 1 || winH < 1) return center;

  const step = Math.max(1, Math.round(Math.min(width, height) / 48));
  let best = -1;
  let bestX = 0;
  let bestY = 0;
  let total = 0;
  let count = 0;
  for (let y = 0; y + winH <= height; y += step) {
    for (let x = 0; x + winW <= width; x += step) {
      const s = windowSum(x, y, winW, winH);
      total += s;
      count++;
      if (s > best) {
        best = s;
        bestX = x;
        bestY = y;
      }
    }
  }
  // Không có chủ thể nổi bật (ảnh phẳng / nền đều) → căn giữa như cũ
  if (!count || best <= (total / count) * 1.12) return center;

  return objectPositionForWindow({
    cx: (bestX + winW / 2) / width,
    cy: (bestY + winH / 2) / height,
    width,
    height,
    winW,
    winH,
  });
}
