"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Button, Container, Logo } from "@/components/ui";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Khoá cuộn trang khi mở menu mobile
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b border-zinc-200/80 bg-white/90 backdrop-blur-md" : "bg-white",
      )}
    >
      <Container className="flex h-16 items-center justify-between lg:h-20">
        <Logo />

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive(item.href) ? "text-brand-500" : "text-zinc-600 hover:text-ink-950",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button href="/lien-he" size="sm">
            Nhận báo giá
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          className="-mr-2 rounded-lg p-2 text-ink-950 lg:hidden"
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </Container>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 bg-white lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <Container as="nav" aria-label="Điều hướng mobile" className="py-6">
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-lg font-medium",
                    isActive(item.href) ? "bg-brand-50 text-brand-600" : "text-ink-900",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="/lien-he" className="mt-6 w-full" onClick={() => setOpen(false)}>
            Nhận báo giá
          </Button>
        </Container>
      </div>
    </header>
  );
}
