/**
 * 3 mảng dịch vụ chính theo hồ sơ yêu cầu.
 * `slug`: đường dẫn trang con /dich-vu/[slug] và giá trị chọn sẵn trong form đặt lịch (data-booking).
 * `menuDesc`: mô tả 1 dòng trong dropdown header. `highlights`: 3 số liệu nổi bật ở hero trang con.
 */
export const services = [
  {
    slug: "san-xuat-video",
    heroDesc:
      "Gia công trọn gói TVC, phim doanh nghiệp và video sự kiện — từ ý tưởng, kịch bản đến quay dựng, hậu kỳ, tối ưu cho từng kênh quảng cáo.",
    // extra:san-xuat-video
    pool: [
      "/images/bts/bts-02.jpg",
      "/images/christmas/christmas-04.jpg",
      "/images/bts/bts-05.jpg",
      "/images/vintage-green/vintage-green-06.jpg",
      "/images/bts/bts-04.jpg",
      "/images/tet/tet-02.jpg",
      "/images/bts/bts-07.jpg",
      "/images/christmas/christmas-05.jpg",
      "/images/bts/bts-06.jpg",
      "/images/vintage-green/vintage-green-15.jpg",
      "/images/christmas/christmas-02.jpg",
      "/images/vintage-green/vintage-green-14.jpg",
    ],
    deliverTitle: "Nhận gì khi kết thúc dự án.",
    faqs: [
      {
        q: "Chi phí sản xuất một TVC là bao nhiêu?",
        a: "Tuỳ thời lượng, số ngày quay, diễn viên và mức độ hậu kỳ. Sau buổi brief, chúng tôi gửi dự toán chi tiết trong 24–48 giờ, chia theo hạng mục để bạn chủ động điều chỉnh.",
      },
      {
        q: "Thời gian hoàn thành một dự án video?",
        a: "Video sự kiện: 3–7 ngày. Phim doanh nghiệp / TVC: 2–4 tuần tính từ lúc duyệt kịch bản. Dự án gấp có thể thoả thuận ekip tăng cường.",
      },
      {
        q: "Có hỗ trợ ý tưởng và kịch bản nếu chúng tôi chưa có gì?",
        a: "Có. Từ buổi brief, chúng tôi đề xuất concept, kịch bản và storyboard để duyệt trước khi sản xuất.",
      },
      {
        q: "Video có được tối ưu cho quảng cáo Facebook / TikTok không?",
        a: "Mỗi dự án bàn giao kèm phiên bản dọc 9:16, bản cut 15s/30s và hook 3 giây đầu thiết kế riêng cho quảng cáo performance.",
      },
    ],
    number: "01",
    icon: "film",
    title: "Sản xuất video thương mại",
    menuDesc: "TVC, documentary, phim doanh nghiệp, sự kiện",
    tagline: "Video được thiết kế để bán hàng.",
    highlights: [
      { value: "4K", label: "Quay & bàn giao" },
      { value: "15–60s", label: "TVC / iTVC" },
      { value: "2 vòng", label: "Chỉnh sửa hậu kỳ" },
    ],
    short: "TVC · iTVC · Documentary · Phim doanh nghiệp · Video sự kiện",
    description:
      "Gia công trọn gói từ ý tưởng, kịch bản đến quay dựng và hậu kỳ. Video được thiết kế để bán hàng: rõ thông điệp, đúng đối tượng và tối ưu cho các kênh performance.",
    image: "/images/bts/bts-02.jpg",
    imagePos: "center 40%",
    gallery: ["/images/bts/bts-05.jpg", "/images/bts/bts-01.jpg", "/images/bts/bts-04.jpg"],
    items: [
      {
        name: "TVC / iTVC quảng cáo",
        image: "/images/bts/bts-02.jpg",
        desc: "Phim quảng cáo 15s – 60s cho truyền hình, YouTube, Facebook, TikTok.",
      },
      {
        name: "Video documentary",
        image: "/images/bts/bts-05.jpg",
        desc: "Phim tài liệu thương hiệu, câu chuyện người thật việc thật, phóng sự doanh nghiệp.",
      },
      {
        name: "Phim giới thiệu doanh nghiệp",
        image: "/images/bts/bts-06.jpg",
        desc: "Corporate film, profile công ty, video năng lực phục vụ đấu thầu & đối tác.",
      },
      {
        name: "Video sự kiện doanh nghiệp",
        image: "/images/bts/bts-07.jpg",
        desc: "Ghi hình hội nghị, lễ ra mắt, year-end party; highlight phát ngay trong ngày.",
      },
    ],
    goodFor: ["SME & Startup", "Chiến dịch push sale", "Quảng cáo performance", "Ra mắt sản phẩm"],
    deliverables: [
      "File 4K / FullHD",
      "Phiên bản dọc 9:16 cho social",
      "Bản cut 15s/30s/60s",
      "Phụ đề & lồng tiếng",
    ],
  },
  {
    slug: "cho-thue-studio",
    heroDesc:
      "Sáu bối cảnh đã setup sẵn ánh sáng, phông nền và đạo cụ cho chụp ảnh, quay quảng cáo và livestream — thuê theo giờ, có kỹ thuật hỗ trợ.",
    // extra:cho-thue-studio
    pool: [
      "/images/vintage-green/vintage-green-03.jpg",
      "/images/box-studio/box-studio-04.jpg",
      "/images/christmas/christmas-14.jpg",
      "/images/tet/tet-04.jpg",
      "/images/vintage-green/vintage-green-07.jpg",
      "/images/christmas/christmas-01.jpg",
      "/images/box-studio/box-studio-05.jpg",
      "/images/tet/tet-05.jpg",
      "/images/vintage-green/vintage-green-12.jpg",
      "/images/vintage-green/vintage-green-11.jpg",
      "/images/christmas/christmas-10.jpg",
      "/images/box-studio/box-studio-08.jpg",
      "/images/tet/tet-07.jpg",
      "/images/vintage-green/vintage-green-05.jpg",
      "/images/trung-thu/trung-thu-02.jpg",
      "/images/christmas/christmas-03.jpg",
    ],
    deliverTitle: "Thuê studio, nhận đủ đồ nghề.",
    faqs: [
      {
        q: "Thuê studio tính phí thế nào, có bao gồm đèn không?",
        a: "Tính theo giờ, tối thiểu 2 giờ, đã gồm hệ đèn Godox, phông nền và đạo cụ sẵn có của từng bối cảnh. Có gói kèm kỹ thuật viên ánh sáng.",
      },
      {
        q: "Cần đặt lịch trước bao lâu?",
        a: "Nên đặt trước tối thiểu 1 ngày; dịp lễ (Giáng sinh, Tết, Trung thu) nên đặt trước 1–2 tuần. Chúng tôi xác nhận lịch trong ngày.",
      },
      {
        q: "Có được mang ekip và đạo cụ riêng vào không?",
        a: "Được. Bạn có thể mang nhiếp ảnh gia, máy móc và đạo cụ riêng; studio hỗ trợ sắp xếp bối cảnh và ánh sáng tại chỗ.",
      },
      {
        q: "Studio có phòng thay đồ, trang điểm không?",
        a: "Có phòng thay đồ và bàn trang điểm riêng, phù hợp cho buổi chụp lookbook, profile hay quay quảng cáo cần nhiều trang phục.",
      },
    ],
    number: "02",
    icon: "studio",
    title: "Cho thuê bối cảnh studio",
    menuDesc: "6 bối cảnh sẵn đèn, phông, đạo cụ",
    tagline: "Mang ý tưởng đến, mọi thứ khác đã sẵn sàng.",
    highlights: [
      { value: "6", label: "Bối cảnh sẵn có" },
      { value: "2 giờ", label: "Thuê tối thiểu" },
      { value: "8–21h", label: "Mở cửa mỗi ngày" },
    ],
    short: "Phòng chụp & quay quảng cáo · 6 bối cảnh sẵn có · Đèn, phông, đạo cụ",
    description:
      "Không gian studio đã setup sẵn ánh sáng và đạo cụ cho chụp ảnh, quay video quảng cáo, lookbook, livestream. Đặt lịch theo giờ, có ekip hỗ trợ kỹ thuật khi cần.",
    image: "/images/vintage-green/vintage-green-03.jpg",
    imagePos: "center",
    gallery: [
      "/images/box-studio/box-studio-04.jpg",
      "/images/vintage-green/vintage-green-09.jpg",
      "/images/christmas/christmas-14.jpg",
    ],
    items: [
      {
        name: "Box Studio trắng",
        image: "/images/box-studio/box-studio-04.jpg",
        desc: "Tone trắng tối giản cho lookbook, profile, sản phẩm nhỏ, beauty.",
      },
      {
        name: "Phòng Vintage xanh rêu",
        image: "/images/vintage-green/vintage-green-03.jpg",
        desc: "Ánh sáng tự nhiên, nội thất gỗ, nhiều góc chụp ấm áp.",
      },
      {
        name: "Khu vực sân thượng",
        image: "/images/rooftop/rooftop-clean.jpg",
        desc: "Ánh sáng tự nhiên, tường gạch & poster retro cho clip ngắn.",
      },
      {
        name: "Bối cảnh theo mùa",
        image: "/images/christmas/christmas-14.jpg",
        desc: "Giáng sinh, Tết, Trung thu được dựng mới mỗi dịp lễ.",
      },
    ],
    goodFor: [
      "Lookbook & profile",
      "Livestream bán hàng",
      "Chụp sản phẩm",
      "Clip ngắn TikTok/Reels",
    ],
    deliverables: [
      "Đèn Godox & softbox",
      "Phông nền & đạo cụ",
      "Phòng thay đồ, trang điểm",
      "Hỗ trợ kỹ thuật tại chỗ",
    ],
  },
  {
    slug: "chup-anh-thuong-mai",
    heroDesc:
      "Key visual, lookbook, ảnh sản phẩm và profile doanh nghiệp — hình ảnh đồng bộ với cả chiến dịch, bàn giao đủ bản web và bản in.",
    // extra:chup-anh-thuong-mai
    pool: [
      "/images/christmas/christmas-07.jpg",
      "/images/vintage-green/vintage-green-15.jpg",
      "/images/christmas/christmas-16.jpg",
      "/images/bts/bts-06.jpg",
      "/images/vintage-green/vintage-green-10.jpg",
      "/images/christmas/christmas-06.jpg",
      "/images/box-studio/box-studio-06.jpg",
      "/images/christmas/christmas-11.jpg",
      "/images/vintage-green/vintage-green-13.jpg",
      "/images/christmas/christmas-08.jpg",
      "/images/tet/tet-02.jpg",
      "/images/vintage-green/vintage-green-09.jpg",
    ],
    deliverTitle: "Nhận gì sau buổi chụp.",
    faqs: [
      {
        q: "Bao lâu thì nhận được ảnh?",
        a: "Ảnh xem trước gửi trong 24 giờ để bạn chọn; ảnh đã retouch bàn giao trong 3–5 ngày làm việc, đủ bản web và bản in.",
      },
      {
        q: "Có hỗ trợ người mẫu, stylist, trang điểm không?",
        a: "Có. Chúng tôi giới thiệu người mẫu, stylist và makeup phù hợp concept; chi phí báo riêng trong dự toán.",
      },
      {
        q: "Chụp tại studio hay tại cửa hàng của chúng tôi?",
        a: "Cả hai. Có thể chụp tại 6 bối cảnh của studio hoặc mang thiết bị đến cửa hàng, văn phòng, công trình của bạn.",
      },
      {
        q: "Ảnh có dùng được cho quảng cáo và sàn TMĐT không?",
        a: "Có. Ảnh được xuất đúng tỉ lệ và dung lượng cho quảng cáo Facebook, TikTok, Shopee/Lazada và bản in khổ lớn.",
      },
    ],
    number: "03",
    icon: "camera",
    title: "Chụp ảnh thương mại",
    menuDesc: "Key visual, lookbook, sản phẩm, profile",
    tagline: "Hình ảnh đồng bộ với cả chiến dịch.",
    highlights: [
      { value: "3–5 ngày", label: "Bàn giao ảnh" },
      { value: "Web + in", label: "Đủ định dạng" },
      { value: "12 tháng", label: "Lưu trữ file gốc" },
    ],
    short: "Key visual · Lookbook · Sản phẩm · Profile doanh nghiệp",
    description:
      "Hình ảnh đồng bộ với chiến dịch video: key visual cho quảng cáo, lookbook thời trang, ảnh sản phẩm e-commerce và ảnh profile đội ngũ.",
    image: "/images/bts/bts-06.jpg",
    imagePos: "center",
    gallery: [
      "/images/bts/bts-03.jpg",
      "/images/christmas/christmas-08.jpg",
      "/images/tet/tet-07.jpg",
    ],
    items: [
      {
        name: "Key visual chiến dịch",
        image: "/images/christmas/christmas-07.jpg",
        desc: "Ảnh chủ đạo cho quảng cáo, billboard, landing page.",
      },
      {
        name: "Lookbook & thời trang",
        image: "/images/vintage-green/vintage-green-15.jpg",
        desc: "Concept, model, stylist theo bộ sưu tập.",
      },
      {
        name: "Ảnh sản phẩm",
        image: "/images/box-studio/box-studio-06.jpg",
        desc: "Nền trắng chuẩn sàn TMĐT hoặc lifestyle có bối cảnh.",
      },
      {
        name: "Profile doanh nghiệp",
        image: "/images/bts/bts-06.jpg",
        desc: "Chân dung lãnh đạo, đội ngũ, không gian làm việc.",
      },
    ],
    goodFor: ["Thương hiệu thời trang", "Trang sức & mỹ phẩm", "F&B", "Sàn thương mại điện tử"],
    deliverables: [
      "Ảnh retouch chuẩn in ấn",
      "Bản web & social",
      "Bàn giao trong 3–5 ngày",
      "Lưu trữ 12 tháng",
    ],
  },
];

