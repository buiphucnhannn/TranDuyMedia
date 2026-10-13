import { Section, SectionHeading } from "@/components/ui";
import { processSteps } from "@/data/home";

export function ProcessSection() {
  return (
    <Section tone="dark">
      <SectionHeading
        eyebrow="Quy trình"
        title="Làm việc rõ ràng, minh bạch"
        description="Quy trình 4 bước giúp dự án luôn đúng tiến độ và đúng kỳ vọng."
      />

      <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((item) => (
          <li key={item.step} className="relative rounded-2xl border border-white/10 p-8">
            <span className="text-5xl font-extrabold text-brand-500/30">{item.step}</span>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-zinc-400">{item.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
