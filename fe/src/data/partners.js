// Thương hiệu đã đồng hành — logo WebP lossless, nền trong suốt, đã cắt sát viền
// (chuẩn hoá bằng scripts/partner-logos.mjs; Elipsport & Move giữ nguyên khối đỏ chính thức).
// w = bề rộng tương ứng chiều cao 160px.
const L = (f) => `/images/partners/${f}.webp`;

// Tên chuẩn theo hồ sơ khách hàng (viết hoa đúng như hồ sơ), cùng thứ tự
export const partners = [
  { name: "DONG DUONG GROUP", logo: L("ddg"), w: 257 },
  { name: "MOVE", logo: L("move-red"), w: 191 },
  { name: "ZEMA", logo: L("zema"), w: 182 },
  { name: "VTC ACADEMY", logo: L("vtc-academy"), w: 310 },
  { name: "YONNY", logo: L("yonny"), w: 534 },
  { name: "VGEMS", logo: L("vgems"), w: 484 },
  { name: "ELIPSPORT", logo: L("elipsport-red"), w: 288 },
  { name: "NAM SAN RESTAURANT", logo: L("namsan"), w: 160, big: true }, // logo tròn → cao hơn chút cho cân với logo ngang
];
