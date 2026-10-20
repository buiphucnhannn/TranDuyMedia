"use client";

import { useEffect } from "react";

/** Khoá cuộn trang phía sau khi đang hiển thị một lớp phủ toàn màn hình (vd. trang 404 trong website). */
export function ScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      html.style.overflow = prev;
      window.__lenis?.start();
    };
  }, []);
  return null;
}
