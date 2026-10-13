import { cn } from "@/lib/utils";
import { Container } from "./Container";

const tones = {
  light: "bg-white text-ink-900",
  muted: "bg-zinc-50 text-ink-900",
  dark: "bg-ink-950 text-white",
};

export function Section({ id, tone = "light", className, containerClassName, children }) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
