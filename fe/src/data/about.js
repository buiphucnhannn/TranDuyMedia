// Nội dung trang "Về chúng tôi". Ảnh /images/about/reel-* là khung hình trích từ showreel 2026
// (scripts: chụp từ public/media/showreel-1080.mp4, đã cắt bỏ nhãn thể loại).

const A = (name) => `/images/about/${name}.webp`;

// Nền đầu trang: 6 cột ảnh trôi — ưu tiên ảnh có người & máy quay ở 3 cột đầu (mobile chỉ hiện 3 cột)
export const aboutHeaderColumns = [
  ["/images/bts/bts-02.webp", A("reel-event"), A("reel-short")],
  ["/images/bts/bts-05.webp", A("reel-talkshow"), A("reel-warehouse")],
  [A("reel-camera"), A("reel-interview"), "/images/bts/bts-06.webp"],
  ["/images/bts/bts-07.webp", A("reel-speaker"), A("reel-event-hall")],
  ["/images/bts/bts-04.webp", A("reel-portrait"), A("reel-food")],
  [A("reel-spa"), "/images/bts/bts-02.webp", A("reel-massage")],
];

// Hồ sơ doanh nghiệp — thông tin nhanh
export const companyFacts = [
  { label: "Thương hiệu", value: "Trần Duy Media Studio" },
  { label: "Lĩnh vực", value: "Nội dung truyền thông, thương mại quảng cáo" },
  { label: "Kinh nghiệm", value: "Hơn 10 năm thực chiến" },
  { label: "Phương châm", value: "Uy tín – Trách nhiệm – Tâm huyết" },
];

// 3 ảnh hồ sơ: quay video (ảnh cao bên trái) · studio · chụp ảnh thương mại
export const profileImages = [
  { src: "/images/bts/bts-02.webp", alt: "Quay phim với máy cinema tại studio", pos: "center 40%" },
  {
    src: "/images/bts/bts-07.webp",
    alt: "Hệ thống đèn và softbox tại Box Studio",
    pos: "center 45%",
  },
  {
    src: "/images/bts/bts-06.webp",
    alt: "Buổi chụp thương mại cho cửa hàng trang sức",
    pos: "center 35%",
  },
];

// Các định dạng đã sản xuất (theo showreel)
export const formats = [
  {
    name: "TVC & iTVC",
    desc: "Quảng cáo truyền hình và online — kịch bản, casting, quay, dựng, chỉnh màu.",
    src: A("reel-food"),
    pos: "center 40%",
  },
  {
    name: "Video ngắn thương mại",
    desc: "Video dọc 9:16 cho TikTok, Reels, Shorts — nhịp nhanh, bám xu hướng.",
    src: A("reel-short"),
    pos: "center",
  },
  {
    name: "Documentary",
    desc: "Phim tài liệu, chân dung nhà sáng lập, câu chuyện thương hiệu.",
    src: A("reel-speaker"),
    pos: "center 30%",
  },
  {
    name: "Talkshow & phỏng vấn",
    desc: "Setup nhiều máy, âm thanh, ánh sáng cho talkshow, podcast, phỏng vấn.",
    src: A("reel-talkshow"),
    pos: "center 40%",
  },
  {
    name: "Video sự kiện",
    desc: "Ghi hình và recap hội nghị, khai trương, ra mắt sản phẩm — bàn giao nhanh.",
    src: A("reel-event"),
    pos: "center",
  },
  {
    name: "Phim doanh nghiệp",
    desc: "Giới thiệu năng lực, nhà xưởng, quy trình — phục vụ đấu thầu và tuyển dụng.",
    src: A("reel-warehouse"),
    pos: "center",
  },
];

// Sứ mệnh / tầm nhìn — mỗi khối là một khung hình có ảnh nền
export const mission = {
  title: "Sứ mệnh",
  en: "Mission",
  text: "Đồng hành cùng kiến tạo và nâng tầm giá trị doanh nghiệp.",
  tags: ["Đồng hành", "Kiến tạo", "Nâng tầm"],
  image: "/images/bts/bts-05.webp",
  imagePos: "center 35%",
};
export const vision = {
  title: "Tầm nhìn",
  en: "Vision",
  text: "Trở thành đối tác sản xuất nội dung thương mại quảng cáo được khách hàng tin tưởng lựa chọn hàng đầu.",
  tags: ["Nội dung thương mại", "Quảng cáo", "Tin tưởng hàng đầu"],
  image: "/images/about/reel-aerial.webp",
  imagePos: "center 60%",
};

// Chuẩn mực sản xuất — Trần Duy Media cam kết trong mọi dự án (theo hồ sơ doanh nghiệp)
export const productionStandards = [
  {
    title: "Khách hàng là trọng tâm",
    desc: "Lấy kết quả, sự hài lòng và mục tiêu của khách hàng làm trọng tâm cho mọi sản phẩm.",
  },
  {
    title: "Linh hoạt & sáng tạo",
    desc: "Linh hoạt cải tiến cách làm, luôn tìm ý tưởng mới phù hợp với từng thương hiệu.",
  },
  {
    title: "Đội ngũ tử tế",
    desc: "Quy tụ đội ngũ sản xuất chuyên môn, làm việc tận tâm và tử tế.",
  },
  {
    title: "Tối ưu chi phí",
    desc: "Tối ưu chi phí sản xuất, dự toán rõ ràng theo từng hạng mục.",
  },
  {
    title: "Chia sẻ & biết ơn",
    desc: "Giữ tinh thần chia sẻ và biết ơn trong mọi mối quan hệ hợp tác.",
  },
];

// Hậu trường & năng lực thiết bị
export const capabilities = [
  {
    icon: "camera",
    title: "Máy quay cinema & gimbal",
    desc: "Quay 4K, ống kính đa tiêu cự, gimbal, flycam.",
  },
  {
    icon: "sparkle",
    title: "Hệ đèn studio chuyên nghiệp",
    desc: "Đèn Godox công suất lớn, softbox, đèn LED.",
  },
  {
    icon: "studio",
    title: "Studio tối giản tại Nhà Bè",
    desc: "Bố trí setup linh hoạt, thuê theo giờ.",
  },
  {
    icon: "film",
    title: "Ekip trọn gói",
    desc: "Đạo diễn, quay phim, nhiếp ảnh, dựng phim, hậu kỳ.",
  },
];

export const behindImages = [
  { src: "/images/bts/bts-05.webp", alt: "Ekip quay phim trên trường quay", pos: "center" },
  { src: "/images/bts/bts-07.webp", alt: "Hệ thống đèn và softbox tại Box Studio", pos: "center" },
  { src: "/images/bts/bts-04.webp", alt: "Setup ánh sáng Godox", pos: "center" },
];
