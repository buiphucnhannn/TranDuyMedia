import { Icon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui";
import { testimonials } from "@/data/home";

export function TestimonialsSection() {
  return (
    <Section tone="muted">
      <SectionHeading eyebrow="Khách hàng nói gì" title="Được tin tưởng bởi nhiều thương hiệu" />

      <ul className="mt-14 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t) => (
          <li key={t.author}>
            <figure className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
              <Icon name="quote" className="size-8 text-brand-500" />
              <blockquote className="mt-6 flex-1 leading-relaxed text-zinc-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-zinc-100 pt-6">
                <p className="font-semibold">{t.author}</p>
                <p className="text-sm text-zinc-500">{t.role}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
