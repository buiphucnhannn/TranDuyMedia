import { FormatShowcase } from "@/components/about/FormatShowcase";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { ZoomGroup, ZoomImage } from "@/components/gallery";
import { PageHeader } from "@/components/sections";
import { Button, Container, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import {
  aboutHeaderColumns,
  behindImages,
  capabilities,
  companyFacts,
  coreValues,
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
    "Tran Duy Media Studio – 10+ năm sản xuất video thương mại, phim doanh nghiệp, chụp ảnh và cho thuê studio tại TP.HCM. 1000+ dự án, 500+ khách hàng doanh nghiệp. Uy tín – Trách nhiệm – Tâm huyết.",
  path: "/gioi-thieu",
  image: "/images/bts/bts-05.jpg",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Về chúng tôi"
        eyebrow="Hồ sơ doanh nghiệp"
        description="Studio sản xuất video & hình ảnh thương mại trọn gói tại TP.HCM — hơn 10 năm đồng hành cùng doanh nghiệp Việt."
        columns={aboutHeaderColumns}
      />
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
            title="Một studio, một ekip, một đầu mối trọn gói."
          />
          <div
            className="reveal mt-6 space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ "--reveal-delay": "160ms" }}
          >
            <p>
              {siteConfig.name} ra đời từ một niềm tin đơn giản: video thương mại tốt phải bán được
              hàng. Hơn 10 năm qua, chúng tôi sản xuất trọn gói cho doanh nghiệp — từ startup ra mắt
              sản phẩm đầu tiên đến SME cần phim năng lực để đấu thầu.
            </p>
            <p>
              Studio tại Nhà Bè là nơi mọi thứ diễn ra: phòng quay, hệ đèn, bối cảnh theo mùa và một
              ekip quen tay với TVC, documentary, phim doanh nghiệp, sự kiện và chụp ảnh.
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

/* ── Sứ mệnh / tầm nhìn + 3 giá trị cốt lõi dạng hàng biên tập ── */
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
          <p className="reveal mb-4 eyebrow">Giá trị cốt lõi</p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeading title="Ba điều chúng tôi cam kết với mọi khách hàng." />
            <p
              className="reveal max-w-sm text-base leading-relaxed text-ink-soft"
              style={{ "--reveal-delay": "160ms" }}
            >
              Không chỉ là khẩu hiệu — đây là cách chúng tôi làm việc trong từng dự án.
            </p>
          </div>
          {/* 3 cột trải hết khung: [số + tên] | mô tả | cam kết (cột cuối rộng cố định → các hàng thẳng cột) */}
          <ol className="mt-10 border-t border-ink/10">
            {coreValues.map((v, i) => (
              <li
                key={v.title}
                className="reveal grid gap-4 border-b border-ink/10 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_17.5rem] md:items-center md:gap-12 xl:gap-20"
                style={{ "--reveal-delay": `${i * 90}ms` }}
              >
                <div className="flex items-center gap-6 sm:gap-10">
                  <span className="w-6 text-sm font-semibold tracking-widest text-orange-500">
                    {pad(i + 1)}
                  </span>
                  <h3 className="text-4xl h-display text-ink sm:text-5xl">{v.title}</h3>
                </div>
                <p className="text-base leading-relaxed text-ink-soft">{v.desc}</p>
                <ul className="space-y-2">
                  {v.promises.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm font-medium text-ink">
                      <Icon name="check" className="mt-0.5 size-4 shrink-0 text-orange-500" />
                      {p}
                    </li>
                  ))}
                </ul>
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
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="reveal mt-10 flex flex-wrap gap-3" style={{ "--reveal-delay": "200ms" }}>
            <Button pill data-booking>
              Đặt lịch tư vấn
            </Button>
            <Button href="/studio" variant="outline">
              Xem bối cảnh studio
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
          {pad(index + 1)} · {item.en}
        </span>
      </div>

      <div>
        <p className="max-w-xl text-left text-[1.6rem] leading-[1.25] font-bold tracking-tight text-balance sm:text-[2rem]">
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
