import {
  Hero,
  Intro,
  Partners,
  Process,
  Showreel,
  Testimonials,
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
      <Process />
      <Testimonials />
    </>
  );
}
