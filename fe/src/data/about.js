// Nội dung trang "Về chúng tôi". Thứ tự theo hồ sơ khách hàng: câu chuyện → tầm nhìn → sứ mệnh →
// chuẩn mực sản xuất → năng lực sản xuất → hậu trường.
// Ảnh /images/about-hd/* là ảnh HD gốc do studio cung cấp (WebP, cạnh dài ≤ 3200px);
// /images/about/reel-* là khung hình trích từ showreel 2026 — chỉ giữ cho khung thành phẩm chưa có ảnh chụp.

const A = (name) => `/images/about/${name}.webp`;
const H = (name) => `/images/about-hd/${name}.webp`;

// Nền đầu trang: 6 cột ảnh trôi — ưu tiên ảnh có người & máy quay ở 3 cột đầu (mobile chỉ hiện 3 cột)
export const aboutHeaderColumns = [
  [H("camera-operator"), H("event-screen"), A("reel-short")],
  [H("crew-portrait"), H("talkshow-set"), H("jewelry-consult")],
  [H("documentary-set"), H("interview"), H("event-backdrop")],
  [H("tvc-monitor"), A("reel-food"), H("event-hall")],
  [H("lighting-setup"), H("handshake"), A("reel-spa")],
  [H("product-shoot"), H("tvc-bedroom"), A("reel-portrait")],
];

// Hồ sơ doanh nghiệp — thông tin nhanh
export const companyFacts = [
  { label: "Thương hiệu", value: "Trần Duy Media Studio" },
  { label: "Lĩnh vực", value: "Nội dung truyền thông, thương mại quảng cáo" },
  { label: "Kinh nghiệm", value: "Hơn 10 năm thực chiến" },
  { label: "Phương châm", value: "Uy tín – Trách nhiệm – Tâm huyết" },
];

// 3 ảnh hồ sơ — đủ 3 mảng chính: quay video (ảnh cao bên trái) · chụp ảnh thương mại · chụp sự kiện
export const profileImages = [
  { src: H("camera-operator"), alt: "Quay phim với máy cinema tại studio", pos: "center 40%" },
  {
    src: H("jewelry-shoot"),
    alt: "Buổi chụp ảnh thương mại cho cửa hàng trang sức",
    pos: "center 40%",
  },
  {
    src: H("event-backdrop"),
    alt: "Chụp ảnh sự kiện tiệc tất niên doanh nghiệp",
    pos: "center 45%",
  },
];

// Các định dạng đã sản xuất (theo showreel)
export const formats = [
  {
    name: "TVC & iTVC",
    desc: "Quảng cáo truyền hình và online — kịch bản, casting, quay, dựng, chỉnh màu.",
    src: H("tvc-bedroom"),
    pos: "center 45%",
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
    src: H("interview"),
    pos: "center 35%",
  },
  {
    name: "Talkshow & phỏng vấn",
    desc: "Setup nhiều máy, âm thanh, ánh sáng cho talkshow, podcast, phỏng vấn.",
    src: H("talkshow-set"),
    pos: "center 55%",
  },
  {
    name: "Video sự kiện",
    desc: "Ghi hình và recap hội nghị, khai trương, ra mắt sản phẩm — bàn giao nhanh.",
    src: H("event-hall"),
    pos: "center 60%",
  },
  {
    name: "Phim doanh nghiệp",
    desc: "Giới thiệu năng lực, nhà xưởng, quy trình — phục vụ đấu thầu và tuyển dụng.",
    src: H("corporate-aerial"),
    pos: "center",
  },
];

// Giá trị cốt lõi — 3 khung ảnh đứng: tầm nhìn · sứ mệnh · chuẩn mực sản xuất (danh sách bên dưới)
export const vision = {
  title: "Tầm nhìn",
  en: "Vision",
  text: "Trở thành đối tác sản xuất nội dung thương mại quảng cáo được khách hàng tin tưởng lựa chọn hàng đầu.",
  image: H("event-screen"),
  imagePos: "center 45%",
};
export const mission = {
  title: "Sứ mệnh",
  en: "Mission",
  text: "Đồng hành cùng kiến tạo và nâng tầm giá trị doanh nghiệp — mỗi sản phẩm phục vụ đúng mục tiêu kinh doanh của khách hàng.",
  image: H("handshake"),
  imagePos: "center 40%",
};
export const standardsCard = {
  title: "Chuẩn mực sản xuất",
  en: "Standards",
  image: H("tvc-monitor"),
  imagePos: "center 45%",
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
  { src: H("documentary-set"), alt: "Ekip quay phim tài liệu tại bối cảnh", pos: "22% 50%" },
  { src: H("lighting-setup"), alt: "Setup ánh sáng Godox tại studio", pos: "center 55%" },
  { src: H("product-shoot"), alt: "Chụp sản phẩm tại studio", pos: "center 40%" },
];