// Gói gợi ý trên trang tổng hợp Dịch vụ: các dịch vụ con kết hợp cho mục tiêu cụ thể của SME
export const packages = [
  {
    title: "Ra mắt sản phẩm",
    goal: "Tạo tiếng vang trong tuần đầu mở bán",
    includes: ["TVC 30s & bản cut 15s", "Key visual cho quảng cáo", "3 clip dọc 9:16 cho social"],
    services: ["san-xuat-video", "chup-anh-thuong-mai"],
    image: "/images/bts/bts-02.jpg",
    pos: "center 40%",
  },
  {
    title: "Nội dung social hằng tháng",
    goal: "Đều đặn nội dung, chi phí dự đoán được",
    includes: [
      "Thuê studio theo buổi",
      "8–12 clip ngắn TikTok / Reels",
      "Bộ ảnh sản phẩm & lifestyle",
    ],
    services: ["cho-thue-studio", "san-xuat-video", "chup-anh-thuong-mai"],
    image: "/images/box-studio/box-studio-04.jpg",
    pos: "center",
    featured: true,
  },
  {
    title: "Hồ sơ năng lực doanh nghiệp",
    goal: "Thuyết phục đối tác & hồ sơ đấu thầu",
    includes: [
      "Phim giới thiệu doanh nghiệp",
      "Ảnh profile lãnh đạo & đội ngũ",
      "Ảnh không gian làm việc",
    ],
    services: ["san-xuat-video", "chup-anh-thuong-mai"],
    image: "/images/bts/bts-05.jpg",
    pos: "center",
  },
];

