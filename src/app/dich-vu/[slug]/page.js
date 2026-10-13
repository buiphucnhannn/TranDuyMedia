import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { BentoGallery } from "@/components/gallery";
import { Journey, ServiceItems } from "@/components/services";
import { Button, Container, Marquee } from "@/components/ui";
import { Faq, PageHeader } from "@/components/sections";
import { siteConfig } from "@/config/site";
import { getService, services } from "@/data/services";
import { createMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return createMetadata({
    title: s.title,
    description: s.description,
    path: `/dich-vu/${s.slug}`,
    image: s.image,
  });
}

/** 6 cột × 3 ảnh cho nền đầu trang, lấy vòng từ bộ ảnh của dịch vụ */
const headerColumns = (pool) =>
  Array.from({ length: 6 }, (_, i) => [0, 1, 2].map((k) => pool[(i * 3 + k) % pool.length]));

/**
 * Trang dịch vụ con — CẤU TRÚC GIỐNG NHAU cho cả 3 dịch vụ, mọi nội dung lấy từ data/services.js:
 * 1. Đầu trang: nền cột ảnh trôi (ghép từ ảnh của dịch vụ) · 2. Tổng quan + số liệu
 * 3. Hạng mục (rê chuột đổi ảnh) · 4. Dải bàn giao chạy ngang · 6. Quy trình · 5. Tác phẩm thực tế
 * 7. Bàn giao (tràn ngang, nền ảnh) · 8. FAQ riêng · 9. Dịch vụ khác — nền sáng/tối xen kẽ.
 * Không await params ở cấp cao nhất (Next 16 + Cache Components): phần đọc URL nằm trong <Suspense>.
 */
export default function ServicePage({ params }) {
  return (
    <Suspense fallback={<ServiceSkeleton />}>
      <ServiceView params={params} />
    </Suspense>
  );
}

