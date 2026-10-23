import { SmartImage as Image } from "@/components/ui/SmartImage";
import Link from "next/link";
import { ScrollLock } from "@/components/ui/ScrollLock";

const CORNERS = [
  "top-6 left-6 border-t-2 border-l-2 sm:top-10 sm:left-10",
  "top-6 right-6 border-t-2 border-r-2 sm:top-10 sm:right-10",
  "bottom-6 left-6 border-b-2 border-l-2 sm:bottom-10 sm:left-10",
  "bottom-6 right-6 border-b-2 border-r-2 sm:bottom-10 sm:right-10",
];

/**
 * Màn hình lỗi toàn trang (404, 403…) theo phong cách khung ngắm máy quay của website:
 * nền tối + ảnh hậu trường mờ, 4 góc khung ngắm, đèn REC, mã lỗi cỡ lớn kiểu timecode.
 * actions: [{ href, label, primary? }]
 *
 * Luôn là lớp phủ CỐ ĐỊNH toàn màn hình → dù lỗi xảy ra ở trang con bên trong website
 * (/san-pham/xyz, có header & footer) hay ngoài cùng, giao diện 404/403 vẫn giống hệt nhau.
 */
export function ErrorScreen({ code, eyebrow, title, description, actions = [], children }) {
  return (
    <div
      role="main"
      className="grain fixed inset-0 isolate z-[250] flex items-center justify-center overflow-y-auto bg-navy-950 px-6 py-24 text-white"
    >
      <ScrollLock />
      <Image
        src="/images/bts/bts-05.webp"
        alt=""
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover opacity-20 grayscale"
      />
      <div className="absolute inset-0 -z-10 bg-radial from-navy-950/40 via-navy-950/85 to-navy-950" />

      {CORNERS.map((c) => (
        <span key={c} aria-hidden="true" className={`absolute size-8 border-white/30 ${c}`} />
      ))}
      <div
        aria-hidden="true"
        className="absolute top-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-white/50 uppercase sm:top-12"
      >
        <span className="size-2 animate-[introBlink_1s_steps(2,start)_infinite] rounded-full bg-red-500" />
        Rec - Error {code}
      </div>

      <div className="flex max-w-xl flex-col items-center text-center">
        <Link href="/" aria-label="Tran Duy Media — Trang chủ" className="mb-10 block">
          <Image
            src="/images/brand/logo-light.webp"
            alt="Tran Duy Media"
            width={989}
            height={768}
            sizes="90px"
            className="h-14 w-auto"
          />
        </Link>
        <p className="font-mono text-[clamp(4.5rem,14vw,8rem)] leading-none font-bold tracking-tight text-orange-500 tabular-nums">
          {code}
        </p>
        {eyebrow && (
          <p className="mt-6 text-[11px] font-semibold tracking-eyebrow text-white/50 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-3xl h-display text-balance sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-lg text-center text-base leading-relaxed text-balance text-white/65">
            {description}
          </p>
        )}
        {children}
        {actions.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={
                  a.primary
                    ? "group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-sm font-semibold text-ink transition hover:bg-paper-100"
                    : "inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white hover:text-ink"
                }
              >
                {a.label}
                {a.primary && (
                  <span className="flex size-9 items-center justify-center rounded-full bg-orange-500 text-white transition-transform group-hover:translate-x-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
