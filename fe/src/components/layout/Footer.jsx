import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container, Logo } from "@/components/ui";
import { FooterMap } from "./FooterMap";
import { mainNav, siteConfig } from "@/config/site";
import { services } from "@/data/services";

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

const socialLinks = [
  ["facebook", siteConfig.socials.facebook],
  ["youtube", siteConfig.socials.youtube],
  ["tiktok", siteConfig.socials.tiktok],
];

export function Footer() {
  const { contact } = siteConfig;

  return (
    <footer className="relative bg-navy-950 text-white/60" data-nav-theme="dark">
      {/* Dải CTA lớn trên nền ảnh ghép các bối cảnh studio (public/images/cta-collage.webp — npm run assets) */}
      <div id="lien-he" className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/images/cta-collage.webp"
          alt=""
          fill
          sizes="100vw"
          quality={70}
          className="-z-10 object-cover"
        />
        {/* Phủ tối: đậm bên trái (chữ), nhạt dần sang phải để ảnh còn thấy rõ */}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950 via-navy-950/85 to-navy-950/55" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950/70 via-transparent to-navy-950/70" />
        <Container className="py-20 sm:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* "tiếp theo" luôn đi liền nhau; từ sm ngắt dòng có chủ đích sau "tiếp theo" */}
            <h2 className="text-[2.2rem] h-display text-white text-legible sm:text-5xl lg:text-6xl">
              Bắt đầu dự án <span className="whitespace-nowrap text-orange-500">tiếp theo</span>
              <br className="max-sm:hidden" /> cùng chúng tôi.
            </h2>
            <div className="btn-row flex flex-wrap gap-3 lg:justify-end">
              <button
                type="button"
                data-booking
                className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-sm font-medium text-navy-900 transition hover:bg-paper-100"
              >
                Đặt lịch tư vấn
                <span className="btn-circle flex size-9 items-center justify-center rounded-full bg-orange-500 text-white transition-transform group-hover:translate-x-0.5">
                  <Icon name="arrowRight" className="size-4" />
                </span>
              </button>
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-navy-950/40 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white hover:text-navy-900"
              >
                <Icon name="phone" className="size-4" />
                {contact.phone}
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Desktop: 4 cột rộng theo nội dung, dàn đều (justify-between) → mép trái/phải thẳng hàng với khung
          nội dung các section phía trên, 3 khe giữa các cột bằng nhau */}
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:flex lg:justify-between lg:gap-10">
        <div className="lg:w-[300px] xl:w-[320px]">
          {/* Logo là đường về trang chủ (menu không có mục "Trang chủ") */}
          <Link href="/" aria-label={`${siteConfig.name} – Trang chủ`} className="inline-block">
            <Logo light className="h-16" />
          </Link>
          <p className="mt-5 max-w-sm text-left text-sm leading-relaxed">
            {siteConfig.description}
          </p>
          <ul className="mt-6 flex gap-3">
            {socialLinks.map(([name, href]) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-orange-500 hover:text-white"
                >
                  <Icon name={name} className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Dịch vụ">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/dich-vu/${s.slug}`}
                className="inline-block py-1 transition-colors hover:text-white lg:py-0"
              >
                {s.title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/san-pham"
              className="inline-block py-1 transition-colors hover:text-white lg:py-0"
            >
              Sản phẩm đã thực hiện
            </Link>
          </li>
        </FooterColumn>

        {/* Bản đồ (thay cột Studio) */}
        <div className="lg:w-[340px] xl:w-[380px]">
          <h3 className="text-[11px] font-semibold tracking-eyebrow text-white uppercase">
            Bản đồ
          </h3>
          <div className="mt-5">
            <FooterMap />
          </div>
        </div>

        <FooterColumn title="Liên hệ">
          <li className="flex gap-3">
            <Icon name="mapPin" className="size-5 shrink-0 text-orange-500" />
            <a
              href={contact.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {contact.address}, {contact.city}
            </a>
          </li>
          <li className="flex gap-3">
            <Icon name="phone" className="size-5 shrink-0 text-orange-500" />
            <a href={contact.phoneHref} className="inline-block py-0.5 hover:text-white lg:py-0">
              {contact.phone}
            </a>
          </li>
          <li className="flex gap-3">
            <Icon name="mail" className="size-5 shrink-0 text-orange-500" />
            <a
              href={`mailto:${contact.email}`}
              className="inline-block py-0.5 hover:text-white lg:py-0"
            >
              {contact.email}
            </a>
          </li>
          <li className="flex gap-3">
            <Icon name="clock" className="size-5 shrink-0 text-orange-500" />
            {contact.workingHours}
          </li>
        </FooterColumn>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <p>
            © <CopyrightYear /> {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-3.5 gap-y-1 sm:gap-x-5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1 transition-colors hover:text-white lg:py-0"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="lg:max-w-[300px]">
      <h3 className="text-[11px] font-semibold tracking-eyebrow text-white uppercase">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
