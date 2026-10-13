import { Section } from "@/components/ui";
import { CTASection, PageHeader, ProjectGallery } from "@/components/sections";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Dự án",
  description: "Các dự án TVC, video doanh nghiệp, sự kiện và nội dung social tiêu biểu.",
  path: "/du-an",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Dự án tiêu biểu"
        breadcrumb="Dự án"
        description="Một số sản phẩm chúng tôi đã thực hiện cho khách hàng."
      />
      <Section>
        <ProjectGallery />
      </Section>
      <CTASection />
    </>
  );
}
