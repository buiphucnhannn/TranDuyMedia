import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Button, Container } from "@/components/ui";
import { pad } from "@/lib/utils";

// Mỗi khung = một định dạng video; ảnh trích từ showreel 2026, ghi chú như storyboard đạo diễn
const PANELS = [
  {
    name: "TVC / iTVC",
    desc: "Quảng cáo 15–60s cho TV và các nền tảng online.",
    shot: "Close-up - 85mm",
    dur: "15–60s",
    src: "/images/about/reel-food.webp",
    pos: "center 40%",
  },
  {
    name: "Video ngắn 9:16",
    desc: "TikTok, Reels, Shorts — nhịp nhanh, bám xu hướng.",
    shot: "Vertical - 9:16",
    dur: "15–45s",
    src: "/images/about/reel-short.webp",
    pos: "center",
  },
  {
    name: "Documentary",
    desc: "Câu chuyện thương hiệu, chân dung nhà sáng lập.",
    shot: "Medium - 50mm",
    dur: "3–10 phút",
    src: "/images/about/reel-speaker.webp",
    pos: "center 30%",
  },
  {
    name: "Phim doanh nghiệp",
    desc: "Profile, năng lực, nhà xưởng — phục vụ đấu thầu.",
    shot: "Wide - 24mm",
    dur: "2–5 phút",
    src: "/images/about/reel-warehouse.webp",
    pos: "center",
  },
  {
    name: "Talkshow & phỏng vấn",
    desc: "Setup đa máy, âm thanh, ánh sáng chuẩn studio.",
    shot: "Two-shot - 3 cam",
    dur: "10–60 phút",
    src: "/images/about/reel-talkshow.webp",
    pos: "center 40%",
  },
  {
    name: "Video sự kiện",
    desc: "Hội nghị, ra mắt — highlight bàn giao trong ngày.",
    shot: "Multi-cam - Live",
    dur: "1–3 phút",
    src: "/images/about/reel-event.webp",
    pos: "center",
  },
];

/**
 * Trang chủ — dịch vụ trọng tâm "Sản xuất video thương mại" trình bày như một tờ STORYBOARD:
 * 6 khung phân cảnh (định dạng video), mỗi khung có số cảnh, cỡ cảnh/ống kính, thời lượng và ghi chú.
 * Rê chuột: ảnh trắng-đen → màu, hiện lưới 1/3 khung ngắm, khung nhấc nhẹ. Bấm khung → trang dịch vụ.
 */
export function VideoFocus() {
  return (
    <section
      id="san-xuat-video"
      className="grain relative overflow-hidden bg-navy-950 section-y text-white"
      data-nav-theme="dark"
    >
      <Container>
        <p className="reveal mb-4 eyebrow">Dịch vụ trọng tâm - Sản xuất video thương mại</p>
        {/* Tiêu đề trái + mô tả & nút phải (canh giữa theo chiều cao tiêu đề) */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <h2 className="reveal max-w-2xl h-section" style={{ "--reveal-delay": "80ms" }}>
            Mỗi thước phim bắt đầu từ một <span className="text-orange-500">storyboard.</span>
          </h2>
          <div className="reveal max-w-md" style={{ "--reveal-delay": "160ms" }}>
            <p className="text-base leading-relaxed text-white/65">
              Kịch bản, phân cảnh duyệt cùng bạn trước khi bấm máy — đúng mục tiêu, đúng kênh phát.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href="/dich-vu/san-xuat-video" variant="white" pill>
                Xem dịch vụ
              </Button>
              <button
                type="button"
                data-showreel
                className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-5 py-3 text-sm font-medium transition hover:border-white hover:bg-white hover:text-navy-900"
              >
                <Icon name="play" className="size-3.5" strokeWidth={0} fill="currentColor" />
                Showreel
              </button>
            </div>
          </div>
        </div>

        {/* Tờ storyboard */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 lg:p-8">
          {/* Đầu tờ: thông tin dự án kiểu bảng phân cảnh */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-dashed border-white/15 pb-5 font-mono text-[11px] tracking-widest text-white/45 uppercase">
            <span>
              Project: <span className="text-white/80">Tran Duy Media</span>
            </span>
            <span className="hidden sm:inline">Formats: 06</span>
            <span>
              Sheet <span className="text-orange-500">01</span> / 01
            </span>
          </div>

          <ol className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
            {PANELS.map((p, i) => (
              <li key={p.name} className="reveal" style={{ "--reveal-delay": `${(i % 3) * 90}ms` }}>
                <Link href="/dich-vu/san-xuat-video" className="group block">
                  {/* Khung phân cảnh */}
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-navy-900 ring-1 ring-white/15 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_-24px_rgba(248,104,8,0.55)] group-hover:ring-orange-500/70">
                    <Image
                      src={p.src}
                      alt={p.name}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      style={{ objectPosition: p.pos }}
                    />
                    {/* Lưới 1/3 của khung ngắm */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    >
                      <span className="absolute inset-y-0 left-1/3 w-px bg-white/20" />
                      <span className="absolute inset-y-0 left-2/3 w-px bg-white/20" />
                      <span className="absolute inset-x-0 top-1/3 h-px bg-white/20" />
                      <span className="absolute inset-x-0 top-2/3 h-px bg-white/20" />
                    </div>
                    <span className="absolute top-2 left-2 rounded bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-navy-950 sm:top-3 sm:left-3 sm:px-2 sm:text-[10px]">
                      SC {pad(i + 1)}
                    </span>
                    <span className="absolute top-2 right-2 rounded bg-navy-950/75 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-white/85 uppercase backdrop-blur-sm sm:top-3 sm:right-3 sm:px-2 sm:text-[10px]">
                      {p.dur}
                    </span>
                  </div>

                  {/* Ghi chú dưới khung */}
                  <div className="mt-3 flex items-start justify-between gap-4 sm:mt-4">
                    <div>
                      <h3 className="text-[15px] leading-snug font-bold tracking-tight transition-colors group-hover:text-orange-500 sm:text-lg">
                        {p.name}
                      </h3>
                      <p className="mt-1 hidden text-left text-sm leading-relaxed text-white/55 sm:block">
                        {p.desc}
                      </p>
                    </div>
                    <Icon
                      name="arrowRight"
                      className="mt-1 hidden size-4 shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange-500 sm:block"
                    />
                  </div>
                  <p className="mt-2 border-t border-dashed border-white/12 pt-2 font-mono text-[9px] tracking-widest text-white/40 uppercase sm:mt-3 sm:pt-2.5 sm:text-[10px]">
                    Shot: <span className="text-white/70">{p.shot}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
