import { FormatShowcase } from "@/components/about/FormatShowcase";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { Icon } from "@/components/icons";
import { ZoomGroup, ZoomImage } from "@/components/gallery";
import { PageHeader, Partners } from "@/components/sections";
import { Button, Container, SectionHeading } from "@/components/ui";
import {
  aboutHeaderColumns,
  behindImages,
  capabilities,
  companyFacts,
  productionStandards,
  formats,
  mission,
  profileImages,
  vision,
} from "@/data/about";
import { createMetadata } from "@/lib/metadata";
import { cn, pad } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Về chúng tôi",
  description:
    "Trần Duy Media – đơn vị gia công nội dung truyền thông, thương mại quảng cáo với hơn 10 năm kinh nghiệm thực chiến: video marketing, chụp ảnh thương mại, chụp ảnh sự kiện và cho thuê studio tại TP.HCM.",
  path: "/gioi-thieu",
  image: "/images/bts/bts-05.webp",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Về chúng tôi"
        eyebrow="Hồ sơ doanh nghiệp"
        description={
          "Gia công nội dung truyền thông, thương mại quảng cáo tại TP.HCM — hơn 10\u00a0năm đồng hành cùng doanh nghiệp Việt."
        }
        columns={aboutHeaderColumns}
      />
      <Partners />
      <Profile />
      <Capacity />
      <Values />
      <BehindTheScenes />
    </>
  );
}

