import {
  Hero,
  Intro,
  Process,
  ServiceMarquee,
  ServicesGrid,
  Showreel,
  StudioShowcase,
  Values,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceMarquee />
      <Showreel />
      <Intro />
      <ServicesGrid />
      <StudioShowcase />
      <Process />
      <Values />
    </>
  );
}
