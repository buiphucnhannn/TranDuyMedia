# Tran Duy Media — Backend (be)

API cho website Tran Duy Media Studio, viết bằng **ExpressJS 5** (JavaScript thuần, ES Modules),
dữ liệu lưu ở **MongoDB** (Mongoose), ảnh & video lưu ở **Cloudinary**.

## Yêu cầu

- Node.js **≥ 22.9** (dùng cờ `--env-file-if-exists`, `--watch`, `node:test` có sẵn — không cần dotenv/nodemon/jest)
- Một MongoDB (Atlas hoặc local) và một tài khoản Cloudinary

## Chạy

```bash
cd be
npm install
# điền MONGODB_URI và CLOUDINARY_* vào be/.env (đã tạo sẵn, để trống)
npm run dev              # http://localhost:4000/api/v1 — tự khởi động lại khi sửa code
```

| Lệnh             | Việc làm                                                     |
| ---------------- | ------------------------------------------------------------ |
| `npm run dev`    | Chạy chế độ phát triển (watch)                               |
| `npm start`      | Chạy production                                              |
| `npm test`       | Chạy test trên MongoDB tạm trong bộ nhớ (không đụng DB thật) |
| `npm run lint`   | ESLint                                                       |
| `npm run format` | Prettier                                                     |

## Kiến trúc

Request đi qua từng tầng theo một chiều, mỗi tầng chỉ biết tầng ngay dưới nó:

```
routes  →  middlewares (validate)  →  controllers  →  services  →  repositories  →  dữ liệu
```

| Tầng             | Thư mục            | Trách nhiệm                                                             |
| ---------------- | ------------------ | ----------------------------------------------------------------------- |
| **Routes**       | `src/routes`       | Khai báo URL, gắn middleware (validate, rate limit) và controller       |
| **Validators**   | `src/validators`   | Schema zod cho body / query / params — làm sạch & chuẩn hoá dữ liệu     |
| **Controllers**  | `src/controllers`  | Nhận `req.validated`, gọi service, trả response. Không chứa nghiệp vụ   |
| **Services**     | `src/services`     | Nghiệp vụ (chống gửi trùng, đổi trạng thái…). Không biết HTTP hay DB    |
| **Repositories** | `src/repositories` | Đọc / ghi dữ liệu. Thay DB chỉ cần viết repository mới cùng phương thức |
| Middlewares      | `src/middlewares`  | Validate, upload (multer), 404, xử lý lỗi tập trung                     |
| Models           | `src/models`       | Schema Mongoose (Booking, Media)                                        |
| Config           | `src/config`       | Biến môi trường (zod), kết nối MongoDB, Cloudinary SDK, logger          |
| Utils            | `src/utils`        | `ApiError`, định dạng response                                          |

```
be/
├── src/
│   ├── app.js              # Tạo Express app (bảo mật, CORS, nén, log, rate limit, routes, lỗi)
│   ├── server.js           # Kết nối MongoDB → mở cổng + graceful shutdown
│   ├── config/             # env.js, database.js, cloudinary.js, logger.js
│   ├── models/             # booking.model.js, media.model.js
│   ├── routes/             # index.js (/api/v1), booking.routes.js, media.routes.js
│   ├── controllers/        # booking, media
│   ├── services/           # booking, media (upload Cloudinary)
│   ├── repositories/       # base.repository.js (MongoRepository), booking, media
│   ├── validators/         # common, booking, media
│   ├── middlewares/        # validate, upload, error-handler
│   └── utils/              # api-error, response
├── tests/                  # api.test.js
├── .env                    # key thật (không commit)
└── .env.example
```

Import nội bộ dùng alias của Node (`"imports"` trong package.json): `#config/env.js`, `#services/booking.service.js`…

### Lưu trữ

- **MongoDB**: `MongoRepository` (src/repositories/base.repository.js) bọc model Mongoose, cung cấp
  `findAll / findOne / findById / create / update / delete` và trả object thuần có `id` dạng chuỗi.
  Server kết nối DB trước khi mở cổng, tự thử lại 5 lần; thiếu `MONGODB_URI` → dừng với thông báo rõ.
