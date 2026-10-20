"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hiệu ứng hiện dần khi cuộn tới, cho mọi phần tử .reveal và .split (trừ [data-manual]).
 *
 * Chạy bằng Web Animations API (element.animate) thay vì thêm class: WAAPI chỉ đổi style tính toán,
 * KHÔNG đổi attribute/class trong DOM → không gây hydration mismatch.
 * Trạng thái ẩn ban đầu nằm trong CSS (.reveal, .split .split-unit trong globals.css);
 * animation `fill: "both"` giữ trạng thái hiện sau khi chạy xong.
 * Lưu ý: animation điều khiển `transform` → không đặt .reveal trên phần tử có transform inline
 * (vd. <Parallax>) — bọc .reveal vào phần tử con.
 */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
// Không animate filter: blur — mỗi phần tử mới cuộn tới sẽ tốn GPU làm mờ đúng lúc đang cuộn → giật.
const SHOWN = { opacity: 1, transform: "none" };
const FRAMES = {
  default: [{ opacity: 0, transform: "translateY(26px)" }, SHOWN],
  left: [{ opacity: 0, transform: "translateX(-32px)" }, SHOWN],
  right: [{ opacity: 0, transform: "translateX(32px)" }, SHOWN],
  scale: [{ opacity: 0, transform: "scale(0.94)" }, SHOWN],
  clip: [{ clipPath: "inset(12% 6% 12% 6% round 1.5rem)" }, { clipPath: "inset(0 0 0 0 round 0)" }],
};
const SPLIT_FRAMES = [
  { opacity: 0, transform: "translateY(0.35em)", filter: "blur(8px)" },
  { opacity: 1, transform: "none", filter: "blur(0)" },
];

const SELECTOR = ".reveal, .split:not([data-manual])";
const ms = (cs, name, fallback = 0) => parseFloat(cs.getPropertyValue(name)) || fallback;

export function revealElement(el) {
  if (el.__revealed) return; // thuộc tính JS (expando), không phải attribute → React không thấy
  el.__revealed = true;
  const cs = getComputedStyle(el);

  if (el.classList.contains("split")) {
    const base = ms(cs, "--base");
    const step = ms(cs, "--step", 45);
    el.querySelectorAll(".split-unit").forEach((unit, i) =>
      unit.animate(SPLIT_FRAMES, {
        duration: 700,
        delay: base + i * step,
        easing: EASE,
        fill: "both",
      }),
    );
    return;
  }

  const variant = el.dataset.reveal;
  el.animate(FRAMES[variant] || FRAMES.default, {
    duration: variant === "clip" ? 1200 : 1000,
    delay: ms(cs, "--reveal-delay"),
    easing: EASE,
    fill: "both",
  });
}

export function useReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = [...document.querySelectorAll(SELECTOR)].filter((el) => !el.__revealed);
    if (!("IntersectionObserver" in window)) {
      els.forEach(revealElement);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            revealElement(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -2% 0px" },
    );
    const watched = new WeakSet();
    const watch = (el) => {
      if (el.__revealed || watched.has(el)) return;
      watched.add(el);
      io.observe(el);
    };
    els.forEach(watch);

    // Nội dung tải sau (Suspense/streaming khi chuyển trang) được chèn vào DOM sau lần quét ở trên
    // → theo dõi DOM để bắt cả các .reveal mới, nếu không chúng kẹt ở trạng thái ẩn.
    const mo = new MutationObserver((records) => {
      for (const r of records)
        for (const node of r.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches(SELECTOR)) watch(node);
          node.querySelectorAll(SELECTOR).forEach(watch);
        }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Phần tử vốn display:none có thể hiện ra khi resize mà observer chưa báo → quét tay
    let t;
    const sweep = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.__revealed) return;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) {
          revealElement(el);
          io.unobserve(el);
        }
      });
    };
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(sweep, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);
}
