import { env } from "#config/env.js";

/**
 * Logger tối giản theo cấp độ (error < warn < info < debug), in dạng JSON ở production
 * để dễ đưa vào hệ thống thu log; dạng dễ đọc khi phát triển. Có thể thay bằng pino/winston sau.
 */
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const current = LEVELS[env.LOG_LEVEL];

function write(level, message, meta) {
  if (env.isTest || LEVELS[level] > current) return;
  const out = level === "error" ? console.error : console.log;
  if (env.isProd) {
    out(JSON.stringify({ time: new Date().toISOString(), level, message, ...meta }));
  } else {
    out(`[${new Date().toLocaleTimeString()}] ${level.toUpperCase()} ${message}`, meta ?? "");
  }
}

export const logger = {
  error: (msg, meta) => write("error", msg, meta),
  warn: (msg, meta) => write("warn", msg, meta),
  info: (msg, meta) => write("info", msg, meta),
  debug: (msg, meta) => write("debug", msg, meta),
};
