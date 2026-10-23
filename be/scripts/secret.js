import { randomBytes } from "node:crypto";

/**
 * Tạo sẵn 2 chuỗi bí mật JWT (mỗi chuỗi 64 ký tự, ngẫu nhiên, khác nhau) để dán vào .env / Render.
 * Chạy: npm run secret
 */
const secret = () => randomBytes(48).toString("base64url");

console.log("\nChép nguyên mỗi dòng dưới đây vào .env (hoặc Environment Variables trên Render):\n");
console.log(`JWT_ACCESS_SECRET=${secret()}`);
console.log(`JWT_REFRESH_SECRET=${secret()}\n`);
