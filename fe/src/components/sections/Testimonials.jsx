"use client";

import { useEffect, useRef, useState } from "react";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui";
import { testimonials } from "@/data/testimonials";
import { cn, pad } from "@/lib/utils";

const items = testimonials;

// Ảnh nền mặc định theo dịch vụ (khi lời nhận xét không kèm ảnh dự án) — chỉ thiết bị / bối cảnh,
// KHÔNG có người thật (tránh gây hiểu nhầm người trong ảnh là người nhận xét)
const SERVICE_IMAGE = {
  "Sản xuất video marketing": "/images/about-hd/product-shoot.webp",
  "Chụp ảnh thương mại": "/images/bts/bts-07.webp",
  "Chụp ảnh sự kiện": "/images/about-hd/event-hall.webp",
  "Cho thuê studio": "/images/vintage-green/vintage-green-03.webp",
};
const imageOf = (t) =>
  t.image || SERVICE_IMAGE[t.service] || "/images/about-hd/lighting-setup.webp";

const DURATION = 8000; // mỗi "cảnh" chiếu 8 giây

const CORNERS = [
  "top-0 left-0 border-t-2 border-l-2",
  "top-0 right-0 border-t-2 border-r-2",
  "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-0 right-0 border-b-2 border-r-2",
];

