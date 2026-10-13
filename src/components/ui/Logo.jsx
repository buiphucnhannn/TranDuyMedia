import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} – Trang chủ`}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image src="/images/logo-mark.svg" alt="" width={36} height={36} priority />
      <span className="leading-none">
        <span
          className={cn(
            "block text-base font-extrabold tracking-tight",
            light ? "text-white" : "text-ink-950",
          )}
        >
          TRẦN DUY
        </span>
        <span className="block text-[0.65rem] font-semibold tracking-[0.35em] text-brand-500">
          MEDIA
        </span>
      </span>
    </Link>
  );
}
