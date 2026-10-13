import { Container } from "@/components/ui";
import { stats } from "@/data/home";

export function StatsSection() {
  return (
    <section className="border-y border-zinc-200 bg-white">
      <Container>
        <dl className="grid grid-cols-2 divide-zinc-200 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-10 text-center">
              <dd className="text-4xl font-extrabold tracking-tight text-brand-500 sm:text-5xl">
                {stat.value}
              </dd>
              <dt className="mt-2 text-sm font-medium text-zinc-600">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
