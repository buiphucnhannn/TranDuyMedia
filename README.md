# Tran Duy Media Studio

Website giới thiệu dịch vụ của Tran Duy Media Studio — sản xuất video thương mại, cho thuê bối cảnh
studio, chụp ảnh thương mại. Repo gồm 2 ứng dụng độc lập:

| Thư mục      | Ứng dụng                                                                   | Cổng mặc định |
| ------------ | -------------------------------------------------------------------------- | ------------- |
| [`fe/`](fe/) | Frontend — Next.js 16 + TailwindCSS 4                                      | `3000`        |
| [`be/`](be/) | Backend API — ExpressJS 5 (routes → controllers → services → repositories) | `4000`        |
| `docs/`      | Tài liệu yêu cầu dự án                                                     |               |

## Bắt đầu

```bash
npm run install:all      # cài dependencies cho cả fe và be

# chạy song song ở 2 terminal
npm run dev:fe           # http://localhost:3000
npm run dev:be           # http://localhost:4000/api/v1/health
```

Hoặc vào từng thư mục và dùng script riêng — xem [fe/README.md](fe/README.md) và [be/README.md](be/README.md).

Mỗi app có `.env.example` riêng: copy thành `fe/.env.local` và `be/.env`.

### Đăng nhập quản trị

1. Điền `ADMIN_ID`, `ADMIN_PASSWORD` (≥ 12 ký tự) và 2 secret JWT (`npm run secret --prefix be`) vào `be/.env`
2. Mở http://localhost:3000/login → vào `/admin`

Frontend gọi API qua `/api/v1/*` cùng tên miền, Next.js chuyển tiếp sang `BACKEND_URL`
(địa chỉ này được chốt lúc build — đặt `BACKEND_URL` trước `npm run build` khi deploy).