export const getService = (slug) => services.find((s) => s.slug === slug);

export const processSteps = [
  {
    step: "01",
    image: "/images/box-studio/box-studio-04.jpg",
    imagePos: "center",
    title: "Brief & tư vấn",
    desc: "Lắng nghe mục tiêu kinh doanh, đối tượng, kênh phát và ngân sách. Đề xuất định dạng video phù hợp.",
  },
  {
    step: "02",
    image: "/images/vintage-green/vintage-green-09.jpg",
    imagePos: "center",
    title: "Ý tưởng & kịch bản",
    desc: "Concept, kịch bản, storyboard và bảng dự toán chi tiết — duyệt trước khi bấm máy.",
  },
  {
    step: "03",
    image: "/images/bts/bts-04.jpg",
    imagePos: "center",
    title: "Tiền kỳ",
    desc: "Casting, chọn bối cảnh, đạo cụ, lịch quay; chuẩn bị thiết bị và ekip.",
  },
  {
    step: "04",
    image: "/images/bts/bts-02.jpg",
    imagePos: "center 40%",
    title: "Sản xuất",
    desc: "Ngày quay/chụp với đạo diễn, DOP, ánh sáng, âm thanh. Khách hàng theo dõi monitor trực tiếp.",
  },
  {
    step: "05",
    image: "/images/bts/bts-06.jpg",
    imagePos: "center 30%",
    title: "Hậu kỳ & bàn giao",
    desc: "Dựng, chỉnh màu, âm thanh, đồ hoạ. 2 vòng chỉnh sửa, bàn giao đa định dạng cho từng kênh.",
  },
];

