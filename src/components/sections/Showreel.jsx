"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { pickShowreelSrc } from "@/lib/showreel";
import { cn } from "@/lib/utils";

/**
 * Showreel 2026 — video tự host, khung rộng kiểu điện ảnh (2:1 desktop, 16:9 mobile).
 * - Cuộn tới (≥ 35% khung hiện ra) → tự phát; cuộn qua → tự dừng (không tốn CPU/pin khi không xem).
 * - Trình duyệt chỉ cho tự phát khi TẮT TIẾNG → có nút bật tiếng.
 * - 1080p cho máy tính, 720p cho điện thoại (pickShowreelSrc). Chỉ tải khi sắp cuộn tới (preload="none").
 * - Bấm vào khung → popup xem toàn màn hình có tiếng, tiếp tục từ giây đang phát (VideoModal).
 * - Luôn tự phát (kể cả khi hệ điều hành tắt hiệu ứng hoạt ảnh — Windows tắt sẵn khá phổ biến),
 *   kèm nút tạm dừng theo WCAG 2.2.2. Người dùng đã bấm dừng thì cuộn qua lại không tự phát nữa.
 */
export function Showreel() {
  const { showreel } = siteConfig;
  const videoRef = useRef(null);
  const userPausedRef = useRef(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Chọn nguồn sau khi mount (server không biết kích thước màn hình) và tự phát/dừng theo vị trí cuộn
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Gắn nguồn trực tiếp (không qua state) → luôn có nguồn TRƯỚC khi play(); nếu gắn sau, trình duyệt
    // huỷ lệnh play đang chờ và video đứng im (xảy ra khi tải lại trang ngay tại section này).
    const ensureSrc = () => {
      if (!video.getAttribute("src")) video.setAttribute("src", pickShowreelSrc());
    };

    // Gắn nguồn khi khung còn cách màn hình ~1 màn hình → kịp tải trước, không tải nếu khách không cuộn tới
    const loader = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        ensureSrc();
        loader.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    loader.observe(video);

    const player = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.35) {
          if (userPausedRef.current) return;
          ensureSrc();
          // play() bị chặn (vd. iPhone đang tiết kiệm pin) → giữ poster + nút play
          video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: [0, 0.35] },
    );
    player.observe(video);

    return () => {
      loader.disconnect();
      player.disconnect();
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
    }
  };

  return (
    <section id="showreel" className="relative bg-paper section-y" data-nav-theme="light">
      <Container>
        <p className="reveal mb-4 eyebrow">Showreel</p>
        {/* Mô tả canh giữa theo chiều cao tiêu đề (eyebrow nằm ngoài hàng để không lệch tâm) */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="reveal h-section" style={{ "--reveal-delay": "80ms" }}>
            Một phút để thấy cách chúng tôi làm việc.
          </h2>
          <p
            className="reveal max-w-sm text-sm leading-relaxed text-ink-soft sm:text-base"
            style={{ "--reveal-delay": "160ms" }}
          >
            Tổng hợp các dự án TVC, phim doanh nghiệp và nội dung quảng cáo trong năm 2025 – 2026.
          </p>
        </div>

        <div
          className="reveal group relative aspect-video overflow-hidden rounded-2xl bg-navy-950 shadow-soft sm:rounded-3xl lg:aspect-2/1"
          data-reveal="clip"
        >
          <video
            ref={videoRef}
            data-showreel-inline
            poster={showreel.poster}
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="absolute inset-0 size-full object-cover"
          />

          {/* Lớp bấm: mở popup xem toàn màn hình có tiếng */}
          <button
            type="button"
            data-showreel
            aria-label={`Xem ${showreel.title} toàn màn hình`}
            className="absolute inset-0 block size-full text-left"
          >
            <span
              className={cn(
                "absolute inset-0 bg-linear-to-t from-navy-950/75 via-transparent to-transparent transition-opacity duration-700",
                playing && "opacity-70",
              )}
            />
            {/* Nút play lớn: chỉ hiện khi video chưa chạy (chưa cuộn tới / bị chặn tự phát) */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                playing ? "opacity-0" : "opacity-100",
              )}
            >
              <span className="relative flex size-20 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-orange-500 sm:size-24">
                <span className="absolute inset-0 [animation:ripple_2.6s_ease-out_infinite] rounded-full bg-white/30" />
                <Icon
                  name="play"
                  className="relative ml-1 size-8"
                  strokeWidth={0}
                  fill="currentColor"
                />
              </span>
            </span>
            <span className="absolute bottom-0 left-0 p-6 text-white sm:p-8">
              <span className="block text-[11px] tracking-eyebrow text-white/70 uppercase">
                {showreel.duration}
              </span>
              <span className="mt-1 block text-2xl font-semibold tracking-tight sm:text-3xl">
                {showreel.title}
              </span>
            </span>
          </button>

          {/* Điều khiển góc phải dưới (nằm trên lớp bấm, không mở popup) */}
          <div className="absolute right-4 bottom-4 z-10 flex items-center gap-2 sm:right-6 sm:bottom-6">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Tạm dừng" : "Phát"}
              className="flex size-10 items-center justify-center rounded-full bg-navy-950/60 text-white transition hover:bg-white hover:text-navy-900"
            >
              <Icon
                name={playing ? "pause" : "play"}
                className="size-4"
                strokeWidth={0}
                fill="currentColor"
              />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
              aria-pressed={!muted}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-navy-950/60 px-4 text-xs font-medium text-white transition hover:bg-white hover:text-navy-900"
            >
              <Icon name={muted ? "volumeOff" : "volumeOn"} className="size-4" />
              <span className="hidden sm:inline">{muted ? "Bật tiếng" : "Tắt tiếng"}</span>
            </button>
            <button
              type="button"
              data-showreel
              aria-label="Xem toàn màn hình"
              className="flex size-10 items-center justify-center rounded-full bg-navy-950/60 text-white transition hover:bg-white hover:text-navy-900"
            >
              <Icon name="expand" className="size-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
