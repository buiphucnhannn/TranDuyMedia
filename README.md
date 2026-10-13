# Trần Duy Media – Website

Website giới thiệu doanh nghiệp, xây dựng với **Next.js 16 (App Router)**, **Tailwind CSS v4** và **JavaScript thuần** (không TypeScript).

## Bắt đầu

```bash
npm install
cp .env.example .env.local   # điền NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

| Lệnh                   | Mô tả                                              |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Chạy môi trường phát triển                         |
| `npm run build`        | Build production                                   |
| `npm start`            | Chạy bản build                                     |
| `npm run lint`         | Kiểm tra code bằng ESLint                          |
| `npm run format`       | Format code bằng Prettier (tự sắp xếp class Tailwind) |
| `npm run assets`       | Tạo lại favicon, icons, OG image từ logo           |

## Cấu trúc thư mục

```
├── public/
│   ├── .well-known/security.txt
│   ├── icons/                  # PWA icons (192, 512, maskable, apple-touch)
│   ├── images/
│   │   ├── logo.svg            # Logo nền sáng
│   │   ├── logo-light.svg      # Logo nền tối
│   │   ├── logo-mark.svg       # Biểu tượng – nguồn để tạo mọi icon
│   │   ├── og-image.png        # Ảnh chia sẻ mạng xã hội 1200×630
│   │   ├── hero.jpg, about.jpg # Ảnh placeholder
│   │   └── portfolio/          # Ảnh dự án (placeholder)
│   └── humans.txt
├── scripts/
│   └── generate-assets.mjs     # Sinh icon/ảnh bằng sharp
└── src/
    ├── app/                    # Routes (App Router)
    │   ├── layout.js           # Layout gốc, font, metadata SEO, JSON-LD
    │   ├── page.js             # Trang chủ
    │   ├── gioi-thieu/  dich-vu/  du-an/  lien-he/
    │   ├── not-found.js  error.js  loading.js
    │   ├── robots.js  sitemap.js  manifest.js
    │   └── favicon.ico  icon.svg  apple-icon.png
    ├── components/
    │   ├── icons/              # Bộ icon SVG inline
    │   ├── layout/             # Header, Footer
    │   ├── sections/           # Các khối nội dung của trang (Hero, CTA, ...)
    │   └── ui/                 # Thành phần cơ bản (Button, Container, ...)
    ├── config/site.js          # Thông tin thương hiệu, liên hệ, menu
    ├── data/                   # Nội dung tĩnh (dịch vụ, dự án, đánh giá)
    └── lib/                    # Tiện ích (cn, createMetadata)
```

## Tuỳ chỉnh

- **Thông tin công ty, liên hệ, mạng xã hội, menu:** `src/config/site.js`
- **Nội dung trang:** `src/data/*.js`
- **Màu thương hiệu, font:** khối `@theme` trong `src/app/globals.css` (`brand-*`, `ink-*`)
- **Logo:** thay `public/images/logo-mark.svg` rồi chạy `npm run assets`
- **Ảnh:** thay các file trong `public/images/` (giữ nguyên tên hoặc cập nhật trong `src/data`)
- **Form liên hệ:** đang giả lập gửi – kết nối API thật tại `src/components/sections/ContactForm.jsx` (TODO)

## Quy ước

- Import qua alias `@/` (ví dụ `@/components/ui`).
- Component dùng PascalCase, đuôi `.jsx`; file route theo quy ước Next.js (`page.js`, `layout.js`).
- Chỉ thêm `"use client"` khi component cần state/sự kiện (Header, ProjectGallery, ContactForm).
- Mỗi trang con export `metadata` qua `createMetadata()` để có title, canonical và Open Graph.
