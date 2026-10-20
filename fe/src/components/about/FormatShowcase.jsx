"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomGroup, ZoomImage } from "@/components/gallery";
import { SectionHeading } from "@/components/ui";
import { cn, pad } from "@/lib/utils";

/**
 * 6 định dạng đã sản xuất — desktop: cột trái ĐỨNG YÊN (sticky) gồm tiêu đề + mục lục,
 * cột phải lướt qua từng khung hình dự án. Mục đang nằm giữa màn hình được tô cam trong mục lục;
 * bấm mục lục để cuộn tới khung tương ứng. Mobile: xếp dọc bình thường, ẩn mục lục.
 */
export function FormatShowcase({ formats }) {
  const [active, setActive] = useState(0);
  const cards = useRef([]);

  useEffect(() => {
    // Vạch giữa màn hình: khung nào cắt qua vạch đó là khung đang xem
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.index)));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    cards.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => {
    const el = cards.current[i];
    if (!el) return;
    const y =
      el.getBoundingClientRect().top + window.scrollY - (window.innerHeight - el.offsetHeight) / 2;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      {/* Cột trái cao đúng 1 màn hình (trừ header nổi 84px), nội dung căn giữa theo chiều dọc */}
      <div className="lg:sticky lg:top-[max(0px,calc((100svh-var(--screen))/2))] lg:flex lg:h-(--screen) lg:flex-col lg:justify-center lg:self-start lg:pt-[84px]">
        <SectionHeading
          light
          eyebrow="Năng lực sản xuất"
          title="Mọi định dạng video doanh nghiệp cần — một ekip làm trọn."
        />
        <p
          className="reveal mt-5 max-w-md text-base leading-relaxed text-white/65 lg:[@media(max-height:720px)]:hidden"
          style={{ "--reveal-delay": "160ms" }}
        >
          Khung hình trích từ các dự án thật trong showreel 2026 — bấm vào ảnh để xem lớn.
        </p>

        <ol className="mt-8 hidden border-l border-white/10 lg:block">
          {formats.map((f, i) => (
            <li key={f.name}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={active === i ? "step" : undefined}
                className={cn(
                  "-ml-px flex w-full items-center gap-4 border-l-2 py-2 pl-5 text-left transition-colors duration-500",
                  active === i
                    ? "border-orange-500 text-white"
                    : "border-transparent text-white/40 hover:text-white/75",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-semibold tracking-widest transition-colors duration-500",
                    active === i && "text-orange-500",
                  )}
                >
                  {pad(i + 1)}
                </span>
                <span className="text-base font-semibold tracking-tight xl:text-lg">{f.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <ZoomGroup images={formats.map((f) => ({ src: f.src, alt: `${f.name} — ${f.desc}` }))}>
        <ul className="grid gap-12 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-1 lg:gap-20">
          {formats.map((f, i) => (
            <li
              key={f.name}
              ref={(el) => (cards.current[i] = el)}
              data-index={i}
              className="reveal"
            >
              <ZoomImage
                index={i}
                src={f.src}
                alt={f.name}
                pos={f.pos}
                sizes="(min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw"
                quality={90}
                className="aspect-16/10 w-full rounded-2xl bg-navy-800 ring-1 ring-white/10"
              />
              {/* Ảnh luôn rõ nét; chỉ chú thích của khung chưa xem mờ đi */}
              <div
                className={cn(
                  "mt-5 flex gap-4 transition-opacity duration-700",
                  active !== i && "lg:opacity-45",
                )}
              >
                <span className="pt-1 text-xs font-semibold tracking-widest text-orange-500">
                  {pad(i + 1)}
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight lg:text-2xl">{f.name}</h3>
                  <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-white/60 lg:text-base">
                    {f.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ZoomGroup>
    </div>
  );
}
