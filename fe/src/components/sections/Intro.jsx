import { SmartImage as Image } from "@/components/ui/SmartImage";
import { Parallax } from "@/components/fx";
import { Button, Container } from "@/components/ui";
import { DEFAULT_INTRO } from "@/data/home";
import { stats } from "@/data/services";
import { zoomStyle } from "@/lib/crop";

/**
 * Giới thiệu ngắn (khớp nội dung trang Về chúng tôi) + số liệu (USP: 10+ năm, trọn gói).
 * Bên phải: ảnh hậu trường lớn + ảnh nhỏ (ảnh studio khách chọn — feedback 02/11) xếp lệch, parallax nhẹ.
 */
export function Intro({ images = DEFAULT_INTRO }) {
  const { main, side } = images; // quản trị thay ở tab "Trang chủ"
  return (
    <section className="relative overflow-hidden bg-white section-y" data-nav-theme="light">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="reveal mb-4 eyebrow">Về Trần Duy Media</p>
            <h2 className="reveal h-section" style={{ "--reveal-delay": "80ms" }}>
              <span className="whitespace-nowrap">Đồng hành</span> trên{" "}
              <span className="whitespace-nowrap">hành trình</span>{" "}
              <span className="whitespace-nowrap">phát triển</span>{" "}
              <span className="whitespace-nowrap">cùng doanh nghiệp.</span>
            </h2>
            <p
              className="reveal mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
              style={{ "--reveal-delay": "160ms" }}
            >
              Đơn vị chuyên gia công nội dung truyền thông, thương mại quảng cáo — bắt đầu từ tinh
              thần yêu nghề và kinh nghiệm thực chiến, cùng doanh nghiệp nâng tầm giá trị vững bền.
            </p>
            <div
              className="reveal btn-row mt-8 flex flex-wrap gap-3"
              style={{ "--reveal-delay": "240ms" }}
            >
              <Button href="/gioi-thieu" pill>
                Câu chuyện của chúng tôi
              </Button>
              <Button href="#dich-vu-trong-tam" variant="outline">
                Xem dịch vụ
              </Button>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ink/10 pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((s, i) => (
                <div key={s.label} className="reveal" style={{ "--reveal-delay": `${i * 90}ms` }}>
                  <dd className="text-4xl h-display text-navy-900 sm:text-5xl">{s.value}</dd>
                  <dt className="mt-2 text-sm text-balance text-ink-soft">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative aspect-[100/88] lg:aspect-auto lg:min-h-0">
            <Parallax speed={0.08} className="absolute top-0 right-0 w-[68%]" desktopOnly>
              <div
                className="reveal relative aspect-4/5 overflow-hidden rounded-2xl shadow-soft"
                data-reveal="scale"
              >
                <span className="absolute inset-0" style={zoomStyle(main)}>
                  <Image
                    src={main.src}
                    alt={main.alt}
                    fill
                    ratio={main.ratio}
                    sizes="(min-width: 1024px) 34vw, 68vw"
                    className="object-cover"
                    style={{ objectPosition: main.pos }}
                  />
                </span>
              </div>
            </Parallax>
            {/* Ảnh nhỏ bên trái: thay bằng ảnh khách chọn (feedback 02/11, mục 6) */}
            <Parallax speed={-0.06} className="absolute bottom-0 left-0 w-[52%]" desktopOnly>
              <div
                className="reveal relative aspect-square overflow-hidden rounded-2xl shadow-soft"
                data-reveal="scale"
                style={{ "--reveal-delay": "200ms" }}
              >
                <span className="absolute inset-0" style={zoomStyle(side)}>
                  <Image
                    src={side.src}
                    alt={side.alt}
                    fill
                    ratio={side.ratio}
                    sizes="(min-width: 1024px) 26vw, 52vw"
                    className="object-cover"
                    style={{ objectPosition: side.pos }}
                  />
                </span>
              </div>
            </Parallax>
            {/* Neo theo mép phải: luôn kết thúc cách mép trái ảnh lớn (rộng 68%, sát phải) 1.5rem → không chạm ảnh */}
            <span
              aria-hidden="true"
              className="absolute top-[8%] right-[calc(68%+1.5rem)] hidden text-[clamp(4.5rem,7vw,7rem)] h-display leading-none whitespace-nowrap text-paper-200 select-none lg:block"
            >
              10+
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
