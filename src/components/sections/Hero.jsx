import Image from "next/image";
import { Icon } from "@/components/icons";
import { Button, Container } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink-950 via-ink-950/80 to-transparent" />

      <Container className="py-28 sm:py-36 lg:py-44">
        <div className="max-w-2xl animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-zinc-300">
            <span className="size-2 animate-pulse rounded-full bg-brand-500" />
            Media Production Agency
          </p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
            Kể câu chuyện thương hiệu bằng <span className="text-brand-500">hình ảnh ấn tượng</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-zinc-300">
            Trần Duy Media đồng hành cùng doanh nghiệp từ ý tưởng đến sản phẩm hoàn chỉnh: TVC,
            video doanh nghiệp, chụp ảnh và nội dung mạng xã hội.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/lien-he" size="lg">
              Bắt đầu dự án
              <Icon name="arrowRight" className="size-5" />
            </Button>
            <Button href="/du-an" variant="outline" size="lg" className="text-white">
              <Icon name="play" className="size-4" />
              Xem dự án
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