async function ServiceView({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const others = services.filter((x) => x.slug !== slug);
  // Ảnh tác phẩm: bỏ 3 ảnh đã dùng ở phần Tổng quan → không lặp
  const works = [...new Set(s.pool)].slice(3, 10);

  return (
    <>
      {/* 1 ---------- Đầu trang ---------- */}
      <PageHeader
        title={s.title}
        description={s.heroDesc}
        eyebrow={`Dịch vụ ${s.number} / 0${services.length}`}
        crumbs={[{ label: "Dịch vụ", href: "/dich-vu" }]}
        columns={headerColumns(s.pool)}
      />

      {/* 2 ---------- Tổng quan ---------- */}
      <section className="bg-paper section-y" data-nav-theme="light">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative isolate">
              {/* Chữ chìm "Services" — nằm gọn trong cột chữ, sau số liệu & tag (giống trang Dịch vụ tổng hợp) */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 left-0 -z-10 hidden max-w-full text-[clamp(6rem,8.5vw,8.5rem)] h-display leading-none whitespace-nowrap text-ink/[0.04] select-none lg:block"
              >
                Services
              </span>
              <p className="reveal mb-4 flex items-center gap-3 eyebrow">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-500 text-white">
                  <Icon name={s.icon} className="size-4" />
                </span>
                Tổng quan
              </p>
              <h2 className="reveal h-section" style={{ "--reveal-delay": "80ms" }}>
                {s.tagline}
              </h2>
              <p
                className="reveal mt-5 text-base leading-relaxed text-ink-soft sm:text-lg"
                style={{ "--reveal-delay": "160ms" }}
              >
                {s.description}
              </p>
              <dl
                className="reveal mt-8 grid max-w-lg grid-cols-3 gap-6 border-y border-ink/10 py-6"
                style={{ "--reveal-delay": "200ms" }}
              >
                {s.highlights.map((h) => (
                  <div key={h.label}>
                    <dd className="text-2xl h-display text-navy-900 sm:text-3xl">{h.value}</dd>
                    <dt className="mt-1 text-xs text-ink-muted">{h.label}</dt>
                  </div>
                ))}
              </dl>
              <p
                className="reveal mt-8 text-[11px] tracking-eyebrow text-ink-muted uppercase"
                style={{ "--reveal-delay": "220ms" }}
              >
                Phù hợp cho
              </p>
              <ul
                className="reveal mt-3 flex flex-wrap gap-2"
                style={{ "--reveal-delay": "240ms" }}
              >
                {s.goodFor.map((g) => (
                  <li
                    key={g}
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-card ring-1 ring-ink/5"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cụm ảnh: 1 ảnh cao + 2 ảnh */}
            <div className="relative">
              <div className="relative grid h-[420px] grid-cols-[1.15fr_1fr] grid-rows-2 gap-4 sm:h-[520px]">
                {[0, 1, 2].map((k) => (
                  <div
                    key={s.pool[k]}
                    className={cn(
                      "reveal relative overflow-hidden rounded-3xl bg-paper-200 shadow-card",
                      k === 0 && "row-span-2 shadow-soft",
                    )}
                    data-reveal="scale"
                    style={{ "--reveal-delay": `${k * 120}ms` }}
                  >
                    <Image
                      src={s.pool[k]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-[1400ms] hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3 ---------- Hạng mục ---------- */}
      <section className="bg-white section-y" data-nav-theme="light">
        <Container>
          <p className="reveal mb-4 eyebrow">Hạng mục</p>
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="reveal max-w-2xl h-section" style={{ "--reveal-delay": "80ms" }}>
              Những gì chúng tôi thực hiện.
            </h2>
            <p
              className="reveal hidden max-w-xs text-sm text-ink-muted lg:block"
              style={{ "--reveal-delay": "160ms" }}
            >
              Rê chuột qua từng hạng mục để xem hình ảnh thực tế.
            </p>
          </div>
          <ServiceItems items={s.items} />
        </Container>
      </section>

      {/* 4 ---------- Dải bàn giao chạy ngang ---------- */}
      <div
        className="border-y border-orange-600 bg-orange-500 py-5 text-white"
        data-nav-theme="light"
      >
        <Marquee
          items={[...s.deliverables, ...s.goodFor]}
          duration="45s"
          dotClassName="bg-white/70"
          itemClassName="text-lg font-semibold tracking-tight sm:text-xl"
        />
      </div>

      {/* 6 ---------- Quy trình ---------- */}
      <Journey />

      {/* 5 ---------- Tác phẩm thực tế ---------- */}
      <section id="tac-pham" className="bg-paper section-y" data-nav-theme="light">
        <Container>
          <p className="reveal mb-4 eyebrow">Tác phẩm thực tế</p>
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="reveal h-section" style={{ "--reveal-delay": "80ms" }}>
              Thực hiện tại Tran Duy Media.
            </h2>
            <p className="reveal text-sm text-ink-muted">Bấm vào ảnh để xem lớn</p>
          </div>
          <BentoGallery images={works} name={s.title} />
        </Container>
      </section>

      {/* 7 ---------- Bàn giao / bao gồm: tràn ngang, nền dải 6 ảnh của dịch vụ ---------- */}
      <section
        className="relative isolate overflow-hidden bg-navy-950 section-y text-white"
        data-nav-theme="dark"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bleed-cap grid grid-cols-3 lg:grid-cols-6"
        >
          {s.pool.slice(-6).map((src, i) => (
            <div key={src} className="group/bg relative">
              <Image
                src={src}
                alt=""
                fill
                quality={60}
                sizes="(min-width: 1024px) 17vw, 34vw"
                className="object-cover grayscale transition-[filter] duration-700 group-hover/bg:grayscale-0"
              />
              {i > 0 && <span className="absolute inset-y-0 left-0 w-px bg-white/10" />}
            </div>
          ))}
        </div>
        {/* Phủ tối: đậm bên trái (chữ), nhạt dần sang phải; quầng cam */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-navy-950 via-navy-950/75 to-navy-950/35" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-navy-950/80 via-transparent to-navy-950/60" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 -z-10 size-[460px] rounded-full bg-orange-500/25 blur-[140px]" />

        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <p className="reveal mb-4 eyebrow">Bàn giao & bao gồm</p>
              <h2 className="reveal h-section text-legible" style={{ "--reveal-delay": "80ms" }}>
                {s.deliverTitle}
              </h2>
              <p
                className="reveal mt-4 max-w-md text-base leading-relaxed text-white/75 text-legible"
                style={{ "--reveal-delay": "140ms" }}
              >
                Mọi hạng mục đều rõ ràng ngay từ dự toán — không phát sinh ẩn, không chờ đợi.
              </p>
              <div
                className="reveal mt-8 flex flex-wrap gap-3"
                style={{ "--reveal-delay": "200ms" }}
              >
                <Button variant="white" pill data-booking={s.slug}>
                  Nhận báo giá
                </Button>
                <Button variant="light" href={siteConfig.contact.phoneHref}>
                  <Icon name="phone" className="size-4" />
                  {siteConfig.contact.phone}
                </Button>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {s.deliverables.map((d, i) => (
                <li
                  key={d}
                  className="reveal group flex items-center gap-4 rounded-2xl border border-white/15 bg-navy-950/70 p-5 transition-colors duration-300 hover:border-orange-500/60 sm:p-6"
                  style={{ "--reveal-delay": `${i * 80}ms` }}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-orange-500 transition-transform duration-300 group-hover:scale-110">
                    <Icon name="check" className="size-5" strokeWidth={2.5} />
                  </span>
                  <span>
                    <span className="block text-[10px] tracking-eyebrow text-white/45 uppercase tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="block font-semibold">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 8 ---------- FAQ riêng ---------- */}
      <Faq items={s.faqs} title={`Câu hỏi về ${s.title.toLowerCase()}.`} />

      {/* 9 ---------- Dịch vụ khác ---------- */}
      <section className="bg-white section-y" data-nav-theme="light">
        <Container>
          <div className="mb-10 flex items-center justify-between gap-6">
            <h2 className="reveal text-3xl h-display sm:text-4xl">Dịch vụ khác</h2>
            <Link
              href="/dich-vu"
              className="reveal group inline-flex items-center gap-2 text-sm font-medium hover:text-orange-500"
            >
              Tổng quan dịch vụ
              <Icon
                name="arrowRight"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {others.map((o, i) => (
              <Link
                key={o.slug}
                href={`/dich-vu/${o.slug}`}
                className="reveal group relative block aspect-16/9 overflow-hidden rounded-3xl bg-navy-900 text-white"
                style={{ "--reveal-delay": `${i * 100}ms` }}
              >
                <Image
                  src={o.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                  style={{ objectPosition: o.imagePos }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                  <div>
                    <p className="text-[11px] tracking-eyebrow text-white/60 uppercase">
                      Dịch vụ {o.number}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                      {o.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">{o.tagline}</p>
                  </div>
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-navy-900 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                    <Icon name="arrowRight" className="size-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

/** Khung chờ cùng chiều cao đầu trang → không giật layout khi nội dung đổ vào. */
function ServiceSkeleton() {
  return (
    <section
      className="relative flex min-h-[max(460px,calc(var(--screen)*0.66))] items-end bg-navy-950 pt-32 pb-16 text-white"
      data-nav-theme="dark"
      aria-busy="true"
    >
      <Container className="space-y-5">
        <div className="h-3 w-56 rounded-full bg-white/10" />
        <div className="h-16 w-3/4 animate-pulse rounded-xl bg-white/10" />
        <div className="h-5 w-1/2 rounded-full bg-white/5" />
      </Container>
    </section>
  );
}
