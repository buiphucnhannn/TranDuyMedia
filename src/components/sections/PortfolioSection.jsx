import { Icon } from "@/components/icons";
import { Button, Section, SectionHeading } from "@/components/ui";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function PortfolioSection({ limit = 6 }) {
  return (
    <Section id="du-an">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          align="left"
          eyebrow="Dự án tiêu biểu"
          title="Những sản phẩm chúng tôi tự hào"
        />
        <Button href="/du-an" variant="outline">
          Xem tất cả
          <Icon name="arrowRight" className="size-4" />
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, limit).map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
