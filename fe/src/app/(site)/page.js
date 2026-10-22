import {
  Hero,
  Intro,
  Partners,
  Process,
  ServicesGrid,
  Showreel,
  Values,
  VideoFocus,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Partners />
      <Showreel />
      <Intro />
      <VideoFocus />
      <ServicesGrid />
      <Process />
      <Values />
    </>
  );
}
