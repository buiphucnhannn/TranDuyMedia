import { Icon } from "@/components/icons";
import { Button, Container } from "@/components/ui";
import { siteConfig } from "@/config/site";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-brand-500 px-6 py-16 text-center text-white sm:px-16">
          <div className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-16 -z-10 size-80 rounded-full bg-brand-700/40" />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Sẵn sàng nâng tầm hình ảnh thương hiệu của bạn?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-50">
            Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết trong 24 giờ.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/lien-he" variant="secondary" size="lg">
              Nhận báo giá
              <Icon name="arrowRight" className="size-5" />
            </Button>
            <Button
              href={siteConfig.contact.phoneHref}
              variant="outline"
              size="lg"
              className="text-white hover:border-white hover:text-white"
            >
              <Icon name="phone" className="size-5" />
              {siteConfig.contact.phone}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