export const values = [
  {
    title: "Uy tín",
    image: "/images/bts/bts-05.jpg",
    imagePos: "center 35%",
    desc: "10+ năm đồng hành cùng khách hàng, đối tác và doanh nghiệp — cam kết đúng tiến độ, đúng dự toán.",
  },
  {
    title: "Trách nhiệm",
    image: "/images/bts/bts-04.jpg",
    imagePos: "center",
    desc: "Một đầu mối chịu trách nhiệm trọn gói từ ý tưởng đến file bàn giao. Không đùn đẩy, không phát sinh ẩn.",
  },
  {
    title: "Tâm huyết",
    image: "/images/bts/bts-06.jpg",
    imagePos: "center 30%",
    desc: "Mỗi sản phẩm là một câu chuyện. Ekip dành thời gian hiểu thương hiệu trước khi hiểu máy quay.",
  },
];

export const stats = [
  { value: "10+", label: "Năm kinh nghiệm" },
  { value: "3", label: "Mảng dịch vụ trọn gói" },
  { value: "6", label: "Bối cảnh studio sẵn có" },
  { value: "A–Z", label: "Một đầu mối chịu trách nhiệm" },
];

// Ngành hàng đã đồng hành — hiện dạng dải chữ chạy. Khi có logo đối tác, thay bằng ảnh tại src/data/partners.js
export const industries = [
  "F&B",
  "Thời trang",
  "Trang sức",
  "Bất động sản",
  "Giáo dục",
  "Công nghệ",
  "Mỹ phẩm",
  "Nội thất",
  "Y tế",
  "Tài chính",
];

