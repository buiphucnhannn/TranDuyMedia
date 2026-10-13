import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * 3 dịch vụ chính (theo mẫu ButStudio): mỗi dịch vụ một hàng, ảnh dọc và chữ xen kẽ trái/phải
 * (editorial zig-zag), số thứ tự lớn mờ phía sau, các hạng mục + nút báo giá & xem chi tiết trang con.
 */
export function ServiceList() {
  return (
    <section id="dich-vu-chinh" className="relative isolate overflow-hidden bg-paper section-y">
      <Container>
        <div className="max-w-2xl">
          <p className="reveal eyebrow">Dịch vụ chính</p>
          <h2 className="reveal mt-4 h-section" style={{ "--reveal-delay": "80ms" }}>
            Chọn dịch vụ phù hợp mục tiêu của bạn.
          </h2>
        </div>

        <div className="mt-12 space-y-16 lg:mt-16 lg:space-y-24">
          {services.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={s.slug}
                className={cn(
                  "relative grid items-center gap-10 lg:gap-16 xl:gap-20",
                  flip
                    ? "lg:grid-cols-[1.1fr_0.9fr] lg:[&>*:first-child]:order-2"
                    : "lg:grid-cols-[0.9fr_1.1fr]",
                )}
              >
                {/* Ảnh */}
                <Link
                  href={`/dich-vu/${s.slug}`}
                  className={cn(
                    "reveal group relative mx-auto block aspect-4/5 w-full max-w-[440px] overflow-hidden rounded-[2rem] bg-paper-200 lg:mx-0",
                    flip && "lg:ml-auto",
                  )}
                  data-reveal="clip"
                  aria-label={s.title}
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 34vw, 90vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                    style={{ objectPosition: s.imagePos }}
                  />
                  <span className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.25em] text-ink uppercase">
                    <Icon name={s.icon} className="size-3.5" />
                    Dịch vụ {s.number}
                  </span>
                </Link>

                {/* Chữ */}
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -left-4 hidden text-[12rem] h-display leading-none text-ink/[0.05] select-none lg:block"
                  >
                    {s.number}
                  </span>
                  <div className="relative">
                    <p className="reveal eyebrow">{s.menuDesc}</p>
                    <h3
                      className="reveal mt-3 text-[2rem] h-display sm:text-[2.5rem]"
                      style={{ "--reveal-delay": "80ms" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="reveal mt-3 text-lg font-medium text-orange-600"
                      style={{ "--reveal-delay": "120ms" }}
                    >
                      {s.tagline}
                    </p>
                    <p
                      className="reveal mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft"
                      style={{ "--reveal-delay": "160ms" }}
                    >
                      {s.description}
                    </p>
                    <ul
                      className="reveal mt-6 grid gap-2.5 sm:grid-cols-2"
                      style={{ "--reveal-delay": "240ms" }}
                    >
                      {s.items.map((it) => (
                        <li key={it.name} className="flex items-start gap-2.5 text-sm text-ink">
                          <Icon
                            name="check"
                            className="mt-0.5 size-4 shrink-0 text-orange-500"
                            strokeWidth={2.5}
                          />
                          <span>{it.name}</span>
                        </li>
                      ))}
                    </ul>
                    <div
                      className="reveal mt-8 flex flex-wrap gap-3"
                      style={{ "--reveal-delay": "320ms" }}
                    >
                      <button
                        type="button"
                        data-booking={s.slug}
                        className="group inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-[13px] font-medium text-white transition hover:bg-navy-700"
                      >
                        Nhận báo giá
                        <Icon
                          name="arrowRight"
                          className="size-4 transition-transform group-hover:translate-x-1"
                        />
                      </button>
                      <Link
                        href={`/dich-vu/${s.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-[13px] font-medium text-ink transition hover:border-navy-900 hover:bg-navy-900 hover:text-white"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
