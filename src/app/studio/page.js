import Image from "next/image";
import { Icon } from "@/components/icons";
import { CollectionCard } from "@/components/gallery";
import { Container } from "@/components/ui";
import { PageHeader } from "@/components/sections";
import { collections } from "@/data/collections";
import { createMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

// Nền đầu trang: mỗi cột là 1 bối cảnh (3 ảnh), các cột trôi lên/xuống so le
const HEADER_COLUMNS = collections.map((c) =>
  [1, 2, 3].map((k) => c.images[k % c.images.length].src),
);

export const metadata = createMetadata({
  title: "Bối cảnh studio cho thuê",
  description:
    "6 bối cảnh studio chụp ảnh & quay video quảng cáo tại Nhà Bè: phòng vintage xanh rêu, box studio trắng, sân thượng, Giáng sinh, Tết, Trung thu. Thuê theo giờ, đã gồm đèn và đạo cụ.",
  path: "/studio",
  image: "/images/vintage-green/vintage-green-03.jpg",
});

const includes = [
  {
    icon: "sparkle",
    title: "Đèn & phông sẵn sàng",
    desc: "Hệ đèn Godox, softbox, phông trắng liền sàn, reflector.",
  },
  {
    icon: "studio",
    title: "Đạo cụ theo bối cảnh",
    desc: "Nội thất, cây xanh, đạo cụ theo mùa — tự do sử dụng, miễn phí.",
  },
  {
    icon: "clock",
    title: "Thuê theo giờ",
    desc: "Tối thiểu 2 giờ. Đặt trước 1 ngày, xác nhận trong ngày.",
  },
  {
    icon: "camera",
    title: "Ekip hỗ trợ",
    desc: "Có gói kèm kỹ thuật ánh sáng, nhiếp ảnh gia hoặc quay phim.",
  },
];

export default function StudioPage() {
  return (
    <>
      <PageHeader
        title="Bối cảnh studio"
        breadcrumb="Studio"
        crumbs={[{ label: "Studio", href: "/studio" }]}
        eyebrow={`${collections.length} bối cảnh`}
        description="Sáu không gian đã setup sẵn ánh sáng, phông nền và đạo cụ cho chụp ảnh, quay quảng cáo và livestream — chọn bối cảnh, gửi lịch là xong."
        columns={HEADER_COLUMNS}
      />

      <section className="bg-paper section-y" data-nav-theme="light">
        <Container>
          {/* flex-wrap căn giữa: thẻ lẻ ở hàng cuối tự nằm giữa (thẻ đầu rộng 2 cột) */}
          <div className="flex flex-wrap justify-center gap-5">
            {collections.map((c, i) => (
              <CollectionCard
                key={c.slug}
                collection={c}
                index={i}
                size={i === 0 ? "lg" : undefined}
                className={
                  i === 0
                    ? "w-full lg:w-[calc((100%-2.5rem)/3*2+1.25rem)]"
                    : // thẻ 2 (desktop) cao bằng thẻ lớn cùng hàng → đáy thẳng hàng
                      cn(
                        "w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]",
                        i === 1 && "lg:aspect-auto",
                      )
                }
                sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : undefined}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Thuê studio bao gồm — NỀN SÁNG (khác CTA tối cuối trang): ảnh khung ngắm bên trái,
          danh sách đánh số bên phải, dải báo giá cam phía dưới */}
      <section className="bg-white section-y" data-nav-theme="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
            {/* Ảnh khung ngắm */}
            <div className="reveal relative" data-reveal="scale">
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-navy-900 shadow-soft lg:aspect-auto lg:h-[520px]">
                <Image
                  src="/images/bts/bts-07.jpg"
                  alt="Hệ thống đèn Godox và softbox tại studio"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 via-transparent to-navy-950/20" />
                {[
                  "top-5 left-5 border-t-2 border-l-2",
                  "top-5 right-5 border-t-2 border-r-2",
                  "bottom-5 left-5 border-b-2 border-l-2",
                  "bottom-5 right-5 border-b-2 border-r-2",
                ].map((c) => (
                  <span
                    key={c}
                    aria-hidden="true"
                    className={`absolute size-8 border-orange-500 ${c}`}
                  />
                ))}
                <p className="absolute top-9 left-9 flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-white uppercase">
                  <span className="size-2 animate-[introBlink_1s_steps(2,start)_infinite] rounded-full bg-red-500" />
                  Rec · Studio kit
                </p>
              </div>
            </div>

            {/* Danh sách */}
            <div>
              <p className="reveal mb-4 eyebrow">Thuê studio bao gồm</p>
              <h2 className="reveal h-section" style={{ "--reveal-delay": "80ms" }}>
                Đến với ý tưởng, mọi thứ khác đã có sẵn.
              </h2>
              <ol className="mt-8 border-t border-ink/10">
                {includes.map((it, i) => (
                  <li
                    key={it.title}
                    className="reveal group flex items-start gap-5 border-b border-ink/10 py-5"
                    style={{ "--reveal-delay": `${i * 80}ms` }}
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-paper text-navy-900 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      <Icon name={it.icon} className="size-5" />
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold tracking-tight sm:text-xl">{it.title}</h3>
                      <p className="mt-1 leading-relaxed text-ink-soft">{it.desc}</p>
                    </div>
                    <span className="text-2xl h-display text-ink/15 transition-colors duration-300 group-hover:text-orange-500">
                      0{i + 1}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Dải báo giá */}
          <div className="reveal mt-12 flex flex-col gap-5 rounded-3xl bg-orange-500 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                <Icon name="calendar" className="size-5" />
              </span>
              <p className="max-w-2xl text-base leading-relaxed font-medium sm:text-lg">
                Giá thuê theo giờ và gói kèm ekip được báo theo từng bối cảnh. Nhắn lịch mong muốn
                để nhận bảng giá chi tiết trong ngày.
              </p>
            </div>
            <button
              type="button"
              data-booking="cho-thue-studio"
              className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-navy-950 py-1.5 pr-1.5 pl-6 text-sm font-medium text-white transition hover:bg-navy-800 sm:self-auto"
            >
              Nhận bảng giá
              <span className="flex size-9 items-center justify-center rounded-full bg-white text-navy-950 transition-transform group-hover:translate-x-0.5">
                <Icon name="arrowRight" className="size-4" />
              </span>
            </button>
          </div>
        </Container>
      </section>
    </>
  );
}
