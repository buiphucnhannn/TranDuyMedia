/**
 * Cấu hình chung của website — thông tin lấy từ hồ sơ yêu cầu (docs/demo.docx) và poster của studio.
 * Thay đổi thương hiệu, liên hệ, mạng xã hội, video showreel tại đây.
 */
export const siteConfig = {
  name: "Tran Duy Media Studio",
  shortName: "TD Media",
  tagline: "Sản xuất video thương mại & studio quay chụp",
  description:
    "Tran Duy Media Studio – 10+ năm sản xuất video thương mại quảng cáo (TVC, iTVC, documentary, phim doanh nghiệp, video sự kiện), chụp ảnh thương mại và cho thuê bối cảnh studio tại TP. Hồ Chí Minh.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // API backend: gọi cùng tên miền, Next.js chuyển tiếp sang be/ (xem rewrites trong next.config.mjs)
  apiUrl: "/api/v1",
  locale: "vi_VN",
  lang: "vi",
  themeColor: "#0b1220",
  keywords: [
    "sản xuất video quảng cáo",
    "TVC",
    "iTVC",
    "phim doanh nghiệp",
    "video documentary",
    "video sự kiện",
    "cho thuê studio chụp ảnh",
    "studio quay video",
    "chụp ảnh thương mại",
    "Tran Duy Media",
    "Nhà Bè",
  ],
  contact: {
    phone: "097 154 2026",
    phoneRaw: "0971542026",
    phoneHref: "tel:+84971542026",
    email: "contact@tranduymedia.vn", // TODO: thay email thật
    address: "456/26 Huỳnh Tấn Phát, KP7, Nhà Bè",
    city: "TP. Hồ Chí Minh",
    workingHours: "Thứ 2 – Chủ nhật, 8:00 – 21:00",
    mapsQuery: "456/26 Huỳnh Tấn Phát, Nhà Bè, Hồ Chí Minh",
    mapsLink:
      "https://www.google.com/maps/search/?api=1&query=456%2F26+Hu%E1%BB%B3nh+T%E1%BA%A5n+Ph%C3%A1t%2C+Nh%C3%A0+B%C3%A8",
  },
  socials: {
    facebook: "https://www.facebook.com/TranDuyMedia",
    messenger: "https://m.me/TranDuyMedia",
    zalo: "https://zalo.me/0971542026",
    youtube: "https://youtube.com/", // TODO: thay link kênh thật
    tiktok: "https://tiktok.com/", // TODO: thay link kênh thật
  },
  // Showreel 2026 — bản web nén từ file gốc 4K (public/videos, không commit) bằng `npm run video`.
  // Tự host (không dùng Google Drive) để điều khiển được: tự phát khi cuộn tới, chọn chất lượng 1080p.
  showreel: {
    title: "Showreel 2026",
    duration: "Tổng hợp dự án 2025 – 2026",
    poster: "/media/showreel-poster.jpg",
    hd: "/media/showreel-1080.mp4", // máy tính / tablet
    sd: "/media/showreel-720.mp4", // điện thoại hoặc khi bật tiết kiệm dữ liệu
  },
};

// Menu chung cho header (desktop + mobile) và footer.
// Không có "Trang chủ" (logo đã là đường về trang chủ). Mục có "#" là section trên trang chủ:
// đang ở trang chủ thì cuộn mượt tới, ở trang khác thì chuyển về trang chủ rồi cuộn (SmoothScroll).
export const mainNav = [
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Quy trình", href: "/#quy-trinh" },
  { label: "Liên hệ", href: "/#lien-he" },
];
