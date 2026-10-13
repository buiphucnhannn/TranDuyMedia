import Image from "next/image";
import { Container, Marquee } from "@/components/ui";
import { industries, industryWork, values } from "@/data/services";

const CORNERS = [
  "top-3 left-3 border-t-2 border-l-2",
  "top-3 right-3 border-t-2 border-r-2",
  "bottom-3 left-3 border-b-2 border-l-2",
  "bottom-3 right-3 border-b-2 border-r-2",
];

/**
 * USP "Uy tín – Trách nhiệm – Tâm huyết" dạng một DẢI PHIM: hàng lỗ răng cưa trên/dưới,
 * 3 khung hình là ảnh hậu trường thật, nhãn kiểu bảng clapper (SCENE · TAKE).
 * Rê chuột: ảnh trắng-đen → màu, 4 góc khung ngắm cam hiện ra, ● REC nhấp nháy (đồng bộ màn chào).
 * Bên dưới: dải ngành hàng đã đồng hành.
 */
export function Values() {
  return (
    <section
      className="grain relative overflow-hidden bg-navy-950 text-white"
      data-nav-theme="dark"
    >
      <Container className="relative py-16 sm:py-20">
        <p className="reveal mb-4 eyebrow">Vì sao chọn chúng tôi</p>
        {/* Mô tả canh giữa theo chiều cao tiêu đề */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="reveal h-section" style={{ "--reveal-delay": "80ms" }}>
            Uy tín. Trách nhiệm. <span className="text-orange-500">Tâm huyết.</span>
          </h2>
          <p
            className="reveal max-w-sm text-base leading-relaxed text-white/65"
            style={{ "--reveal-delay": "160ms" }}
          >
            Ba giá trị chúng tôi giữ trong mọi khung hình — từ buổi brief đầu tiên đến file bàn giao
            cuối cùng.
          </p>
        </div>

        {/* Dải phim */}
        <div
          className="reveal mt-10 rounded-2xl bg-black/55 px-3 ring-1 ring-white/10 sm:px-4"
          data-reveal="clip"
        >
          <div aria-hidden="true" className="h-6 sprockets" />
          <ul className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {values.map((v, i) => (
              <li
                key={v.title}
                className="group relative aspect-4/3 overflow-hidden rounded-md bg-navy-900 md:aspect-16/10"
              >
                <Image
                  src={v.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover grayscale transition-[transform,filter] duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                  style={{ objectPosition: v.imagePos }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/60 to-navy-950/20" />

                {/* Góc khung ngắm — hiện khi rê chuột */}
                {CORNERS.map((c) => (
                  <span
                    key={c}
                    aria-hidden="true"
                    className={`absolute size-5 border-orange-500 opacity-0 transition-all duration-500 group-hover:opacity-100 ${c}`}
                  />
                ))}

                {/* Nhãn clapper */}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-[10px] font-semibold tracking-[0.25em] uppercase">
                  <span className="rounded-sm bg-white px-2 py-1 text-navy-950">
                    Scene 0{i + 1}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/70">
                    <span className="size-1.5 rounded-full bg-white/40 group-hover:animate-[introBlink_1s_steps(2,start)_infinite] group-hover:bg-red-500" />
                    Take 1
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-[1.7rem]">
                    <span className="h-0.5 w-6 bg-orange-500 transition-all duration-500 group-hover:w-10" />
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{v.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="h-6 sprockets" />
        </div>
      </Container>

      {/* Đã đồng hành: tiêu đề + 2 tầng chạy ngược chiều — tên ngành chữ lớn
          và các loại sản phẩm đã làm. Rê chuột vào tầng nào thì tầng đó dừng; chữ đổi sang cam. */}
      <div className="relative border-t border-white/10 py-12 sm:py-14">
        <Container className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl h-display text-white">10+</span>
            <p className="text-[11px] leading-relaxed tracking-eyebrow text-white/60 uppercase">
              Ngành hàng
              <br />
              đã đồng hành
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55">
            Từ quán ăn đến ngân hàng — mỗi ngành một cách kể chuyện, một ekip quen tay.
          </p>
        </Container>

        <div className="[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <Marquee
            items={industries}
            duration="60s"
            itemClassName="cursor-default py-1 text-4xl font-bold tracking-tight text-white/85 transition-colors duration-300 hover:text-orange-500 sm:text-6xl"
          />
          <div className="marquee mt-5 overflow-hidden" aria-hidden="true">
            <div className="bleed-cap overflow-hidden">
              <div className="marquee-track reverse gap-3" style={{ "--marquee-duration": "70s" }}>
                {[...industryWork, ...industryWork, ...industryWork, ...industryWork].map(
                  (w, i) => (
                    <span
                      key={i}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm whitespace-nowrap text-white/75"
                    >
                      <span className="size-1.5 rounded-full bg-orange-500" />
                      {w}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
