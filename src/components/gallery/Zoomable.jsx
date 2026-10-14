"use client";

import { createContext, useContext, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Lightbox } from "@/components/ui";
import { cn } from "@/lib/utils";

const OpenContext = createContext(() => {});

/**
 * Nhóm ảnh bấm-để-xem dùng chung 1 lightbox (lướt qua lại trong nhóm).
 * Bố cục do trang tự sắp — đặt <ZoomImage index={i}> ở bất kỳ đâu bên trong.
 * images: [{src, alt}] — thứ tự trong lightbox.
 */
export function ZoomGroup({ images, children }) {
  const [idx, setIdx] = useState(null);
  return (
    <OpenContext.Provider value={setIdx}>
      {children}
      <Lightbox images={images} index={idx} onClose={() => setIdx(null)} onChange={setIdx} />
    </OpenContext.Provider>
  );
}

/** Ảnh phủ kín khung cha (fill) — bấm để mở lightbox tại vị trí `index` của nhóm. */
export function ZoomImage({
  index,
  src,
  alt,
  sizes,
  pos,
  quality = 90,
  className,
  imgClassName,
  children,
}) {
  const open = useContext(OpenContext);
  return (
    <button
      type="button"
      onClick={() => open(index)}
      aria-label={`Xem ảnh: ${alt}`}
      className={cn("group relative block cursor-zoom-in overflow-hidden", className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        className={cn(
          "object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105",
          imgClassName,
        )}
        style={pos ? { objectPosition: pos } : undefined}
      />
      {children}
      <span
        aria-hidden="true"
        className="absolute top-3 right-3 flex size-9 scale-90 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Icon name="expand" className="size-4" />
      </span>
    </button>
  );
}
