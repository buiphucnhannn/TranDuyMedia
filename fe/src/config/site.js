/**
 * Cấu hình chung của website — thông tin lấy từ hồ sơ yêu cầu (docs/demo.docx) và poster của studio.
 * Thay đổi thương hiệu, liên hệ, mạng xã hội, video showreel tại đây.
 */
/**
 * URL chính thức của website: NEXT_PUBLIC_SITE_URL → (trên Vercel) tên miền production Vercel tự cấp
 * → localhost. Giá trị sai định dạng bị bỏ qua (kèm cảnh báo) thay vì làm hỏng cả bản build.
 */
function siteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    try {
      return new URL(raw.trim()).origin;
    } catch {
      console.warn(`[site] NEXT_PUBLIC_SITE_URL không hợp lệ: "${raw}" — dùng giá trị dự phòng`);
    }
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Trần Duy Media Studio",
  shortName: "TD Media",
  tagline: "Gia công nội dung truyền thông & quảng cáo",
  description:
    "Trần Duy Media Studio – hơn 10 năm gia công video, hình ảnh toàn diện cho doanh nghiệp: video short marketing, iTVC, phim doanh nghiệp & sự kiện, chụp ảnh quảng cáo và cho thuê studio tại TP. Hồ Chí Minh.",
  // Đoạn giới thiệu ngắn ở chân trang — các từ ghép nối bằng khoảng trắng không ngắt (U+00A0) để không bị tách dòng
  footerText:
    "Trần Duy Media đối tác gia công video, hình ảnh thương mại quảng cáo và cho thuê studio uy tín cho doanh nghiệp.",
  url: siteUrl(),
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
    "chụp ảnh sự kiện",
    "video marketing",
    "Trần Duy Media",
    "Tran Duy Media", // khách hay tìm không dấu
    "Nhà Bè",
  ],
  contact: {
    phone: "097 154 2026",
    phoneRaw: "0971542026",
    phoneHref: "tel:+84971542026",
    email: "tranduymediagroup@gmail.com",
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
    youtube: "https://www.youtube.com/@tranduymedia/featured",
    tiktok: "https://www.tiktok.com/@tranduymedia",
  },
  // Link bảng giá chi tiết thuê studio (PDF / Google Drive). Để null: nút "Nhận bảng giá chi tiết" mở form đặt lịch.
  studioPriceList: null, // TODO: điền link bảng giá khi khách gửi
  // Showreel 2026 — bản web nén từ file gốc 4K (public/videos, không commit) bằng `npm run video`.
  // Tự host (không dùng Google Drive) để điều khiển được: tự phát khi cuộn tới, chọn chất lượng 1080p.
  showreel: {
    title: "Showreel 2026",
    duration: "Tổng hợp dự án 2025 – 2026",
    poster: "/media/showreel-poster.webp",
    hd: "/media/showreel-1080.mp4", // máy tính / tablet
    sd: "/media/showreel-720.mp4", // điện thoại hoặc khi bật tiết kiệm dữ liệu
  },
};

/**
 * BẬT / TẮT các mục đang chờ hoàn thiện nội dung (feedback khách hàng 09/11):
 * - products: menu "Sản phẩm" + các link "Sản phẩm đã thực hiện" / "Xem tất cả sản phẩm".
 *   → Bật / tắt ngay trong trang quản trị (tab Sản phẩm, nút "Ẩn / Hiện trên website") — lưu ở backend,
 *     giá trị ở đây chỉ là mặc định khi chưa đọc được backend.
 * - behindScenes: menu "Hậu trường" + khối "Hậu trường sản xuất" (trang chủ, các trang dịch vụ, cho thuê studio).
 * Nội dung hoàn thiện → đổi false thành true là các mục hiện lại đúng vị trí cũ.
 * (Trang /san-pham vẫn mở được bằng link trực tiếp để quản trị xem trước; tab Sản phẩm trong quản trị vẫn dùng bình thường.)
 */
export const features = {
  products: false,
  behindScenes: false,
};

/** Trang dịch vụ cho thuê studio — có mục riêng trên menu (không nằm trong menu "Video & Hình ảnh"). */
/** Khối "Hệ sinh thái dịch vụ" trên trang chủ — thay cho trang tổng hợp /dich-vu (đã bỏ theo feedback 09/11). */
export const SERVICES_HREF = "/#dich-vu-trong-tam";
export const STUDIO_HREF = "/dich-vu/cho-thue-studio";

// Menu chung cho header (desktop + mobile) và footer.
// Theo feedback 09/11: Về chúng tôi - Video & Hình ảnh - Cho thuê studio - Liên hệ
// ("Sản phẩm", "Hậu trường" tạm ẩn — xem features ở trên).
// Không có "Trang chủ" (logo đã là đường về trang chủ). Mục có "#" là section trên trang chủ:
// đang ở trang chủ thì cuộn mượt tới, ở trang khác thì chuyển về trang chủ rồi cuộn (SmoothScroll).
const NAV = [
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  // Rê chuột → danh sách dịch vụ video & chụp ảnh; bấm → khối "Hệ sinh thái dịch vụ" ở trang chủ.
  // match: sáng mục này khi đang ở trang dịch vụ con (/dich-vu/...)
  { label: "Video & Hình ảnh", href: SERVICES_HREF, match: "/dich-vu", dropdown: true },
  { label: "Cho thuê studio", href: STUDIO_HREF },
  { label: "Sản phẩm", href: "/san-pham", feature: "products" },
  { label: "Hậu trường", href: "/#hau-truong", feature: "behindScenes" },
  { label: "Liên hệ", href: "/#lien-he" },
];
/**
 * Menu theo trạng thái bật / tắt hiện tại. flags: giá trị từ backend (vd. { products: true }) — mục nào
 * không có trong flags thì dùng mặc định ở `features`.
 */
export const buildNav = (flags = {}) =>
  NAV.filter((item) => !item.feature || (flags[item.feature] ?? features[item.feature]));
