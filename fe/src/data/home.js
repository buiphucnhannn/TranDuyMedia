import { siteConfig } from "@/config/site";
import { btsImages } from "@/data/collections";

/**
 * Nội dung MẶC ĐỊNH của trang chủ — dùng khi quản trị viên chưa thay (ô để trống ở tab "Trang chủ").
 * Mỗi khung ảnh có tỉ lệ cố định: ảnh tải lên được cắt đúng tỉ lệ này (cắt không phá ảnh gốc → luôn nét).
 */
export const HOME_FRAMES = {
  // Hero phủ kín màn hình: cắt theo khung máy tính 16:9; điện thoại tự lấy phần quanh điểm đã chọn
  hero: { ratio: 16 / 9, label: "16:9" },
  showreel: { ratio: 2 / 1, label: "2:1" },
  introMain: { ratio: 4 / 5, label: "4:5" },
  introSide: { ratio: 1, label: "1:1" },
  service: { ratio: 16 / 9, label: "16:9" },
};

export const HERO_SLOTS = 4;
export const SERVICES_MAX = 9;

export const DEFAULT_HERO = btsImages.slice(0, HERO_SLOTS).map((s) => ({
  src: s.src,
  alt: s.alt,
  pos: s.pos ?? "center",
  zoom: 1,
}));

export const DEFAULT_SHOWREEL = {
  title: siteConfig.showreel.title,
  caption: siteConfig.showreel.duration,
  poster: siteConfig.showreel.poster,
};

export const DEFAULT_INTRO = {
  main: {
    src: "/images/bts/bts-05.webp",
    alt: "Ekip Trần Duy Media trên trường quay",
    pos: "center",
    zoom: 1,
  },
  side: {
    src: "/images/about-hd/studio-interview.webp",
    alt: "Setup quay phỏng vấn tại studio Trần Duy Media",
    pos: "center 55%",
    zoom: 1,
  },
};

// Mỗi thẻ = một mảng trong hệ sinh thái dịch vụ. link: "Xem thêm" (+ bấm ảnh / tên thẻ);
// booking: dịch vụ chọn sẵn trong form "Liên hệ tư vấn".
const card = (name, desc, src, pos, slug) => ({
  name,
  desc,
  image: { src, alt: name, pos, zoom: 1 },
  link: `/dich-vu/${slug}`,
  booking: slug,
});
export const DEFAULT_SERVICES = [
  card(
    "TVC / iTVC",
    "Quảng cáo 15–60s cho TV và các nền tảng online.",
    "/images/services/itvc-elip-1.webp",
    "center 40%",
    "san-xuat-itvc-viral",
  ),
  card(
    "Video ngắn 9:16",
    "TikTok, Reels, Shorts — nhịp nhanh, bám xu hướng.",
    "/images/clips/short-4.webp",
    "center 30%",
    "san-xuat-video-short",
  ),
  card(
    "Documentary, talkshow & testimonial",
    "Câu chuyện thương hiệu, phỏng vấn, chân dung nhà sáng lập.",
    "/images/clips/itvc-2.webp",
    "center 40%",
    "phim-doanh-nghiep-su-kien",
  ),
  card(
    "Phim doanh nghiệp",
    "Profile, năng lực, nhà xưởng — phục vụ đấu thầu.",
    "/images/about-hd/corporate-factory.webp",
    "center",
    "phim-doanh-nghiep-su-kien",
  ),
  card(
    "Video sự kiện",
    "Hội nghị, tất niên, ra mắt — highlight bàn giao trong ngày.",
    "/images/about-hd/event-ballroom.webp",
    "center 45%",
    "phim-doanh-nghiep-su-kien",
  ),
  card(
    "Cho thuê studio",
    "Room 24m² & 150m² — sẵn đèn, phông nền, thuê theo giờ.",
    "/images/about-hd/studio-hall.webp",
    "center",
    "cho-thue-studio",
  ),
];
