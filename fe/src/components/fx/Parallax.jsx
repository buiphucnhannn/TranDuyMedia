"use client";

import { useEffect, useRef } from "react";
import { onLayoutChange, pageTop, subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * Parallax nhẹ theo vị trí trong viewport.
 * speed > 0: phần tử di chuyển chậm hơn trang (cảm giác chiều sâu).
 * Vị trí phần tử được đo sẵn (chỉ đo lại khi bố cục đổi); mỗi frame cuộn chỉ tính toán + ghi transform,
 * đồng bộ với Lenis qua subscribeScroll → không trễ frame, không ép tính lại bố cục.
 */
export function Parallax({
  speed = 0.12,
  className = "",
  children,
  as: Tag = "div",
  desktopOnly = false,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (desktopOnly && !window.matchMedia("(min-width: 1024px)").matches) return;

    let top = 0;
    let height = 0;
    let last = null;
    const update = () => {
      const vh = window.innerHeight;
      const t = top - window.scrollY;
      if (t + height < -200 || t > vh + 200) return;
      const offset = Math.round(-(t + height / 2 - vh / 2) * speed * 10) / 10;
      if (offset === last) return;
      last = offset;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    const offLayout = onLayoutChange(() => {
      top = pageTop(el);
      height = el.offsetHeight;
      update();
    });
    const offScroll = subscribeScroll(update);
    return () => {
      offLayout();
      offScroll();
    };
  }, [speed, desktopOnly]);

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)} {...rest}>
      {children}
    </Tag>
  );
}
