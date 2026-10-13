"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { lockScroll } from "@/lib/utils";
import { BookingForm } from "./BookingForm";

const bullets = [
  "Phản hồi trong 24 giờ làm việc",
  "Dự toán chi tiết theo hạng mục",
  "Tư vấn định dạng phù hợp từng kênh",
];

/**
 * Popup đặt lịch dùng chung toàn site.
 * Mở bằng bất kỳ phần tử nào có thuộc tính data-booking (giá trị tuỳ chọn = slug dịch vụ để chọn sẵn).
 */
export function BookingModal() {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState("");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest("[data-booking]");
      if (!el) return;
      e.preventDefault();
      setPreset(el.getAttribute("data-booking") || "");
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, close]);

  if (!open) return null;

  const quick = [
    { href: siteConfig.socials.messenger, label: "Messenger", icon: "messenger", ext: true },
    { href: siteConfig.socials.zalo, label: "Zalo", icon: "zalo", ext: true },
    { href: siteConfig.contact.phoneHref, label: siteConfig.contact.phone, icon: "phone" },
  ];

  return (
    <div
      className="fixed inset-0 z-150 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Đặt lịch tư vấn"
    >
      <div
        className="absolute inset-0 [animation:fadeIn_.4s_ease-out_both] bg-navy-950/75 backdrop-blur-sm"
        onClick={close}
      />

      <div className="relative grid max-h-[92svh] w-full max-w-[980px] [animation:popIn_.55s_cubic-bezier(.22,1,.36,1)_both] overflow-hidden rounded-t-[1.75rem] bg-paper shadow-soft sm:rounded-[1.75rem] lg:grid-cols-[0.42fr_0.58fr]">
        {/* Cột ảnh (desktop) */}
        <div className="relative hidden lg:block">
          <Image src="/images/bts/bts-05.jpg" alt="" fill sizes="420px" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-950/30 to-navy-950/10" />
          <div className="absolute inset-x-0 bottom-0 px-8 pt-8 pb-10 text-white">
            <p className="text-[1.75rem] h-display">
              Kể chuyện thương hiệu <span className="text-orange-500">bằng hình ảnh.</span>
            </p>
            <ul className="mt-5 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[13px] text-white/85">
                  <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-orange-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cột form — data-lenis-prevent: Lenis không chặn cuộn bên trong popup */}
        <div
          data-lenis-prevent
          className="relative no-scrollbar overflow-y-auto overscroll-contain px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-9 sm:py-8"
        >
          <span
            aria-hidden="true"
            className="mx-auto mb-4 block h-1 w-10 rounded-full bg-ink/15 sm:hidden"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Đóng"
            className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full text-ink/70 transition hover:bg-ink/5 hover:text-ink sm:top-4 sm:right-4"
          >
            <Icon name="close" className="size-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <Logo className="h-12" />
            <h3 className="mt-3 text-[1.6rem] h-display text-ink sm:text-[2rem]">
              Đặt lịch tư vấn miễn phí
            </h3>
            <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink-soft">
              Để lại thông tin, chúng tôi liên hệ lại trong 24 giờ để trao đổi ý tưởng và gửi dự
              toán.
            </p>
          </div>

          <div className="mt-5 sm:mt-6">
            <BookingForm preset={preset} compact />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-ink/10 pt-5 text-[12px] text-ink-muted">
            <span>Hoặc liên hệ trực tiếp:</span>
            {quick.map(({ href, label, icon, ext }) => (
              <a
                key={label}
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-ink/80 transition hover:text-ink"
              >
                <Icon name={icon} className={icon === "zalo" ? "size-5" : "size-4"} /> {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
