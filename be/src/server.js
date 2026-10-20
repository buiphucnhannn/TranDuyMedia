import { createApp } from "#app";
import { connectDatabase, disconnectDatabase } from "#config/database.js";
import { env } from "#config/env.js";
import { logger } from "#config/logger.js";

/**
 * Điểm khởi động: kết nối MongoDB → mở cổng HTTP.
 * Tắt êm (graceful shutdown) khi nhận SIGINT/SIGTERM: ngừng nhận request, đóng kết nối DB.
 */
try {
  await connectDatabase();
} catch (err) {
  logger.error(`Không kết nối được MongoDB: ${err.message}`);
  process.exit(1);
}

const { bookingRepository } = await import("#repositories/booking.repository.js");
const migrated = await bookingRepository.migrateLegacyStatuses();
if (migrated) logger.info(`Đã chuyển ${migrated} yêu cầu đặt lịch sang trạng thái mới`);

if (!env.hasCloudinary) logger.warn("Chưa cấu hình Cloudinary — API /media sẽ trả 503");
if (env.ephemeralSecrets.length) {
  logger.warn(
    `Chưa đặt ${env.ephemeralSecrets.join(", ")} — đang dùng secret tạm, phải đăng nhập lại sau mỗi lần khởi động`,
  );
}

const server = createApp().listen(env.PORT, env.HOST, () => {
  logger.info(`API đang chạy tại http://localhost:${env.PORT}/api/v1 (${env.NODE_ENV})`);
});

function shutdown(signal) {
  logger.info(`Nhận ${signal}, đang dừng server...`);
  server.close(async () => {
    await disconnectDatabase().catch(() => {});
    process.exit(0);
  });
  // Quá 10s mà vẫn còn kết nối → buộc dừng
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", { reason: String(reason) });
});
