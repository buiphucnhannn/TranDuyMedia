"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Lightbox } from "@/components/ui";
import { cn, pad } from "@/lib/utils";

// Kích thước ô theo thứ tự (lưới 4 cột): to · nhỏ · cao · nhỏ · nhỏ · rộng · nhỏ → kín 3 hàng
const SPANS = ["col-span-2 row-span-2", "", "row-span-2", "", "", "col-span-2", ""];

/**
 * Lưới ảnh bento (ô to nhỏ xen kẽ, kín khung) — gọn hơn nhiều so với lưới ảnh dọc đều nhau.
 * Rê chuột: ảnh phóng nhẹ, hiện số thứ tự & biểu tượng phóng to. Bấm: xem lớn (lightbox).
 * images: [src, ...] — tối đa 7 ảnh.
 */
export function BentoGallery({ images, name }) {
  const [idx, setIdx] = useState(null);
  const list = images.slice(0, SPANS.length);

  return (
    <>
      <div className="grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4 lg:auto-rows-[230px] lg:gap-4">
        {list.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`${name} — ảnh ${i + 1}`}
            className={cn(
              "group reveal relative overflow-hidden rounded-2xl bg-paper-200",
              SPANS[i],
            )}
            style={{ "--reveal-delay": `${(i % 4) * 80}ms` }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-navy-950/0 transition-colors duration-500 group-hover:bg-navy-950/30" />
            <span className="absolute top-3 left-3 rounded-full bg-navy-950/75 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white tabular-nums opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {pad(i + 1)}
            </span>
            <span className="absolute right-3 bottom-3 flex size-10 scale-75 items-center justify-center rounded-full bg-white text-navy-900 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <Icon name="expand" className="size-4" />
            </span>
          </button>
        ))}
      </div>
      <Lightbox
        images={list.map((src, i) => ({ src, alt: `${name} — ${pad(i + 1)}` }))}
        index={idx}
        onClose={() => setIdx(null)}
        onChange={setIdx}
      />
    </>
  );
}
