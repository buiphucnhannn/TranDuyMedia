"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Bản đồ Google Maps nhúng ở footer (dạng embed, không cần API key).
 * iframe khác domain nuốt con lăn chuột → Lenis bị bỏ qua → cuộn nhảy cục. Vì vậy iframe bị khoá
 * (pointer-events: none) cho tới khi người dùng bấm vào bản đồ; rời chuột khỏi bản đồ thì khoá lại.
 */
export function FooterMap() {
  const [active, setActive] = useState(false);
  const { contact } = siteConfig;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapsQuery)}&z=16&hl=vi&output=embed`;

  return (
    <div
      className="relative h-[200px] overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-white/10"
      onMouseLeave={() => setActive(false)}
    >
      <iframe
        src={src}
        title={`Bản đồ đường đến ${siteConfig.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className={cn("size-full", !active && "pointer-events-none")}
      />
      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label="Bấm để tương tác với bản đồ"
          className="group absolute inset-0 flex items-end justify-center p-3"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950/85 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Icon name="mapPin" className="size-3.5" />
            Bấm để kéo / phóng to
          </span>
        </button>
      )}
    </div>
  );
}
