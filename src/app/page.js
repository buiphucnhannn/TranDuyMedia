import {
  CTASection,
  Hero,
  PortfolioSection,
  ProcessSection,
  ServicesSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
