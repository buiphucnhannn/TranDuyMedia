import Image from "next/image";
import { Icon } from "@/components/icons";
import { Parallax, SplitText } from "@/components/fx";
import { Container } from "@/components/ui";
import { stats } from "@/data/services";

const FRAMES = [
  { src: "/images/bts/bts-05.jpg", pos: "center", h: "h-[78%]", speed: 0.05, delay: 0 },
  {
    src: "/images/christmas/christmas-07.jpg",
    pos: "center 30%",
    h: "h-full",
    speed: -0.04,
    delay: 120,
  },
  {
    src: "/images/vintage-green/vintage-green-03.jpg",
    pos: "center",
    h: "h-[86%]",
    speed: 0.07,
    delay: 240,
  },
];

/**
 * Hero trang Dịch vụ (theo bố cục ButStudio): chữ bên trái, bên phải 3 ảnh dọc so le
 * (ảnh giữa cao nhất) có parallax nhẹ; chữ "Services" chìm lớn phía sau; dải số liệu dưới nút.
 * Lưu ý: .reveal đặt ở phần tử CON của <Parallax> (Parallax dùng transform inline).
 */
export function ServicesHero() {
  return (
    <section className="relative isolate flex screen items-center overflow-hidden bg-paper pt-28 pb-16">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="relative">
            {/* Chữ chìm "Services" — nằm gọn trong cột chữ, sau dải số liệu */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 left-0 -z-10 hidden max-w-full text-[clamp(6rem,8.5vw,8.5rem)] h-display leading-none whitespace-nowrap text-ink/[0.04] select-none lg:block"
            >
              Services
            </span>
            <p className="reveal eyebrow">Dịch vụ - Tran Duy Media Studio</p>
            <SplitText
              as="h1"
              text="Một ekip cho trọn chiến dịch hình ảnh"
              accent="trọn chiến dịch hình ảnh"
              breakBeforeAccent
              keep={["hình ảnh"]}
              className="mt-5 text-[2.5rem] h-display text-balance sm:text-[3.3rem] lg:text-[3.6rem] xl:text-[4.1rem]"
            />
            <p
              className="reveal mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base"
              style={{ "--reveal-delay": "250ms" }}
            >
              Sản xuất video thương mại, cho thuê bối cảnh studio và chụp ảnh thương mại — ba dịch
              vụ bổ trợ nhau, được thực hiện bởi cùng một đội ngũ nên hình ảnh luôn đồng bộ, tiến độ
              rõ ràng.
            </p>
            <div
              className="reveal mt-8 flex flex-wrap items-center gap-3"
              style={{ "--reveal-delay": "350ms" }}
            >
              <button
                type="button"
                data-booking
                className="group inline-flex items-center gap-3 rounded-full bg-navy-900 py-1.5 pr-1.5 pl-6 text-sm font-medium text-white shadow-card transition hover:bg-navy-700"
              >
                Đặt lịch tư vấn
                <span className="flex size-9 items-center justify-center rounded-full bg-orange-500 text-white transition-transform group-hover:translate-x-0.5">
                  <Icon name="arrowRight" className="size-4" />
                </span>
              </button>
            </div>
            <dl
              className="reveal mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-7"
              style={{ "--reveal-delay": "450ms" }}
            >
              {stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <dt className="text-3xl h-display text-navy-900 sm:text-4xl">{s.value}</dt>
                  <dd className="mt-1 text-[12px] leading-snug text-ink-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 3 ảnh dọc so le */}
          <div className="relative grid h-[70vw] grid-cols-3 items-end gap-3 sm:h-[52vw] lg:h-[calc(var(--screen)*0.66)] lg:gap-4">
            {FRAMES.map((f, i) => (
              <Parallax key={f.src} desktopOnly speed={f.speed} className={f.h}>
                <div
                  className="reveal relative size-full overflow-hidden rounded-3xl bg-paper-200"
                  data-reveal="clip"
                  style={{ "--reveal-delay": `${f.delay}ms` }}
                >
                  <Image
                    src={f.src}
                    alt=""
                    fill
                    preload={i === 1}
                    sizes="(min-width:1024px) 18vw, 30vw"
                    className="object-cover"
                    style={{ objectPosition: f.pos }}
                  />
                </div>
              </Parallax>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
