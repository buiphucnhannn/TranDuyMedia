import { cn } from "@/lib/utils";

/**
 * Dải chữ chạy liên tục. items: string[]; một vòng (nửa track) phải dài hơn khung 1920px → lặp 2 lần mỗi nửa.
 */
export function Marquee({
  items,
  duration = "50s",
  reverse = false,
  className,
  itemClassName,
  dotClassName = "bg-orange-500",
}) {
  const half = [...items, ...items];
  const row = [...half, ...half];
  return (
    <div className={cn("marquee overflow-hidden", className)} aria-hidden="true">
      <div className="bleed-cap overflow-hidden">
        <div
          className={cn("marquee-track gap-10", reverse && "reverse")}
          style={{ "--marquee-duration": duration }}
        >
          {row.map((item, i) => (
            <span
              key={i}
              className={cn("flex items-center gap-10 whitespace-nowrap", itemClassName)}
            >
              {item}
              <span className={cn("size-1.5 rounded-full", dotClassName)} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
