# Tran Duy Media Studio – Website

Website giới thiệu studio sản xuất video thương mại & cho thuê bối cảnh quay chụp.
Xây dựng với **Next.js 16 (App Router)**, **Tailwind CSS v4**, **JavaScript thuần**, cuộn mượt **Lenis**.
Phong cách: minimalism – cinematic, 3 màu từ logo (navy `#182838`, cam `#f86808`, đen).

## Bắt đầu

```bash
npm install
cp .env.example .env.local   # điền NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

| Lệnh             | Mô tả                                               |
| ---------------- | --------------------------------------------------- |
| `npm run dev`    | Chạy môi trường phát triển                          |
| `npm run build`  | Build production                                    |
| `npm start`      | Chạy bản build                                      |
| `npm run lint`   | Kiểm tra code bằng ESLint                           |
| `npm run format` | Format bằng Prettier (tự sắp xếp class Tailwind)    |
| `npm run assets` | Tạo lại favicon, icon PWA, ảnh OG từ logo           |
| `npm run video`  | Nén showreel 4K gốc → bản web 1080p/720p + ảnh bìa (cần ffmpeg) |

## Trang & chức năng

| Đường dẫn         | Nội dung                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| `/`               | Hero điện ảnh, showreel, giới thiệu, 3 dịch vụ, bối cảnh studio, quy trình, USP |
| `/dich-vu`        | Chi tiết 3 mảng dịch vụ, quy trình, FAQ                                  |
| `/studio`         | 6 bộ sưu tập bối cảnh cho thuê                                           |
| `/studio/[slug]`  | Album ảnh từng bối cảnh (lightbox)                                       |
| `/gioi-thieu`     | Câu chuyện, số liệu, ảnh hậu trường                                      |

- **Đặt lịch**: mọi phần tử có `data-booking` (tuỳ chọn `data-booking="slug-dich-vu"`) mở popup form.
- **Showreel**: video tự host trong `public/media/` (1080p cho máy tính, 720p cho điện thoại). Tự phát (tắt tiếng) khi cuộn tới, tự dừng khi cuộn qua, có nút tạm dừng / bật tiếng. Phần tử có `data-showreel` mở popup xem toàn màn hình có tiếng. Có showreel mới: chép file gốc vào `public/videos/` rồi chạy `npm run video`.
- **Chat**: nút nổi Messenger / Zalo / Gọi (`FloatingContact`).
- **Form**: chưa có backend — soạn tin nhắn, copy clipboard và mở Messenger/Zalo. Nối API tại `src/components/booking/BookingForm.jsx`.

## Cấu trúc

```
public/
├── images/
│   ├── brand/          logo.png · logo-light.png (logo đầy đủ, luôn kèm chữ) · logo-mark.png (chỉ để sinh favicon)
│   ├── bts/            ảnh hậu trường sản xuất
│   ├── vintage-green/  box-studio/  rooftop/        bối cảnh thường trực
│   ├── christmas/  tet/  trung-thu/                 bối cảnh theo mùa
│   └── og-image.png
├── icons/              PWA icons
├── media/              showreel-1080.mp4 · showreel-720.mp4 · showreel-poster.jpg (bản web, commit)
└── videos/             (bị gitignore – file showreel 4K gốc, quá nặng để commit)
src/
├── app/                routes, layout gốc, robots/sitemap/manifest
├── components/
│   ├── booking/        BookingModal, BookingForm, VideoModal
│   ├── fx/             SmoothScroll (Lenis), Reveal, Parallax, SplitText, PageTransition, ScrollTop
│   ├── gallery/        CollectionCard, AlbumGallery
│   ├── icons/          icon SVG inline
│   ├── layout/         Header (pill kính mờ), Footer, FloatingContact
│   ├── sections/       Hero, Showreel, Intro, ServicesGrid, StudioShowcase, Process, Values, Faq, PageHeader
│   └── ui/             Button, Container, SectionHeading, Logo, Lightbox, Marquee
├── config/site.js      thông tin thương hiệu, liên hệ, mạng xã hội, link showreel, menu
├── data/               services.js (dịch vụ, quy trình, FAQ) · collections.js (bộ sưu tập ảnh)
├── hooks/useReveal.js
└── lib/                cn, lockScroll, createMetadata
```

## Tuỳ chỉnh nhanh

- **Thông tin, hotline, địa chỉ, link Zalo/Messenger, ID video Drive**: `src/config/site.js`
- **Nội dung dịch vụ / FAQ / quy trình**: `src/data/services.js`
- **Bộ sưu tập ảnh**: thêm ảnh vào `public/images/<slug>/` và khai báo trong `src/data/collections.js`
- **Màu / font**: khối `@theme` trong `src/app/globals.css`
- **Header tối/sáng**: section muốn header kính tối đặt `data-nav-theme="dark"`
- **Hiệu ứng hiện dần**: thêm class `reveal` (tuỳ chọn `data-reveal="left|right|scale|clip"`, `--reveal-delay`)
- **Logo**: thay 3 file trong `public/images/brand/` rồi chạy `npm run assets`
