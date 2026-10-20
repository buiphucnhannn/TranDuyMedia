import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import helmet from "helmet";
import morgan from "morgan";
import { env } from "#config/env.js";
import { errorHandler, notFound } from "#middlewares/error-handler.js";
import { originGuard } from "#middlewares/origin-guard.js";
import { limiter } from "#middlewares/rate-limit.js";
import apiRoutes from "#routes/index.js";

/**
 * Tạo Express app (tách khỏi server.js để test bằng supertest mà không mở cổng).
 * Thứ tự middleware: bảo mật → CORS → nén → log → parse body/cookie → chặn Origin lạ → giới hạn
 * → routes → 404 → lỗi.
 */
export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  // Chỉ tin X-Forwarded-For từ đúng số proxy phía trước (mặc định 1 = Next.js) → lấy đúng IP thật
  // cho rate limit, client không tự gửi header để giả IP.
  app.set("trust proxy", env.TRUST_PROXY);

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || env.CORS_ORIGINS.includes(origin)),
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "X-Requested-With"],
      credentials: true, // cho phép gửi cookie xác thực
    }),
  );
  app.use(compression());
  if (!env.isTest) app.use(morgan(env.isProd ? "combined" : "dev"));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.use(originGuard);
  app.use(
    limiter({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );

  app.use("/api/v1", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
