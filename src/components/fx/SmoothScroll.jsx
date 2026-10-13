"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { emitScroll } from "@/lib/scroll";

/**
 * Cuộn mượt toàn trang (Lenis) — cảm giác chậm, có quán tính.
 * - lerp thấp: trang "đuổi theo" con lăn chậm hơn → mềm, trôi nhẹ.
 * - wheelMultiplier < 1: mỗi nấc cuộn đi quãng ngắn hơn → chậm rãi, dễ ngắm ảnh.
 * - Touch (điện thoại) giữ cuộn native để không bị khựng.
 * Luôn bật (kể cả khi hệ điều hành chọn giảm chuyển động) vì đây là trải nghiệm chủ đích của site.
 */
const CLEAR = 140; // header 84px + 56px thở
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const pageTop = (el) => {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
};
// Khoảng cách từ mép trên khối tới nội dung đầu tiên (bỏ phần tử absolute/ẩn)
function contentTop(el) {
  let node = el;
  for (let i = 0; i < 6; i++) {
    const kids = [...node.children].filter((k) => {
      const cs = getComputedStyle(k);
      return (
        cs.position !== "absolute" &&
        cs.position !== "fixed" &&
        cs.display !== "none" &&
        k.offsetHeight > 0
      );
    });
    if (!kids.length) break;
    if (kids.length === 1) {
      node = kids[0];
      continue;
    }
    return Math.min(...kids.map(pageTop)) - pageTop(el);
  }
  return pageTop(node) - pageTop(el);
}
/**
 * Vị trí "đẹp nhất" khi cuộn tới một khối:
 * - Khối cao đúng 1 màn hình (.screen) → mép trên khối về 0, nhưng giữ nội dung đầu tiên cách mép trên ≥ CLEAR.
 * - Khối khác → nội dung đầu tiên cách mép trên đúng CLEAR.
 */
function scrollToTarget(lenis, el, force = false) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const elTop = pageTop(el);
  const ct = contentTop(el);
  const isScreen = el.classList.contains("screen") || el.id === "top";
  let s = isScreen ? elTop - Math.max(0, CLEAR - ct) : elTop + ct - CLEAR;
  s = Math.max(0, Math.min(s, max));
  lenis.scrollTo(s, { duration: 1.8, easing: easeOutExpo, force });
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06,
      wheelMultiplier: 0.78,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.2,
      easing: easeOutExpo,
      duration: 1.6,
      respectReducedMotion: false,
    });
    window.__lenis = lenis;

    // Báo vị trí mới cho parallax/hero NGAY trong frame Lenis vừa cuộn (không trễ 1 frame)
    lenis.on("scroll", emitScroll);
    window.addEventListener("resize", emitScroll);

    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Cuộn êm tới anchor (#id) kể cả link dạng "/#id".
    // Đăng ký ở pha capture để chạy TRƯỚC handler của <Link> (Next bỏ qua điều hướng khi đã preventDefault)
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href");
      const hashIdx = href.indexOf("#");
      if (hashIdx === -1) return;
      const path = href.slice(0, hashIdx) || window.location.pathname;
      const hash = href.slice(hashIdx);
      const norm = (p) => p.replace(/\/$/, "") || "/";
      if (norm(path) !== norm(window.location.pathname)) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, "", hash);
      // Bấm từ menu mobile: menu đang khoá cuộn → chờ menu đóng rồi mới cuộn. force: không bị Lenis bỏ qua.
      setTimeout(() => scrollToTarget(lenis, target, true), 60);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("resize", emitScroll);
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Đổi trang: về đầu trang ngay; có hash thì cuộn tới section sau khi trang đã hiện
  useEffect(() => {
    if (!window.location.hash) {
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      return;
    }
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    const t = setTimeout(() => {
      if (window.__lenis) scrollToTarget(window.__lenis, target);
      else target.scrollIntoView({ behavior: "smooth" });
    }, 450);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
