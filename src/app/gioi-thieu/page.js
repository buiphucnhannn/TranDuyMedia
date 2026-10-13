import Image from "next/image";
import { Icon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui";
import { CTASection, PageHeader, ProcessSection, StatsSection } from "@/components/sections";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Giới thiệu",
  description: "Câu chuyện, sứ mệnh và đội ngũ của Trần Duy Media.",
  path: "/gioi-thieu",
});

const values = [
  "Sáng tạo trong từng khung hình",
  "Đúng tiến độ, minh bạch chi phí",
  "Thiết bị điện ảnh hiện đại",
  "Đồng hành lâu dài cùng khách hàng",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Về chúng tôi"
        breadcrumb="Giới thiệu"
        description="Đội ngũ trẻ, đam mê và giàu kinh nghiệm trong lĩnh vực sản xuất nội dung hình ảnh."
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
            <Image
              src="/images/about.jpg"
              alt="Đội ngũ Trần Duy Media tại phim trường"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Câu chuyện"
              title="Biến ý tưởng thành những thước phim chạm cảm xúc"
              description="Được thành lập với niềm đam mê kể chuyện bằng hình ảnh, Trần Duy Media đã đồng hành cùng hàng trăm doanh nghiệp, thương hiệu trong và ngoài nước."
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <li key={value} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                    <Icon name="check" className="size-4" strokeWidth={2.5} />
                  </span>
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <StatsSection />
      <ProcessSection />
      <CTASection />
    </>
  );
}
