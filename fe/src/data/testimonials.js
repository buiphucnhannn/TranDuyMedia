// Cảm nhận khách hàng (trang chủ) — CHỈ nhập lời nhận xét THẬT, đã được khách hàng đồng ý đăng.
// - quote: lời nhận xét (2–4 câu là đẹp nhất) · name: người nhận xét · role: chức vụ - công ty
// - service: dịch vụ đã dùng · logo (tuỳ chọn): logo công ty, vd "/images/partners/zema.webp"
// - image (tuỳ chọn): ảnh nền khung hình — nên là ảnh dự án đã làm cho chính khách hàng đó;
//   bỏ trống → tự lấy ảnh thiết bị / bối cảnh (không có người) theo dịch vụ.
// - sample: true = đánh dấu nội dung DEMO (tên, chức vụ, lĩnh vực hư cấu) cho khách xem trước thiết kế.
//   Trước khi chạy chính thức: thay bằng nhận xét thật và xoá dòng sample. Danh sách rỗng → ẩn cả khối.
export const testimonials = [
  {
    sample: true,
    quote:
      "Ekip làm việc chuyên nghiệp từ khâu kịch bản đến hậu kỳ, đúng tiến độ đã cam kết. Video ra mắt sản phẩm vượt mong đợi và mang về lượng tương tác gấp nhiều lần chiến dịch trước.",
    name: "Nguyễn Minh Anh",
    role: "Giám đốc Marketing - Thương hiệu mỹ phẩm",
    service: "Sản xuất video marketing",
    image: "/images/about-hd/product-shoot.webp",
  },
  {
    sample: true,
    quote:
      "Bộ ảnh sản phẩm sắc nét, đúng tinh thần thương hiệu và dùng được ngay cho mọi kênh bán hàng. Ekip tư vấn bố cục rất kỹ nên ảnh lên sàn TMĐT nổi bật hẳn.",
    name: "Trần Quốc Bảo",
    role: "Chủ cửa hàng - Chuỗi trang sức",
    service: "Chụp ảnh thương mại",
    image: "/images/bts/bts-07.webp",
  },
  {
    sample: true,
    quote:
      "Sự kiện hơn 300 khách nhưng ekip vẫn bắt trọn từng khoảnh khắc quan trọng. Ảnh được chọn lọc và gửi ngay trong ngày để đội truyền thông đăng kịp thời.",
    name: "Lê Thu Hà",
    role: "Trưởng phòng Truyền thông - Doanh nghiệp sản xuất",
    service: "Chụp ảnh sự kiện",
    image: "/images/about-hd/event-hall.webp",
  },
  {
    sample: true,
    quote:
      "Studio gọn gàng, setup linh hoạt, đổi bối cảnh rất nhanh giữa các buổi chụp lookbook. Đội ngũ hỗ trợ nhiệt tình từ lúc đặt lịch đến khi kết thúc.",
    name: "Phạm Gia Huy",
    role: "Nhà sáng lập - Thương hiệu thời trang",
    service: "Cho thuê studio",
    image: "/images/vintage-green/vintage-green-03.webp",
  },
];
