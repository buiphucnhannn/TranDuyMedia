/**
 * Ghép className, bỏ qua giá trị falsy.
 * @example cn("px-4", isActive && "text-orange-500")
 */
export function cn(...classes) {
  return classes.flat().filter(Boolean).join(" ");
}

/**
 * Khoá / mở cuộn toàn trang (popup, lightbox, menu mobile).
 * Khoá trên <html> vì html có overflow-x: clip nên overflow của body không truyền lên viewport.
 * Đếm số lần khoá để nhiều lớp phủ lồng nhau không mở nhầm.
 */
let lockCount = 0;
export function lockScroll(lock) {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount + (lock ? 1 : -1));
  const locked = lockCount > 0;
  const html = document.documentElement;
  if (locked) {
    const sbw = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = sbw + "px";
    window.__lenis?.stop();
  } else {
    html.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    window.__lenis?.start();
  }
}

/** Số thứ tự 2 chữ số: 1 → "01" */
export const pad = (n) => String(n).padStart(2, "0");
