import { CTASection, PageHeader, ProcessSection, ServicesSection } from "@/components/sections";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Dịch vụ",
  description:
    "Sản xuất video, TVC quảng cáo, chụp ảnh thương mại, nội dung mạng xã hội, flycam và hậu kỳ.",
  path: "/dich-vu",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Dịch vụ của chúng tôi"
        breadcrumb="Dịch vụ"
        description="Giải pháp hình ảnh trọn gói, linh hoạt theo mục tiêu và ngân sách của bạn."
      />
      <ServicesSection showHeading={false} />
      <ProcessSection />
      <CTASection />
    </>
  );
}