- **Cloudinary**: file nhận vào bộ nhớ (multer) rồi đẩy thẳng lên Cloudinary bằng stream, metadata
  (publicId, url, kích thước, thời lượng…) lưu ở collection `media`. Lưu DB lỗi → tự xoá file vừa upload.
  Chưa điền key Cloudinary → các API `/media` upload/xoá trả `503`, phần còn lại vẫn chạy.

### Biến môi trường

| Biến                                                                   | Mô tả                                                 |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| `MONGODB_URI`, `MONGODB_DB_NAME`                                       | Chuỗi kết nối & tên database                          |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary Console → Settings → API Keys              |
| `CLOUDINARY_FOLDER`                                                    | Thư mục gốc trên Cloudinary (mặc định `tranduymedia`) |
| `UPLOAD_MAX_IMAGE_MB`, `UPLOAD_MAX_VIDEO_MB`                           | Giới hạn dung lượng (mặc định 10MB / 200MB)           |
| `CORS_ORIGINS`                                                         | Origin frontend được phép gọi API                     |

Ở `NODE_ENV=production`, thiếu MongoDB / Cloudinary key → app dừng ngay khi khởi động.

## API v1

Định dạng response thống nhất:

```jsonc
{ "success": true, "data": { ... }, "meta": { ... } }                    // thành công
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } } // lỗi
```

| Method   | Endpoint                                   | Mô tả                                                                                                 |
| -------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/v1/health`                           | Trạng thái server, MongoDB, Cloudinary                                                                |
| `POST`   | `/api/v1/bookings`                         | Gửi yêu cầu đặt lịch tư vấn (form website) — 5 lần/15 phút/IP                                         |
| `GET`    | `/api/v1/bookings?status&page&limit`       | Danh sách yêu cầu (quản trị)                                                                          |
| `GET`    | `/api/v1/bookings/:id`                     | Chi tiết yêu cầu (quản trị)                                                                           |
| `PATCH`  | `/api/v1/bookings/:id/status`              | Đổi trạng thái `pending` (Chưa giải quyết) · `contacting` (Đang liên hệ) · `resolved` (Đã giải quyết) |
| `POST`   | `/api/v1/media`                            | Upload ảnh/video (multipart: `file`, `folder?`, `alt?`, `tags?`)                                      |
| `GET`    | `/api/v1/media?type&folder&tag&page&limit` | Danh sách file                                                                                        |
| `GET`    | `/api/v1/media/:id`                        | Chi tiết file                                                                                         |
| `PATCH`  | `/api/v1/media/:id`                        | Sửa `alt`, `tags`                                                                                     |
| `DELETE` | `/api/v1/media/:id`                        | Xoá file (Cloudinary + DB)                                                                            |

Body `POST /bookings` (khớp form ở frontend):

```json
{
  "name": "Nguyễn Văn A",
  "phone": "0971 542 026",
  "service": "san-xuat-video",
  "date": "2026-11-01",
  "budget": "20 – 50 triệu",
  "note": "TVC 30s ra mắt sản phẩm"
}
```

## Xác thực quản trị

Tài khoản quản trị duy nhất cấu hình trong `be/.env`:

```env
ADMIN_ID=...           # ID đăng nhập
ADMIN_PASSWORD=...     # ≥ 12 ký tự
ADMIN_NAME=Quản trị viên
```

- So khớp bằng `timingSafeEqual` (không đoán dần được qua thời gian phản hồi).
- Đổi `ADMIN_ID` / `ADMIN_PASSWORD` rồi restart → mọi thiết bị đang đăng nhập bị đăng xuất
  (token & phiên mang "dấu vân tay" HMAC của thông tin đăng nhập).
- Giữ `be/.env` kỹ: không commit (đã .gitignore), không gửi qua chat / email, phân quyền file trên server.

```bash
npm run secret        # chạy 2 lần → dán vào JWT_ACCESS_SECRET và JWT_REFRESH_SECRET
```
