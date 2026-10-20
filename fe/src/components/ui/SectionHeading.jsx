import { cn } from "@/lib/utils";

/**
 * Tiêu đề khối: eyebrow cam + tiêu đề lớn + mô tả. Mặc định căn trái (kiểu Squarespace).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  as: Tag = "h2",
  className,
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="reveal mb-4 eyebrow">{eyebrow}</p>}
      <Tag
        className={cn("reveal h-section text-balance", light ? "text-white" : "text-ink")}
        style={{ "--reveal-delay": "80ms" }}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "reveal mt-5 max-w-2xl text-base leading-relaxed sm:text-lg",
            light ? "text-white/70" : "text-ink-soft",
            align === "center" && "mx-auto",
          )}
          style={{ "--reveal-delay": "160ms" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