/* ── Chúng tôi là ai: giới thiệu + hồ sơ nhanh | 3 ảnh cao bằng cột chữ ── */
function Profile() {
  return (
    <section className="bg-paper section-y" data-nav-theme="light">
      <Container className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Chúng tôi là ai"
            title="Gia công nội dung truyền thông, thương mại quảng cáo."
          />
          <div
            className="reveal mt-6 space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ "--reveal-delay": "160ms" }}
          >
            <p>
              Trần Duy Media là đơn vị chuyên gia công nội dung truyền thông, thương mại quảng cáo.
              Bắt đầu từ tinh thần yêu nghề, kinh nghiệm thực chiến với hơn 10 năm đồng hành chuyên
              sâu, chúng tôi đã triển khai thành công nhiều dự án.
            </p>
            <p>
              Chúng tôi luôn nỗ lực mỗi ngày — nơi sáng tạo, sự đổi mới không chỉ dừng ở việc phục
              vụ mục tiêu kinh doanh của khách hàng, mà hơn hết là sự đồng hành cùng kiến tạo và
              nâng tầm giá trị doanh nghiệp vững bền.
            </p>
          </div>

          <dl className="mt-8 grid gap-x-10 border-t border-ink/10 sm:grid-cols-2">
            {companyFacts.map((f, i) => (
              <div
                key={f.label}
                className="reveal border-b border-ink/10 py-3.5"
                style={{ "--reveal-delay": `${(i % 2) * 80}ms` }}
              >
                <dt className="text-[11px] font-semibold tracking-eyebrow text-ink-muted uppercase">
                  {f.label}
                </dt>
                <dd className="mt-1.5 font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Khối ảnh cao đúng bằng cột chữ (grid stretch): 1 ảnh cao bên trái + 2 ảnh xếp chồng bên phải */}
        <ZoomGroup images={profileImages}>
          <div className="grid h-[460px] grid-cols-2 grid-rows-2 gap-4 sm:h-[560px] sm:gap-5 lg:h-full">
            {profileImages.map((img, i) => (
              <div
                key={img.src}
                className={cn("reveal min-h-0", i === 0 && "row-span-2")}
                data-reveal="scale"
                style={{ "--reveal-delay": `${i * 110}ms` }}
              >
                <ZoomImage
                  index={i}
                  src={img.src}
                  alt={img.alt}
                  pos={img.pos}
                  sizes="(min-width: 1024px) 22vw, 50vw"
                  className="size-full rounded-2xl bg-paper-200 shadow-card"
                />
              </div>
            ))}
          </div>
        </ZoomGroup>
      </Container>
    </section>
  );
}

/* ── 6 định dạng đã sản xuất: trái đứng yên, phải lướt ảnh (ảnh trích từ showreel) ── */
function Capacity() {
  return (
    <section className="grain relative bg-navy-950 section-y text-white" data-nav-theme="dark">
      <Container>
        <FormatShowcase formats={formats} />
      </Container>
    </section>
  );
}

/* ── Sứ mệnh / tầm nhìn + chuẩn mực sản xuất dạng hàng biên tập ── */
function Values() {
  return (
    <section className="bg-white section-y" data-nav-theme="light">
      <Container>
        <div className="grid gap-5 md:grid-cols-2">
          {[mission, vision].map((b, i) => (
            <StatementCard key={b.title} item={b} index={i} />
          ))}
        </div>

        <div className="mt-16 sm:mt-20">
          {/* Tiêu đề trái + mô tả phải canh giữa theo chiều cao TIÊU ĐỀ (eyebrow nằm ngoài hàng để không lệch tâm) */}
          <p className="reveal mb-4 eyebrow">Chuẩn mực sản xuất</p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeading title="Trần Duy Media cam kết chuẩn mực sản xuất." />
            {/* translate-y nhẹ: tâm NHÌN của tiêu đề lớn thấp hơn tâm hộp chữ (chừa chỗ dấu tiếng Việt) */}
            <p
              className="reveal max-w-sm text-base leading-relaxed text-ink-soft lg:translate-y-1.5"
              style={{ "--reveal-delay": "160ms" }}
            >
              Năm nguyên tắc chúng tôi giữ vững trong từng{" "}
              <span className="whitespace-nowrap">dự án,</span> với từng{" "}
              <span className="whitespace-nowrap">khách hàng.</span>
            </p>
          </div>
          {/* 2 cột trải hết khung: [số + tên] | mô tả (các hàng thẳng cột) */}
          <ol className="mt-10 border-t border-ink/10">
            {productionStandards.map((v, i) => (
              <li
                key={v.title}
                className="reveal grid gap-3 border-b border-ink/10 py-7 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-12 xl:gap-20"
                style={{ "--reveal-delay": `${i * 90}ms` }}
              >
                <div className="flex items-center gap-6 sm:gap-10">
                  <span className="w-6 text-sm font-semibold tracking-widest text-orange-500">
                    {pad(i + 1)}
                  </span>
                  <h3 className="text-3xl h-display text-ink sm:text-4xl">{v.title}</h3>
                </div>
                <p className="text-base leading-relaxed text-ink-soft">{v.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/* ── Hậu trường & thiết bị: danh sách năng lực | lưới ảnh bấm xem ── */
function BehindTheScenes() {
  const [big, ...rest] = behindImages;
  return (
    <section className="bg-paper section-y" data-nav-theme="light">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Hậu trường"
            title="Thiết bị riêng, studio riêng, ekip riêng."
            description="Chủ động máy quay, ánh sáng và bối cảnh — lịch quay linh hoạt, chi phí tối ưu cho doanh nghiệp."
          />
          {/* Năng lực: danh sách mở (không khung thẻ) — mỗi mục ngăn bằng 1 đường kẻ mảnh phía trên,
              icon trong ô bo tròn cam nhạt. Rê chuột: đường kẻ chuyển cam, ô icon đổ cam. */}
          <ul className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <li
                key={c.title}
                className="group reveal relative flex gap-4 border-t border-ink/10 pt-5"
                style={{ "--reveal-delay": `${(i % 2) * 90}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-0 bg-orange-500 transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-full"
                />
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 transition-colors duration-500 group-hover:bg-orange-500 group-hover:text-white">
                  <Icon name={c.icon} className="size-[22px]" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{c.title}</h3>
                  <p className="mt-1 text-left text-sm leading-relaxed text-ink-soft">{c.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div
            className="reveal btn-row mt-10 flex flex-wrap gap-3"
            style={{ "--reveal-delay": "200ms" }}
          >
            <Button pill data-booking>
              Đặt lịch tư vấn
            </Button>
            <Button href="/san-pham" variant="outline">
              Xem sản phẩm
            </Button>
          </div>
        </div>

        <ZoomGroup images={behindImages}>
          <div className="grid grid-cols-2 gap-3 sm:h-[480px] sm:grid-cols-3 sm:grid-rows-2 sm:gap-4 lg:h-[560px]">
            <div className="reveal col-span-2 sm:row-span-2" data-reveal="scale">
              <ZoomImage
                index={0}
                src={big.src}
                alt={big.alt}
                pos={big.pos}
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="aspect-4/3 size-full rounded-2xl bg-paper-200 sm:aspect-auto"
              />
            </div>
            {rest.map((img, i) => (
              <div
                key={img.src}
                className="reveal"
                data-reveal="scale"
                style={{ "--reveal-delay": `${(i + 1) * 80}ms` }}
              >
                <ZoomImage
                  index={i + 1}
                  src={img.src}
                  alt={img.alt}
                  pos={img.pos}
                  sizes="(min-width: 1024px) 14vw, 50vw"
                  className="aspect-3/4 size-full rounded-2xl bg-paper-200 sm:aspect-auto"
                />
              </div>
            ))}
          </div>
        </ZoomGroup>
      </Container>
    </section>
  );
}

const CORNERS = [
  "top-5 left-5 border-t-2 border-l-2",
  "top-5 right-5 border-t-2 border-r-2",
  "bottom-5 left-5 border-b-2 border-l-2",
  "bottom-5 right-5 border-b-2 border-r-2",
];

/* Sứ mệnh / Tầm nhìn: khung hình điện ảnh — ảnh nền phủ màu thương hiệu, 4 góc khung ngắm,
   câu tuyên bố lớn ở đáy + từ khoá. Rê chuột: ảnh trôi chậm, góc khung chuyển cam/trắng. */
function StatementCard({ item, index }) {
  const orange = index === 1;
  return (
    <article
      className="group reveal relative isolate flex min-h-[400px] flex-col justify-between overflow-hidden rounded-3xl p-9 text-white sm:min-h-[460px] sm:p-12"
      data-reveal="scale"
      style={{ "--reveal-delay": `${index * 120}ms` }}
    >
      <Image
        src={item.image}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className={cn(
          "-z-20 object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105",
          !orange && "grayscale",
        )}
        style={{ objectPosition: item.imagePos }}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10",
          orange
            ? "bg-linear-to-t from-orange-600 via-orange-500/85 to-orange-500/35"
            : "bg-linear-to-t from-navy-950 via-navy-950/80 to-navy-950/35",
        )}
      />
      {CORNERS.map((c) => (
        <span
          key={c}
          aria-hidden="true"
          className={cn(
            "absolute size-6 transition-colors duration-500",
            orange
              ? "border-white/50 group-hover:border-white"
              : "border-white/40 group-hover:border-orange-500",
            c,
          )}
        />
      ))}

      <div className="flex items-center justify-between gap-4 text-xs font-semibold tracking-eyebrow uppercase">
        <span className="flex items-center gap-3">
          <span className={cn("h-0.5 w-6", orange ? "bg-white" : "bg-orange-500")} />
          {item.title}
        </span>
        <span className="text-white/60">
          {pad(index + 1)} - {item.en}
        </span>
      </div>

      <div>
        <p className="max-w-lg text-left text-[1.4rem] leading-[1.3] font-bold tracking-tight text-balance sm:text-[1.75rem]">
          {item.text}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <li
              key={t}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm",
                orange
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-white/85 ring-1 ring-white/15",
              )}
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
