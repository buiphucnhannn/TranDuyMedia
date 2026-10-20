import { cn } from "@/lib/utils";

/**
 * Khung nội dung dùng chung. Mặc định "xl" (tối đa 88rem = 1408px) — mọi section trên mọi trang
 * cùng một độ rộng để mép trái/phải thẳng hàng. "md" / "lg" chỉ dùng khi cần khối hẹp có chủ đích.
 */
export function Container({ as: Tag = "div", size = "xl", className, children, ...props }) {
  const widths = { md: "max-w-4xl", lg: "max-w-7xl", xl: "max-w-[88rem]" };
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", widths[size], className)} {...props}>
      {children}
    </Tag>
  );
}
