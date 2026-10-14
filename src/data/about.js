// Nội dung trang "Về chúng tôi". Ảnh /images/about/reel-* là khung hình trích từ showreel 2026
// (scripts: chụp từ public/media/showreel-1080.mp4, đã cắt bỏ nhãn thể loại).

const A = (name) => `/images/about/${name}.jpg`;

// Nền đầu trang: 6 cột ảnh trôi — ưu tiên ảnh có người & máy quay ở 3 cột đầu (mobile chỉ hiện 3 cột)
export const aboutHeaderColumns = [
  ["/images/bts/bts-02.jpg", A("reel-event"), A("reel-short")],
  ["/images/bts/bts-05.jpg", A("reel-talkshow"), A("reel-warehouse")],
  [A("reel-camera"), A("reel-interview"), "/images/bts/bts-06.jpg"],
  ["/images/bts/bts-07.jpg", A("reel-speaker"), A("reel-event-hall")],
  ["/images/bts/bts-04.jpg", A("reel-portrait"), A("reel-food")],
  [A("reel-spa"), "/images/bts/bts-02.jpg", A("reel-massage")],
];

// Hồ sơ doanh nghiệp — thông tin nhanh
export const companyFacts = [
  { label: "Thương hiệu", value: "Tran Duy Media Studio" },
  { label: "Lĩnh vực", value: "Video, chụp ảnh, cho thuê studio" },
  { label: "Khách hàng", value: "SME, startup, thương hiệu Việt" },
  { label: "Phương châm", value: "Uy tín – Trách nhiệm – Tâm huyết" },
];

// 3 ảnh = 3 mảng dịch vụ: quay video (ảnh cao bên trái) · studio · chụp ảnh thương mại
export const profileImages = [
  { src: "/images/bts/bts-02.jpg", alt: "Quay phim với máy cinema tại studio", pos: "center 40%" },
  {
    src: "/images/bts/bts-07.jpg",
    alt: "Hệ thống đèn và softbox tại Box Studio",
    pos: "center 45%",
  },
  {
    src: "/images/bts/bts-06.jpg",
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
  text: "Giúp doanh nghiệp Việt kể câu chuyện của mình bằng hình ảnh chuyên nghiệp — chi phí hợp lý, hiệu quả nhìn thấy được.",
  tags: ["Chuyên nghiệp", "Chi phí hợp lý", "Hiệu quả đo được"],
  image: "/images/bts/bts-05.jpg",
  imagePos: "center 35%",
};
export const vision = {
  title: "Tầm nhìn",
  en: "Vision",
  text: "Trở thành đối tác sản xuất hình ảnh mà SME và startup tại TP.HCM nghĩ đến đầu tiên.",
  tags: ["SME", "Startup", "TP. Hồ Chí Minh"],
  image: "/images/about/reel-aerial.jpg",
  imagePos: "center 60%",
};

// Giá trị cốt lõi — mỗi giá trị đi kèm cam kết cụ thể với khách hàng
export const coreValues = [
  {
    title: "Uy tín",
    desc: "Hơn 10 năm đồng hành cùng doanh nghiệp — nói được là làm được.",
    promises: ["Đúng tiến độ đã chốt", "Đúng dự toán, không phát sinh ẩn"],
  },
  {
    title: "Trách nhiệm",
    desc: "Một đầu mối chịu trách nhiệm từ ý tưởng đến file bàn giao cuối cùng.",
    promises: ["Báo giá minh bạch từng hạng mục", "Chỉnh sửa theo góp ý đến khi duyệt"],
  },
  {
    title: "Tâm huyết",
    desc: "Chăm chút từng khung hình như sản phẩm của chính mình.",
    promises: ["Đạo diễn theo sát từng cảnh quay", "Hậu kỳ màu & âm thanh kỹ lưỡng"],
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
    title: "Studio 6 bối cảnh tại Nhà Bè",
    desc: "Dựng sẵn theo mùa, thuê theo giờ.",
  },
  {
    icon: "film",
    title: "Ekip trọn gói",
    desc: "Đạo diễn, quay phim, nhiếp ảnh, dựng phim, hậu kỳ.",
  },
];

export const behindImages = [
  { src: "/images/bts/bts-05.jpg", alt: "Ekip quay phim trên trường quay", pos: "center" },
  { src: "/images/bts/bts-07.jpg", alt: "Hệ thống đèn và softbox tại Box Studio", pos: "center" },
  { src: "/images/bts/bts-04.jpg", alt: "Setup ánh sáng Godox", pos: "center" },
];
