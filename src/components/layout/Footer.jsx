import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container, Logo } from "@/components/ui";
import { mainNav, siteConfig } from "@/config/site";
import { services } from "@/data/home";

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

const socialLinks = Object.entries(siteConfig.socials);

export function Footer() {
  const { contact } = siteConfig;

  return (
    <footer className="bg-ink-950 text-zinc-400">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">{siteConfig.description}</p>
          <ul className="mt-6 flex gap-3">
            {socialLinks.map(([name, href]) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex size-10 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-colors hover:bg-brand-500 hover:text-white"
                >
                  <Icon name={name} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Liên kết">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Dịch vụ">
          {services.map((s) => (
            <li key={s.title}>
              <Link href="/dich-vu" className="transition-colors hover:text-white">
                {s.title}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Liên hệ">
          <li className="flex gap-3">
            <Icon name="mapPin" className="size-5 shrink-0 text-brand-500" />
            {contact.address}
          </li>
          <li className="flex gap-3">
            <Icon name="phone" className="size-5 shrink-0 text-brand-500" />
            <a href={contact.phoneHref} className="hover:text-white">
              {contact.phone}
            </a>
          </li>
          <li className="flex gap-3">
            <Icon name="mail" className="size-5 shrink-0 text-brand-500" />
            <a href={`mailto:${contact.email}`} className="hover:text-white">
              {contact.email}
            </a>
          </li>
          <li className="flex gap-3">
            <Icon name="clock" className="size-5 shrink-0 text-brand-500" />
            {contact.workingHours}
          </li>
        </FooterColumn>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>
            © <CopyrightYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wider text-white uppercase">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
