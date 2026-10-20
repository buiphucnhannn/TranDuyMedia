import {
  Hero,
  Intro,
  Partners,
  Process,
  ServiceMarquee,
  ServicesGrid,
  Showreel,
  Values,
  VideoFocus,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceMarquee />
      <Showreel />
      <Intro />
      <VideoFocus />
      <ServicesGrid />
      <Process />
      <Values />
      <Partners />
    </>
  );
}
