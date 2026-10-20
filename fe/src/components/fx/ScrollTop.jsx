"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";

// Nút cuộn lên đầu trang (góc trái dưới), hiện sau khi cuộn qua hero.
export function ScrollTop() {
  const [show, setShow] = useState(false);

  // Kênh scroll chung (đồng bộ Lenis); chỉ setState khi trạng thái thực sự đổi
  useEffect(() => {
    let last = null;
    return subscribeScroll(() => {
      const next = window.scrollY > window.innerHeight * 0.8;
      if (next !== last) setShow((last = next));
    });
  }, []);

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Lên đầu trang"
      className={cn(
        "fixed bottom-3 left-3 z-40 flex size-11 items-center justify-center rounded-full border border-white/60 bg-white/70 text-ink shadow-card backdrop-blur-md transition-all duration-500 hover:bg-navy-900 hover:text-white sm:bottom-4 sm:left-4",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Icon name="arrowUp" className="size-5" />
    </button>
  );
}
