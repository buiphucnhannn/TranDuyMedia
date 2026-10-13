/**
 * Nén showreel gốc (4K, rất nặng) thành bản web + ảnh bìa.
 * Chạy khi có showreel mới:  npm run video [đường-dẫn-file-gốc] [giây-lấy-ảnh-bìa]
 *
 * Đầu vào mặc định: public/videos/SHOWREEL_TRANDUYMEDIA2026.mp4 (thư mục này không commit — quá nặng)
 * Đầu ra:           public/media/showreel-1080.mp4  (máy tính, H.264 1080p 25fps, ~5 Mbps)
 *                   public/media/showreel-720.mp4   (điện thoại, H.264 720p 25fps, ~2.5 Mbps)
 *                   public/media/showreel-poster.jpg
 * Cần ffmpeg: cài vào PATH (https://ffmpeg.org) hoặc `npm i -D ffmpeg-static`.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const input = path.resolve(root, process.argv[2] || "public/videos/SHOWREEL_TRANDUYMEDIA2026.mp4");
const posterAt = process.argv[3] || "0.5"; // khung "Hello!" ở đầu video
const out = path.join(root, "public", "media");
mkdirSync(out, { recursive: true });

let ffmpeg = "ffmpeg";
try {
  ffmpeg = (await import("ffmpeg-static")).default;
} catch {
  /* dùng ffmpeg trong PATH */
}

const run = (args, label) => {
  console.log(`→ ${label}`);
  const r = spawnSync(ffmpeg, ["-v", "error", "-stats", "-y", ...args], { stdio: "inherit" });
  if (r.error) throw new Error(`Không chạy được ffmpeg (${r.error.message}). Cài ffmpeg trước.`);
  if (r.status !== 0) throw new Error(`ffmpeg lỗi khi ${label}`);
};

// faststart: đưa thông tin video lên đầu file → trình duyệt phát ngay khi mới tải một phần
const common = [
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  "-ac",
  "2",
  "-c:a",
  "aac",
];

run(
  [
    "-ss",
    posterAt,
    "-i",
    input,
    "-frames:v",
    "1",
    "-vf",
    "scale=1920:-2:flags=lanczos",
    "-q:v",
    "3",
    path.join(out, "showreel-poster.jpg"),
  ],
  "ảnh bìa",
);
run(
  [
    "-i",
    input,
    "-vf",
    "scale=1920:-2:flags=lanczos,fps=25",
    ...common,
    "-crf",
    "22",
    "-maxrate",
    "6M",
    "-bufsize",
    "12M",
    "-profile:v",
    "high",
    "-level",
    "4.1",
    "-b:a",
    "128k",
    path.join(out, "showreel-1080.mp4"),
  ],
  "bản 1080p",
);
run(
  [
    "-i",
    input,
    "-vf",
    "scale=1280:-2:flags=lanczos,fps=25",
    ...common,
    "-crf",
    "23",
    "-maxrate",
    "3M",
    "-bufsize",
    "6M",
    "-profile:v",
    "high",
    "-level",
    "4.0",
    "-b:a",
    "96k",
    path.join(out, "showreel-720.mp4"),
  ],
  "bản 720p",
);

for (const f of ["showreel-1080.mp4", "showreel-720.mp4", "showreel-poster.jpg"]) {
  const mb = statSync(path.join(out, f)).size / 1024 / 1024;
  console.log(`✓ public/media/${f}  ${mb.toFixed(1)} MB`);
}
