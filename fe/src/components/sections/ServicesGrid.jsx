import { SmartImage as Image } from "@/components/ui/SmartImage";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui";
import { services } from "@/data/services";

/**
 * 3 dịch vụ chính — thẻ kiểu Squarespace "Grow your business": ảnh, tiêu đề, mô tả, "Phù hợp cho", mũi tên.
 */
export function ServicesGrid() {
  return (
    <section id="dich-vu" className="bg-paper section-y" data-nav-theme="light">
      <Container>
        <p className="reveal mb-4 eyebrow">Dịch vụ</p>
        {/* Link canh giữa theo chiều cao tiêu đề */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="reveal max-w-3xl h-section" style={{ "--reveal-delay": "80ms" }}>
            Mọi thứ bạn cần cho một chiến dịch hình ảnh.
          </h2>
          <Link
            href="/dich-vu"
            className="reveal group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink hover:text-orange-500"
          >
            Chi tiết dịch vụ
            <Icon
              name="arrowRight"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
        <p
          className="reveal mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg"
          style={{ "--reveal-delay": "160ms" }}
        >
          Hệ sinh thái dịch vụ đặc trưng tại{" "}
          <span className="whitespace-nowrap">Trần Duy Media.</span>
        </p>

        {/* Từ md: 4 thẻ xếp 2×2, mỗi hàng 2 thẻ dùng chung 6 hàng (subgrid) — ảnh · tiêu đề · dòng cam ·
            mô tả · "Phù hợp cho" · link. Mỗi hàng cao bằng nội dung dài nhất → các mục luôn nằm ngang nhau. */}
        <ul className="mt-12 grid gap-x-5 gap-y-5 md:grid-cols-2 md:gap-y-0">
          {services.map((s, i) => (
            <li
              key={s.slug}
              className="reveal md:row-span-6 md:grid md:grid-rows-subgrid md:[&:nth-child(-n+2)]:mb-5"
              style={{ "--reveal-delay": `${i * 110}ms` }}
            >
              <Link
                href={`/dich-vu/${s.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft md:row-span-6 md:grid md:grid-rows-subgrid"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-navy-900">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                    style={{ objectPosition: s.imagePos }}
                  />
                  <span className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-navy-900 backdrop-blur">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span className="absolute top-4 right-4 text-[11px] tracking-eyebrow text-white/90 text-legible">
                    {s.number}
                  </span>
                </div>
                {/* Mỗi phần tử dưới đây là 1 hàng của subgrid (không bọc chung 1 div) */}
                <h3 className="px-6 pt-6 text-xl font-semibold tracking-tight sm:px-7 sm:pt-7 sm:text-[1.35rem]">
                  {s.title}
                </h3>
                <p className="px-6 pt-2 text-[13px] text-orange-600 sm:px-7">{s.short}</p>
                <p className="px-6 pt-4 text-sm leading-relaxed text-ink-soft sm:px-7">
                  {s.description}
                </p>
                <div className="px-6 pt-6 sm:px-7">
                  <div className="border-t border-ink/10 pt-5">
                    <p className="text-[11px] tracking-eyebrow text-ink-muted uppercase">
                      Phù hợp cho
                    </p>
                    {/* 3 cột trải hết chiều ngang thẻ: cột đầu sát lề trái, cột cuối sát lề phải, khoảng giữa chia đều → mọi thẻ xếp giống nhau (điện thoại 2 cột) */}
                    <ul className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm text-ink lg:grid-cols-2 xl:grid-cols-[repeat(3,auto)] xl:justify-between">
                      {s.goodFor.map((g) => (
                        <li key={g} className="flex items-start gap-1.5 leading-snug">
                          <span className="mt-[0.45em] size-1 shrink-0 rounded-full bg-orange-500" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <span className="mt-auto flex items-center justify-center gap-2 px-6 pt-6 pb-6 text-sm font-medium text-ink transition-colors group-hover:text-orange-500 sm:px-7 sm:pb-7">
                  Tìm hiểu thêm
                  <Icon
                    name="arrowRight"
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
