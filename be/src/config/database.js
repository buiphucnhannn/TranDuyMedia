import mongoose from "mongoose";
import { env } from "#config/env.js";
import { logger } from "#config/logger.js";

/**
 * Kết nối MongoDB bằng Mongoose — gọi một lần trong server.js trước khi mở cổng.
 * Thử lại vài lần khi lỗi mạng lúc khởi động (DB Atlas / container khởi động chậm).
 */
mongoose.set("strictQuery", true);

mongoose.connection.on("disconnected", () => logger.warn("MongoDB mất kết nối"));
mongoose.connection.on("reconnected", () => logger.info("MongoDB đã kết nối lại"));
mongoose.connection.on("error", (err) => logger.error("MongoDB lỗi", { message: err.message }));

export async function connectDatabase(uri = env.MONGODB_URI, { retries = 5, delayMs = 2000 } = {}) {
  if (!uri) {
    throw new Error("Chưa cấu hình MONGODB_URI trong be/.env");
  }
  for (let attempt = 1; ; attempt++) {
    try {
      await mongoose.connect(uri, {
        dbName: env.MONGODB_DB_NAME,
        serverSelectionTimeoutMS: 10_000,
        autoIndex: !env.isProd, // production: tạo index bằng migration, không tự động
      });
      logger.info(`Đã kết nối MongoDB (db: ${mongoose.connection.name})`);
      return mongoose.connection;
    } catch (err) {
      if (attempt >= retries) throw err;
      logger.warn(`Kết nối MongoDB thất bại (lần ${attempt}/${retries}), thử lại...`, {
        message: err.message,
      });
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export const disconnectDatabase = () => mongoose.disconnect();

/** Trạng thái cho /health: disconnected | connected | connecting | disconnecting */
export const databaseState = () =>
  ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] ??
  "unknown";
