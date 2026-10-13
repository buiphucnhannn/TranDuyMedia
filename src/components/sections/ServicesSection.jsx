import { Icon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui";
import { services } from "@/data/home";

export function ServicesSection({ showHeading = true }) {
  return (
    <Section id="dich-vu" tone="muted">
      {showHeading && (
        <SectionHeading
          eyebrow="Dịch vụ"
          title="Giải pháp media toàn diện"
          description="Một đầu mối cho mọi nhu cầu hình ảnh và video của doanh nghiệp bạn."
        />
      )}

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li
            key={service.title}
            className="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
              <Icon name={service.icon} />
            </div>
            <h3 className="mt-6 text-lg font-semibold">{service.title}</h3>
            <p className="mt-3 leading-relaxed text-zinc-600">{service.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
