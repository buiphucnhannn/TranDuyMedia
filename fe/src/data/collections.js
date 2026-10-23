/**
 * Bộ sưu tập bối cảnh studio cho thuê — mỗi bộ là một thư mục trong public/images/<slug>/.
 * `pos` chỉnh điểm nhìn khi ảnh bị cắt theo khung (object-position).
 */
const img = (slug, n, pos = "center") => ({
  src: `/images/${slug}/${slug}-${String(n).padStart(2, "0")}.webp`,
  pos,
});

export const collections = [
  {
    slug: "vintage-green",
    name: "Phòng Vintage xanh rêu",
    eyebrow: "Bối cảnh thường trực",
    tagline: "Ánh nắng xuyên rèm, nội thất gỗ và một chút hoài niệm.",
    description:
      "Căn phòng tone xanh rêu với rèm sáo, ghế mây, đàn guitar và tranh hướng dương — nơi ánh sáng tự nhiên buổi sáng đẹp nhất. Phù hợp chụp chân dung, lookbook nhẹ nhàng, quay clip lifestyle và nội dung review sản phẩm.",
    features: [
      "Ánh sáng tự nhiên hướng Đông",
      "Đạo cụ vintage & cây xanh",
      "3 góc chụp chính",
      "Đèn bổ trợ Godox",
    ],
    cover: img("vintage-green", 3, "center 55%"),
    covers: [img("vintage-green", 3), img("vintage-green", 14), img("vintage-green", 9)],
    images: [
      img("vintage-green", 2),
      img("vintage-green", 3),
      img("vintage-green", 4),
      img("vintage-green", 5),
      img("vintage-green", 6),
      img("vintage-green", 7),
      img("vintage-green", 8),
      img("vintage-green", 9),
      img("vintage-green", 10),
      img("vintage-green", 11),
      img("vintage-green", 12),
      img("vintage-green", 13),
      img("vintage-green", 14),
      img("vintage-green", 15),
      img("vintage-green", 1, "top"),
    ],
  },
  {
    slug: "box-studio",
    name: "Box Studio trắng",
    eyebrow: "Minimalist",
    tagline: "Tone trắng – đen tối giản, tự do sáng tạo.",
    description:
      "Không gian tone trắng và box concept minimalist với hệ đèn Godox, softbox, phông nền. Thích hợp chụp lookbook, profile, livestream, ảnh sản phẩm nhỏ, beauty và sinh nhật. Thuê theo giờ, linh hoạt setup.",
    features: [
      "Phông trắng liền sàn",
      "Hệ đèn Godox + softbox",
      "Bàn chụp sản phẩm",
      "Góc livestream sẵn sàng",
    ],
    cover: img("box-studio", 4, "center"),
    covers: [img("box-studio", 2), img("box-studio", 5), img("box-studio", 7)],
    images: [
      img("box-studio", 2),
      img("box-studio", 1),
      img("box-studio", 4),
      img("box-studio", 5),
      img("box-studio", 6),
      img("box-studio", 7),
      img("box-studio", 8),
      img("box-studio", 3, "top"),
    ],
  },
  {
    slug: "rooftop",
    name: "Khu vực sân thượng",
    eyebrow: "Ánh sáng tự nhiên",
    tagline: "Tường gạch, poster retro và nắng chiều.",
    description:
      "Sân thượng với tường gạch, cửa sổ xanh và bộ sưu tập poster xưa — nơi có ánh sáng tự nhiên, dùng cho chụp ảnh nhanh, quay clip ngắn, lookbook và các concept retro Sài Gòn.",
    features: [
      "Nắng tự nhiên cả ngày",
      "Tường gạch & poster retro",
      "Góc quay clip ngắn",
      "Không gian thoáng",
    ],
    cover: { src: "/images/rooftop/rooftop-clean.webp", pos: "center" },
    covers: [
      { src: "/images/rooftop/rooftop-clean.webp", pos: "center" },
      img("rooftop", 1),
      img("rooftop", 3),
    ],
    images: [img("rooftop", 2), img("rooftop", 3, "top"), img("rooftop", 1, "top")],
  },
  {
    slug: "christmas",
    name: "Giáng sinh an lành",
    eyebrow: "Bối cảnh theo mùa",
    tagline: "Tuyết trắng, lò sưởi và áo len đỏ.",
    description:
      "Bối cảnh Giáng sinh tone trắng – xanh thông với lò sưởi, tuyết giả, cầu tuyết và nến — thêm phòng xanh ấm với piano và nến đỏ. Dựng mới mỗi mùa, phù hợp chụp gia đình, cặp đôi, lookbook áo len và nội dung quảng cáo dịp lễ.",
    features: [
      "2 set: tuyết trắng & ấm áp",
      "Lò sưởi, thông, cầu tuyết",
      "Đạo cụ nến, quà, khăn len",
      "Gói chụp basic theo giờ",
    ],
    cover: img("christmas", 14, "center"),
    covers: [img("christmas", 14), img("christmas", 7), img("christmas", 3)],
    images: [
      img("christmas", 14),
      img("christmas", 3),
      img("christmas", 7),
      img("christmas", 4),
      img("christmas", 5),
      img("christmas", 6),
      img("christmas", 8),
      img("christmas", 9),
      img("christmas", 10),
      img("christmas", 11),
      img("christmas", 13),
      img("christmas", 15),
      img("christmas", 16),
      img("christmas", 17),
      img("christmas", 2),
      img("christmas", 1),
      img("christmas", 12, "top"),
    ],
  },
  {
    slug: "tet",
    name: "Xuân mến thương",
    eyebrow: "Bối cảnh theo mùa",
    tagline: "Tết xưa với TV cổ, câu đối và hoa mai.",
    description:
      "Góc Tết hoài cổ: TV đen trắng, điện thoại quay số, bình thuỷ, câu đối đỏ, tường đỏ với ghế gỗ và hoa mai. Dành cho ảnh gia đình, áo dài, lookbook Tết và TVC mùa xuân.",
    features: [
      "Set tường đỏ & set phòng xưa",
      "Đạo cụ TV, điện thoại cổ",
      "Hoa mai, câu đối, bao lì xì",
      "Chụp áo dài & gia đình",
    ],
    cover: img("tet", 3, "center"),
    covers: [img("tet", 3), img("tet", 5), img("tet", 4)],
    images: [
      img("tet", 3),
      img("tet", 5),
      img("tet", 4),
      img("tet", 6),
      img("tet", 7),
      img("tet", 2),
      img("tet", 1, "top"),
    ],
  },
  {
    slug: "trung-thu",
    name: "Dưới ánh trăng rằm",
    eyebrow: "Bối cảnh theo mùa",
    tagline: "Trăng vàng, lồng đèn và cá chép.",
    description:
      "Bối cảnh Trung thu với trăng tròn, tre, lồng đèn ngôi sao, cá chép và TV cổ trên nền tường tre — ấm áp cho ảnh thiếu nhi, gia đình và nội dung quảng cáo bánh trung thu.",
    features: [
      "Trăng vàng & tường tre",
      "Lồng đèn ngôi sao, cá chép",
      "Góc TV cổ, bàn gỗ",
      "Ưu đãi chụp thiếu nhi",
    ],
    cover: img("trung-thu", 2, "center"),
    covers: [img("trung-thu", 2), img("trung-thu", 3), img("trung-thu", 4)],
    images: [
      img("trung-thu", 2),
      img("trung-thu", 3),
      img("trung-thu", 1),
      img("trung-thu", 4),
      img("trung-thu", 5, "top"),
    ],
  },
];

export const getCollection = (slug) => collections.find((c) => c.slug === slug);

// Ảnh hậu trường sản xuất (trang Về chúng tôi, hero)
export const btsImages = [
  { src: "/images/bts/bts-02.webp", alt: "Quay phim với máy cinema tại studio", pos: "center 40%" },
  { src: "/images/bts/bts-05.webp", alt: "Ekip quay phim trên trường quay", pos: "center" },
  { src: "/images/bts/bts-07.webp", alt: "Hệ thống đèn và softbox tại Box Studio", pos: "center" },
  { src: "/images/bts/bts-04.webp", alt: "Setup ánh sáng Godox", pos: "center" },
  {
    src: "/images/bts/bts-06.webp",
    alt: "Buổi chụp thương mại cho cửa hàng trang sức",
    pos: "center",
  },
  { src: "/images/bts/bts-01.webp", alt: "Video production – Trần Duy Media", pos: "top" },
  {
    src: "/images/bts/bts-03.webp",
    alt: "Sản xuất hình ảnh: key visual, lookbook, profile",
    pos: "top",
  },
];