/**
 * Cảm nhận khách hàng dạng MÀN CHIẾU ĐIỆN ẢNH: mỗi lời nhận xét là một "cảnh" chiếu trong khung
 * letterbox (2 dải đen trên/dưới) — ảnh dự án phủ tối + ken burns chậm, HUD máy quay (● REC, số cảnh,
 * timecode), 4 góc khung ngắm; lời nhận xét lớn ở giữa như phụ đề phim. Thanh tiến trình cam chạy hết
 * 8 giây → sang cảnh kế; dải đen dưới có vạch đánh dấu từng cảnh (bấm để chuyển). Điện thoại: vuốt ngang.
 * Luôn tự chạy — chỉ dừng khi người dùng bấm nút Dừng (WCAG 2.2.2); cuộn ra khỏi màn hình thì tạm nghỉ,
 * cuộn lại thì chạy tiếp.
 * Không có lời nhận xét nào → ẩn cả khối.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [inView, setInView] = useState(false);
  const frame = useRef(null);
  const touchX = useRef(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!items.length) return null;

  const n = items.length;
  const go = (i) => setActive(((i % n) + n) % n);
  const running = n > 1 && inView && !stopped;
  const t = items[active];

  return (
    <section
      className="grain relative overflow-hidden bg-navy-950 text-white"
      data-nav-theme="dark"
      aria-labelledby="testimonials-title"
    >
      <Container className="relative py-16 sm:py-20">
        <p className="reveal mb-4 eyebrow">Cảm nhận khách hàng</p>
        <div className="flex items-end justify-between gap-6">
          <h2
            id="testimonials-title"
            className="reveal h-section text-balance"
            style={{ "--reveal-delay": "80ms" }}
          >
            Khách hàng nói gì về <span className="text-orange-500">Trần Duy Media.</span>
          </h2>
          {n > 1 && (
            <div
              className="reveal hidden shrink-0 items-center gap-5 sm:flex"
              style={{ "--reveal-delay": "160ms" }}
            >
              <p className="font-semibold tracking-widest tabular-nums" aria-hidden="true">
                <span className="text-2xl text-white">{pad(active + 1)}</span>
                <span className="text-sm text-white/35"> / {pad(n)}</span>
              </p>
            </div>
          )}
        </div>

        {/* ── Màn chiếu ── */}
        <div
          ref={frame}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
            if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Cảm nhận khách hàng"
          className="reveal relative mt-8 overflow-hidden rounded-3xl bg-black ring-1 ring-white/10"
          data-reveal="clip"
        >
          {/* Ảnh nền từng cảnh: chuyển mờ dần, cảnh đang chiếu phóng chậm (ken burns) */}
          {items.map((it, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 transition-opacity duration-[1400ms] ease-out",
                i === active ? "opacity-100" : "opacity-0",
              )}
            >
              <div
                key={i === active ? `on-${active}` : "off"}
                className={cn("absolute inset-0", i === active && "animate-kenburns")}
              >
                <Image
                  src={imageOf(it)}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className="object-cover saturate-[0.7]"
                />
              </div>
            </div>
          ))}
          <div aria-hidden="true" className="absolute inset-0 bg-navy-950/72" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgb(5_8_15/0.85)_100%)]"
          />

          {/* Letterbox trên: HUD máy quay */}
          <div className="absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-between bg-black px-5 text-[10px] font-semibold tracking-[0.2em] text-white/60 uppercase sm:h-12 sm:px-8 sm:text-[11px]">
            <span className="flex items-center gap-2.5">
              <span
                className={cn(
                  "size-2 rounded-full bg-red-500",
                  running && "animate-[introBlink_1s_steps(2,start)_infinite]",
                )}
              />
              {running ? "Rec" : "Pause"}
              <span className="text-white/30">-</span>
              Scene {pad(active + 1)}
            </span>
            <span className="hidden sm:inline">4K - 24 fps - Trần Duy Media</span>
            <span className="tabular-nums">TC 00:0{active + 1}:24:12</span>
          </div>

          {/* Nội dung cảnh: lời nhận xét như phụ đề lớn giữa khung. Các cảnh chồng cùng 1 ô lưới (cao bằng cảnh dài
              nhất) → dấu ngoặc kép cố định trên, người nhận xét cố định dưới, lời nhận xét canh giữa khoảng còn lại */}
          <div className="relative flex min-h-[500px] items-center justify-center px-6 py-16 sm:min-h-[460px] sm:px-16 lg:px-24 xl:aspect-[2.5/1] xl:min-h-0">
            {/* 2 nút chuyển cảnh: 2 bên khung, canh giữa chiều cao (máy tính; màn nhỏ dùng vạch cảnh / vuốt) */}
            {n > 1 &&
              [
                { d: -1, icon: "chevronLeft", label: "Nhận xét trước", side: "left-10" },
                { d: 1, icon: "chevronRight", label: "Nhận xét tiếp theo", side: "right-10" },
              ].map((b) => (
                <button
                  key={b.d}
                  type="button"
                  onClick={() => go(active + b.d)}
                  aria-label={b.label}
                  className={cn(
                    "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/30 ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-orange-500 hover:ring-orange-500 lg:flex",
                    b.side,
                  )}
                >
                  <Icon name={b.icon} className="size-5" />
                </button>
              ))}
            {/* 4 góc khung ngắm */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 inset-y-14 sm:inset-x-8 sm:inset-y-[4.25rem]"
            >
              {CORNERS.map((c) => (
                <span key={c} className={cn("absolute size-6 border-white/35", c)} />
              ))}
            </div>

            <div className="grid w-full max-w-4xl">
              {items.map((it, i) => (
                <figure
                  key={i}
                  aria-hidden={i !== active}
                  className={cn(
                    "flex flex-col items-center text-center transition-[opacity,filter,translate] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] [grid-area:1/1]",
                    i === active
                      ? "blur-0 translate-y-0 opacity-100 delay-200"
                      : "pointer-events-none translate-y-4 opacity-0 blur-sm",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="h-10 font-serif text-7xl leading-[0.9] text-orange-500 sm:h-12 sm:text-[5.5rem]"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-3 flex flex-1 items-center justify-center">
                    <p className="text-center text-[1.3rem] leading-snug font-semibold tracking-tight text-balance sm:text-[1.6rem] lg:text-[1.9rem]">
                      {it.quote}
                    </p>
                  </blockquote>
                  <figcaption className="mt-6 flex min-h-[4.25rem] items-center gap-4 text-left sm:min-h-0">
                    {it.logo ? (
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white">
                        <Image
                          src={it.logo}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain p-2"
                        />
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-base font-bold"
                      >
                        {initials(it.name)}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block font-bold">{it.name}</span>
                      <span className="mt-0.5 block text-sm text-white/60">{it.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Letterbox dưới: thanh tiến trình + dịch vụ + nút tạm dừng */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex h-10 items-center justify-between gap-4 bg-black px-5 text-[10px] font-semibold tracking-[0.2em] text-white/60 uppercase sm:h-12 sm:px-8 sm:text-[11px]">
            {n > 1 && (
              <span className="absolute inset-x-0 top-0 h-0.5 bg-white/10">
                <span
                  key={active}
                  onAnimationEnd={() => go(active + 1)}
                  className="block h-full origin-left bg-orange-500"
                  style={{
                    animation: `heroProgress ${DURATION}ms linear both`,
                    animationPlayState: running ? "running" : "paused",
                  }}
                />
              </span>
            )}
            <span className="hidden min-w-0 flex-1 truncate sm:block">
              <span className="text-orange-400">Dịch vụ</span> - {t.service}
            </span>
            {n > 1 && (
              <span className="flex items-center gap-1.5">
                {items.map((it, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Cảnh ${i + 1}: ${it.service}`}
                    aria-current={i === active ? "true" : undefined}
                    className="flex h-6 cursor-pointer items-center"
                  >
                    <span
                      className={cn(
                        "block h-1 rounded-full transition-all duration-500",
                        i === active ? "w-8 bg-orange-500" : "w-4 bg-white/25 hover:bg-white/60",
                      )}
                    />
                  </button>
                ))}
              </span>
            )}
            <span className="hidden flex-1 sm:block" aria-hidden="true" />
            {n > 1 && (
              <button
                type="button"
                onClick={() => setStopped((s) => !s)}
                aria-label={stopped ? "Tiếp tục tự chuyển" : "Tạm dừng tự chuyển"}
                className="flex shrink-0 cursor-pointer items-center gap-2 transition-colors hover:text-white"
              >
                <Icon name={stopped ? "play" : "pause"} className="size-3.5" />
                {stopped ? "Phát" : "Dừng"}
              </button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** "Nguyễn Văn An" → "NA" (chữ đầu của họ + tên) */
function initials(name = "") {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return "";
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
}
