import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { AlbumGallery, CollectionCard } from "@/components/gallery";
import { Button, Container } from "@/components/ui";
import { PageHeader } from "@/components/sections";
import { collections, getCollection } from "@/data/collections";
import { createMetadata } from "@/lib/metadata";
import { pad } from "@/lib/utils";

/** 6 cột × 3 ảnh cho nền đầu trang, lấy vòng từ ảnh của bối cảnh */
const headerColumns = (pool) =>
  Array.from({ length: 6 }, (_, i) => [0, 1, 2].map((k) => pool[(i * 3 + k) % pool.length]));

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return createMetadata({
    title: `${c.name} – Bối cảnh studio`,
    description: c.description,
    path: `/studio/${c.slug}`,
    image: c.cover.src,
  });
}

/**
 * Trang KHÔNG await params ở cấp cao nhất (Next 16 + Cache Components): phần đọc URL nằm trong
 * <Suspense> → khung trang (nền tối + khung lưới ảnh) dựng sẵn và hiện NGAY khi chuyển trang,
 * nội dung bối cảnh đổ vào sau. 6 bối cảnh trong generateStaticParams vẫn được prerender đầy đủ.
 */
export default function CollectionPage({ params }) {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionView params={params} />
    </Suspense>
  );
}

async function CollectionView({ params }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();

  const idx = collections.findIndex((x) => x.slug === slug);
  const others = [1, 2, 3].map((k) => collections[(idx + k) % collections.length]);

  return (
    <>
      {/* Đầu trang: nền cột ảnh trôi ghép từ CHÍNH căn phòng này (giống các trang dịch vụ con) */}
      <PageHeader
        title={c.name}
        breadcrumb={c.name}
        eyebrow={`${c.eyebrow} · ${pad(c.images.length)} ảnh`}
        description={c.tagline}
        crumbs={[{ label: "Studio", href: "/studio" }]}
        columns={headerColumns(c.images.map((im) => im.src))}
      />

      {/* Tổng quan: mô tả, đặc điểm, nút + 3 ảnh bìa */}
      <section className="bg-white section-y" data-nav-theme="light">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="reveal mb-4 eyebrow">Tổng quan</p>
              <h2 className="reveal h-section" style={{ "--reveal-delay": "80ms" }}>
                {c.tagline}
              </h2>
              <p
                className="reveal mt-5 text-base leading-relaxed text-ink-soft sm:text-lg"
                style={{ "--reveal-delay": "160ms" }}
              >
                {c.description}
              </p>
              <ul
                className="reveal mt-8 grid gap-3 border-y border-ink/10 py-6 sm:grid-cols-2"
                style={{ "--reveal-delay": "220ms" }}
              >
                {c.features.map((ft) => (
                  <li key={ft} className="flex items-center gap-2.5 text-sm font-medium">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                      <Icon name="check" className="size-3.5" strokeWidth={3} />
                    </span>
                    {ft}
                  </li>
                ))}
              </ul>
              <div
                className="reveal mt-8 flex flex-wrap gap-3"
                style={{ "--reveal-delay": "280ms" }}
              >
                <Button pill data-booking="cho-thue-studio">
                  Đặt lịch bối cảnh này
                </Button>
                <Button href="/studio" variant="outline">
                  Bối cảnh khác
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {c.covers.map((img, i) => (
                <div
                  key={img.src}
                  className={`reveal relative aspect-3/4 overflow-hidden rounded-2xl bg-paper-200 shadow-card ${i === 1 ? "-translate-y-6 sm:-translate-y-10" : ""}`}
                  data-reveal="scale"
                  style={{ "--reveal-delay": `${i * 120}ms` }}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover"
                    style={{ objectPosition: img.pos }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper section-y" data-nav-theme="light">
        <Container>
          <div className="mb-10 flex items-center justify-between gap-6">
            <h2 className="reveal text-3xl h-display sm:text-4xl">Toàn bộ bối cảnh</h2>
            <p className="reveal text-sm text-ink-muted">Bấm vào ảnh để xem lớn</p>
          </div>
          <AlbumGallery images={c.images} name={c.name} />
        </Container>
      </section>

      <section className="bg-white section-y" data-nav-theme="light">
        <Container>
          <div className="mb-10 flex items-center justify-between gap-6">
            <h2 className="reveal text-3xl h-display sm:text-4xl">Bối cảnh khác</h2>
            <Link
              href="/studio"
              className="reveal group inline-flex items-center gap-2 text-sm font-medium hover:text-orange-500"
            >
              Xem tất cả
              <Icon
                name="arrowRight"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {others.map((o, i) => (
              <CollectionCard key={o.slug} collection={o} index={i} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

/** Khung chờ: cùng bố cục & màu với trang thật → không giật layout khi nội dung đổ vào. */
function CollectionSkeleton() {
  return (
    <>
      <section
        className="relative flex min-h-[max(460px,calc(var(--screen)*0.66))] items-center bg-navy-950 pt-[calc(84px+2rem)] pb-24 text-white"
        data-nav-theme="dark"
        aria-busy="true"
      >
        <Container className="space-y-5">
          <div className="h-3 w-40 rounded-full bg-white/10" />
          <div className="h-3 w-56 rounded-full bg-orange-500/30" />
          <div className="h-14 w-2/3 animate-pulse rounded-xl bg-white/10" />
          <div className="h-4 w-1/2 rounded-full bg-white/5" />
        </Container>
      </section>
      <section className="bg-paper section-y" data-nav-theme="light">
        <Container>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-4/5 w-[calc((100%-0.75rem)/2)] animate-pulse rounded-xl bg-paper-200 md:w-[calc((100%-1.5rem)/3)] lg:w-[calc((100%-2rem)/3)]"
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
