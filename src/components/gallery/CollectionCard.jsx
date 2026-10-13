import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { cn, pad } from "@/lib/utils";

/**
 * Thẻ bộ sưu tập: ảnh bìa + tên + số ảnh. Hover: ảnh phóng nhẹ, mũi tên trượt.
 * size: "lg" ô rộng (khung 4:3), mặc định khung 3:4 dọc.
 */
export function CollectionCard({ collection: c, index = 0, size, className, sizes }) {
  return (
    <Link
      href={`/studio/${c.slug}`}
      className={cn(
        "group reveal relative block overflow-hidden rounded-2xl bg-navy-900 text-white",
        size === "lg" ? "aspect-4/3" : "aspect-3/4",
        className,
      )}
      style={{ "--reveal-delay": `${(index % 3) * 90}ms` }}
    >
      <Image
        src={c.cover.src}
        alt={c.name}
        fill
        sizes={sizes || "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
        style={{ objectPosition: c.cover.pos }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
      <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-semibold tracking-eyebrow text-white uppercase shadow-[0_6px_18px_-6px_rgba(248,104,8,0.7)]">
        {c.eyebrow}
      </span>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-[11px] tracking-eyebrow text-white/60 uppercase">
            {pad(c.images.length)} ảnh
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{c.name}</h3>
          <p className="mt-1 hidden text-sm text-white/70 sm:block">{c.tagline}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-navy-900 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
          <Icon
            name="arrowRight"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
