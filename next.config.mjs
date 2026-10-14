/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Ẩn nút "N" của Next ở góc màn hình khi dev (vẫn báo lỗi biên dịch / runtime)
  devIndicators: false,
  images: {
    // Chỉ WebP: AVIF nén nhỏ hơn chút nhưng giải mã nặng hơn nhiều → giật khi ảnh vừa cuộn tới
    formats: ["image/webp"],
    // Next 16 chỉ cho phép các mức chất lượng liệt kê ở đây (ngoài danh sách bị ép về mức gần nhất)
    qualities: [70, 75, 90],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
