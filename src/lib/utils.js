/**
 * Ghép className, bỏ qua giá trị falsy.
 * @example cn("px-4", isActive && "text-brand-500")
 */
export function cn(...classes) {
  return classes.flat().filter(Boolean).join(" ");
}
