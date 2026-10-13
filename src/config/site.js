/**
 * Cấu hình chung của website.
 * Thay đổi thông tin thương hiệu, liên hệ, mạng xã hội tại đây.
 */
export const siteConfig = {
  name: "Trần Duy Media",
  shortName: "TD Media",
  tagline: "Sản xuất video & truyền thông sáng tạo",
  description:
    "Trần Duy Media – đơn vị sản xuất video, chụp ảnh, TVC quảng cáo và quản lý nội dung mạng xã hội chuyên nghiệp cho doanh nghiệp và thương hiệu.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "vi_VN",
  lang: "vi",
  themeColor: "#0b0f19",
  ogImage: "/images/og-image.png",
  keywords: [
    "sản xuất video",
    "quay phim quảng cáo",
    "TVC",
    "chụp ảnh sản phẩm",
    "media agency",
    "Trần Duy Media",
  ],
  contact: {
    email: "contact@tranduymedia.vn",
    phone: "0900 000 000",
    phoneHref: "tel:+84900000000",
    address: "TP. Hồ Chí Minh, Việt Nam",
    workingHours: "Thứ 2 – Thứ 7, 8:00 – 18:00",
  },
  socials: {
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    tiktok: "https://tiktok.com/",
    instagram: "https://instagram.com/",
  },
};

export const mainNav = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Dự án", href: "/du-an" },
  { label: "Liên hệ", href: "/lien-he" },
];
