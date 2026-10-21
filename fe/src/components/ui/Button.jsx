import Link from "next/link";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

const styles = {
  primary: "bg-navy-900 text-white shadow-card hover:bg-navy-700 hover:shadow-soft",
  accent: "bg-orange-500 text-white shadow-card hover:bg-orange-600",
  outline:
    "border border-ink/20 bg-transparent text-ink hover:border-navy-900 hover:bg-navy-900 hover:text-white",
  light:
    "border border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-ink",
  white: "bg-white text-ink hover:bg-paper-100",
  ghost: "text-current hover:bg-current/5",
};

const sizes = {
  sm: "px-5 py-2.5 text-[13px]",
  md: "px-7 py-3.5 text-sm",
  lg: "px-8 py-4 text-sm",
};

/**
 * Nút dùng chung.
 * - href → <Link>; external → <a target=_blank>; không có href → <button>
 * - arrow: mũi tên trượt khi hover
 * - pill: chữ + vòng tròn mũi tên (kiểu Squarespace / ButStudio)
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  pill = false,
  external = false,
  className,
  children,
  ...rest
}) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50";
  const cls = cn(
    base,
    pill ? "py-1.5 pr-1.5 pl-6 text-sm" : sizes[size],
    styles[variant],
    className,
  );
  // Nút trắng (trên nền tối): vòng tròn cam như nút "Đặt lịch" trên header
  const circle =
    variant === "white"
      ? "bg-orange-500 text-white"
      : variant === "primary" || variant === "accent"
        ? "bg-white text-navy-900"
        : "bg-navy-900 text-white";

  const content = (
    <>
      <span className="inline-flex items-center gap-2">{children}</span>
      {pill ? (
        <span
          className={cn(
            "btn-circle flex size-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5",
            circle,
          )}
        >
          <Icon name="arrowRight" className="size-4" />
        </span>
      ) : (
        arrow && (
          <Icon
            name="arrowRight"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        )
      )}
    </>
  );

  if (!href) {
    return (
      <button type="button" className={cls} {...rest}>
        {content}
      </button>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