// Loại sản phẩm đã làm cho từng ngành — tầng dưới của dải "Đã đồng hành"
export const industryWork = [
  "TVC món ăn",
  "Lookbook thời trang",
  "Key visual trang sức",
  "Phim dự án bất động sản",
  "Video tuyển sinh",
  "Demo sản phẩm công nghệ",
  "Review mỹ phẩm",
  "Chụp ảnh nội thất",
  "Phim giới thiệu phòng khám",
  "Phim thương hiệu tài chính",
];

export const faqs = [
  {
    q: "Chi phí sản xuất một TVC là bao nhiêu?",
    a: "Tuỳ thời lượng, số ngày quay, diễn viên và mức độ hậu kỳ. Sau buổi brief, chúng tôi gửi dự toán chi tiết trong 24–48 giờ, chia theo hạng mục để bạn chủ động điều chỉnh.",
  },
  {
    q: "Thời gian hoàn thành một dự án video?",
    a: "Video sự kiện: 3–7 ngày. Phim doanh nghiệp / TVC: 2–4 tuần tính từ lúc duyệt kịch bản. Dự án gấp có thể thoả thuận ekip tăng cường.",
  },
  {
    q: "Thuê studio tính phí thế nào, có bao gồm đèn không?",
    a: "Tính theo giờ, tối thiểu 2 giờ, đã bao gồm hệ thống đèn Godox, phông nền và đạo cụ sẵn có của từng bối cảnh. Có gói kèm kỹ thuật viên ánh sáng.",
  },
  {
    q: "Có hỗ trợ ý tưởng và kịch bản nếu chúng tôi chưa có gì?",
    a: "Có. Đây là phần việc mặc định trong quy trình: từ brief, chúng tôi đề xuất concept, kịch bản và storyboard để duyệt trước khi sản xuất.",
  },
  {
    q: "Video có được tối ưu cho quảng cáo Facebook / TikTok không?",
    a: "Mỗi dự án bàn giao kèm phiên bản dọc 9:16, bản cut ngắn 15s/30s và hook 3 giây đầu được thiết kế riêng cho quảng cáo performance.",
  },
];
