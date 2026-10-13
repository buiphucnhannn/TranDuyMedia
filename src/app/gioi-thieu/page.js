import Image from "next/image";
import { Button, Container, SectionHeading } from "@/components/ui";
import { PageHeader, Process, Values } from "@/components/sections";
import { btsImages } from "@/data/collections";
import { stats } from "@/data/services";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Về chúng tôi",
  description:
    "Tran Duy Media Studio – 10+ năm gia công trọn gói video thương mại quảng cáo cùng khách hàng, đối tác và doanh nghiệp. Uy tín – Trách nhiệm – Tâm huyết.",
  path: "/gioi-thieu",
  image: "/images/bts/bts-05.jpg",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Về chúng tôi"
        breadcrumb="Về chúng tôi"
        description="Một ekip sản xuất gọn, giàu kinh nghiệm và nói chuyện bằng kết quả kinh doanh của khách hàng."
        image="/images/bts/bts-05.jpg"
      />

      {/* Câu chuyện */}
      <section className="bg-paper section-y" data-nav-theme="light">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading
                eyebrow="Câu chuyện"
                title="Bắt đầu từ chiếc máy quay, lớn lên cùng doanh nghiệp Việt."
              />
              <div
                className="reveal mt-8 space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg"
                style={{ "--reveal-delay": "200ms" }}
              >
                <p>
                  Tran Duy Media Studio ra đời với một niềm tin đơn giản: video thương mại tốt phải
                  bán được hàng. Hơn 10 năm qua, chúng tôi đồng hành gia công trọn gói video quảng
                  cáo cho khách hàng, đối tác và doanh nghiệp — từ startup đang ra mắt sản phẩm đầu
                  tiên đến SME cần một bộ phim năng lực phục vụ đấu thầu.
                </p>
                <p>
                  Studio tại Nhà Bè là nơi mọi thứ diễn ra: phòng quay, hệ đèn, bối cảnh dựng theo
                  mùa và một ekip quen tay với TVC, documentary, phim doanh nghiệp, video sự kiện và
                  chụp ảnh thương mại.
                </p>
              </div>
              <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-ink/10 pt-8">
                {stats.map((s, i) => (
                  <div key={s.label} className="reveal" style={{ "--reveal-delay": `${i * 90}ms` }}>
                    <dd className="text-4xl h-display text-navy-900 sm:text-5xl">{s.value}</dd>
                    <dt className="mt-2 text-sm text-ink-soft">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Cụm ảnh hậu trường — lưới khít nên không dùng parallax từng ảnh (sẽ trượt đè lên nhau) */}
            <div className="grid grid-cols-2 gap-4">
              {btsImages.map((img, i) => (
                <div key={img.src} className={i % 3 === 0 ? "col-span-2" : undefined}>
                  <figure
                    className="reveal relative overflow-hidden rounded-2xl bg-paper-200 shadow-card"
                    data-reveal="scale"
                    style={{ "--reveal-delay": `${(i % 2) * 100}ms` }}
                  >
                    <div className={i % 3 === 0 ? "aspect-video" : "aspect-square"}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: img.pos }}
                      />
                    </div>
                    <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-950/80 to-transparent p-4 text-xs text-white/90">
                      {img.alt}
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Values />
      <Process />

      <section className="bg-paper section-y" data-nav-theme="light">
        <Container className="text-center">
          <SectionHeading
            align="center"
            eyebrow="Hợp tác"
            title="Bạn có một câu chuyện cần kể?"
            description="Gửi brief hoặc chỉ cần một ý tưởng thô — chúng tôi sẽ giúp bạn hình dung nó thành video."
          />
          <div
            className="reveal mt-8 flex flex-wrap justify-center gap-3"
            style={{ "--reveal-delay": "240ms" }}
          >
            <Button pill data-booking>
              Đặt lịch tư vấn
            </Button>
            <Button href="/#lien-he" variant="outline">
              Trang liên hệ
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
