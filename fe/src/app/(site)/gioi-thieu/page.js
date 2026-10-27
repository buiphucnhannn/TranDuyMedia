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
  standardsCard,
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
      {/* Theo hồ sơ khách hàng: câu chuyện → tầm nhìn · sứ mệnh · chuẩn mực → năng lực → hậu trường */}
      <Profile />
      <CoreValues />
      <Capacity />
      <BehindTheScenes />
    </>
  );
}

/* ── Thông điệp & câu chuyện: giới thiệu + hồ sơ nhanh | 3 ảnh cao bằng cột chữ ── */
function Profile() {
  return (
    <section className="bg-paper section-y" data-nav-theme="light">
      <Container className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Câu chuyện của chúng tôi"
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

/* ── Năng lực sản xuất — 6 định dạng: trái đứng yên, phải lướt ảnh dự án ── */
function Capacity() {
  return (
    <section className="grain relative bg-navy-950 section-y text-white" data-nav-theme="dark">
      <Container>
        <FormatShowcase formats={formats} />
      </Container>
    </section>
  );
}

/* ── Giá trị cốt lõi: 3 khung ảnh đứng cạnh nhau — Tầm nhìn · Sứ mệnh · Chuẩn mực sản xuất.
   Ảnh đen trắng, tên giá trị lớn ở chân ảnh, nội dung trên dải navy viền cam (cùng chiều cao 3 cột).
   Rê chuột: ảnh hiện màu + phóng nhẹ. ── */
function CoreValues() {
  const cards = [
    {
      ...vision,
      body: <p className="text-left text-[15px] leading-relaxed text-white/75">{vision.text}</p>,
    },
    {
      ...mission,
      body: <p className="text-left text-[15px] leading-relaxed text-white/75">{mission.text}</p>,
    },
    {
      ...standardsCard,
      body: (
        <ol className="space-y-2">
          {productionStandards.map((v, i) => (
            <li key={v.title} className="flex gap-3 text-[15px] leading-snug text-white/80">
              <span className="w-5 shrink-0 pt-px text-xs font-semibold tracking-widest text-orange-400">
                {pad(i + 1)}
              </span>
              {v.title}
            </li>
          ))}
        </ol>
      ),
    },
  ];
  return (
    <section className="bg-white section-y" data-nav-theme="light">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Trần Duy Media"
          title="Những giá trị cốt lõi."
          description="Sức mạnh và uy tín của Trần Duy Media bắt nguồn từ tầm nhìn, sứ mệnh và chuẩn mực trong từng dự án."
        />
        <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3 md:gap-4 lg:gap-5">
          {cards.map((c, i) => (
            <article
              key={c.title}
              className="group reveal flex flex-col overflow-hidden rounded-2xl bg-navy-950 text-white shadow-card"
              data-reveal="scale"
              style={{ "--reveal-delay": `${i * 110}ms` }}
            >
              <div className="relative aspect-4/3 overflow-hidden md:aspect-4/5">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover grayscale transition-[filter,scale] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                  style={{ objectPosition: c.imagePos }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/25 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 px-6 pb-5 sm:px-7">
                  <p className="text-[11px] font-semibold tracking-eyebrow text-orange-400 uppercase">
                    {pad(i + 1)} - {c.en}
                  </p>
                  <h3 className="mt-2 text-[1.7rem] leading-[1.15] font-bold tracking-tight text-balance uppercase lg:text-3xl">
                    {c.title}
                  </h3>
                </div>
              </div>
              <div className="flex-1 border-t-[3px] border-orange-500 px-6 py-6 text-left sm:px-7">
                {c.body}
              </div>
            </article>
          ))}
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
