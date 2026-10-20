"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, pad } from "@/lib/utils";

const CORNERS = [
  "top-4 left-4 border-t-2 border-l-2",
  "top-4 right-4 border-t-2 border-r-2",
  "bottom-4 left-4 border-b-2 border-l-2",
  "bottom-4 right-4 border-b-2 border-r-2",
];

/**
 * Hạng mục dịch vụ: bên trái danh sách lớn, bên phải khung ảnh "khung ngắm" ghim theo cuộn.
 * Rê chuột / Tab / chạm vào hạng mục → ảnh đổi mờ dần sang ảnh của hạng mục đó, mô tả mở ra.
 * Mobile: mỗi hạng mục hiện ảnh riêng ngay trong danh sách.
 * items: [{ name, desc, image }]
 */
export function ServiceItems({ items }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
      <ol className="border-t border-ink/10">
        {items.map((it, i) => {
          const on = active === i;
          return (
            <li
              key={it.name}
              className="reveal border-b border-ink/10"
              style={{ "--reveal-delay": `${i * 80}ms` }}
            >
              <button
                type="button"
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={on}
                className="group grid w-full grid-cols-[3rem_1fr] gap-4 py-5 text-left sm:grid-cols-[4rem_1fr] sm:py-6"
              >
                <span
                  className={cn(
                    "text-2xl h-display transition-colors duration-500 sm:text-3xl",
                    on ? "text-orange-500" : "text-ink/20",
                  )}
                >
                  {pad(i + 1)}
                </span>
                <span>
                  <span
                    className={cn(
                      "block text-xl font-bold tracking-tight transition-colors duration-500 sm:text-2xl lg:text-[1.75rem]",
                      on ? "text-ink" : "text-ink/45 group-hover:text-ink/70",
                    )}
                  >
                    {it.name}
                  </span>
                  <span
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                      on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-2 leading-relaxed text-ink-soft sm:text-justify">
                        {it.desc}
                      </span>
                      {/* ảnh riêng trên mobile */}
                      <span className="relative mt-4 block aspect-4/3 overflow-hidden rounded-2xl lg:hidden">
                        <Image src={it.image} alt="" fill sizes="90vw" className="object-cover" />
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Khung ảnh ghim (desktop) */}
      <div className="hidden lg:block">
        <div>
          <div
            className="reveal relative aspect-[4/3] overflow-hidden rounded-3xl bg-navy-900 shadow-soft"
            data-reveal="clip"
          >
            {items.map((it, i) => (
              <Image
                key={it.image}
                src={it.image}
                alt=""
                fill
                sizes="45vw"
                className={cn(
                  "object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]",
                  active === i ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            ))}
            <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-transparent to-transparent" />
            {CORNERS.map((c) => (
              <span
                key={c}
                aria-hidden="true"
                className={cn("absolute size-7 border-orange-500", c)}
              />
            ))}
            <div className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-white uppercase">
              <span className="size-2 animate-[introBlink_1s_steps(2,start)_infinite] rounded-full bg-red-500" />
              REC - {pad(active + 1)}/{pad(items.length)}
            </div>
            <p className="absolute inset-x-8 bottom-8 text-2xl font-bold tracking-tight text-white">
              {items[active].name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
