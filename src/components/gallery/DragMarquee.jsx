"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const DRAG_THRESHOLD = 6; // px — di chuyển quá mức này mới tính là KÉO (dưới mức này là BẤM)
const FRICTION = 0.04; // đà sau khi thả: còn lại 4% vận tốc sau mỗi giây (giảm dần mượt)

/**
 * Dải tự trôi ngang vô tận, kéo được bằng chuột / vuốt trên điện thoại / vuốt ngang touchpad.
 * children: 2 bộ nội dung GIỐNG HỆT nhau đặt liền nhau (bộ 2 là bản sao, aria-hidden) — khi trôi hết
 * 1 bộ thì vị trí quay vòng về đầu, mắt không thấy điểm nối.
 *
 * - Rê chuột vào → dừng tự trôi (vẫn kéo được). Focus bàn phím → dừng & đưa thẻ đang focus vào khung.
 * - Phân biệt kéo / bấm: chỉ khi tay di chuyển ngang > DRAG_THRESHOLD mới là kéo; lúc đó cú click
 *   ngay sau khi thả bị chặn → không mở nhầm trang. Nhấn-thả tại chỗ vẫn là bấm bình thường.
 * - Thả tay → trượt theo đà rồi chậm dần, sau đó tự trôi tiếp.
 * - Ngoài màn hình → dừng vòng lặp (không tốn CPU).
 */
export function DragMarquee({ speed = 32, className, children }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let x = 0; // vị trí hiện tại (px, âm = đã trôi sang trái)
    let setWidth = 0; // chiều rộng 1 bộ
    let vel = 0; // vận tốc đà (px/s)
    let hover = false;
    let focusPause = false;
    let wheelPauseUntil = 0;
    let drag = null; // { id, startX, startY, baseX, lastX, lastT, active }
    let suppressClick = false;
    let raf = 0;
    let last = 0;
    let visible = false;

    const wrap = () => {
      if (!setWidth) return;
      while (x <= -setWidth) x += setWidth;
      while (x > 0) x -= setWidth;
    };
    const apply = () => {
      wrap();
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    };

    const frame = (t) => {
      raf = 0;
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (!drag?.active) {
        if (Math.abs(vel) > 4) {
          x += vel * dt;
          vel *= Math.pow(FRICTION, dt);
        } else {
          vel = 0;
          if (!hover && !focusPause && t > wheelPauseUntil) x -= speed * dt;
        }
        apply();
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const measure = () => {
      setWidth = track.firstElementChild?.getBoundingClientRect().width || 0;
      apply();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(track.firstElementChild || track);
    measure();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(viewport);
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);

    // ---- Kéo bằng chuột / vuốt cảm ứng ----
    const onDown = (e) => {
      if (e.button !== 0) return;
      drag = {
        id: e.pointerId,
        type: e.pointerType,
        startX: e.clientX,
        startY: e.clientY,
        baseX: x,
        lastX: e.clientX,
        lastT: performance.now(),
        active: false,
      };
      vel = 0;
    };
    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (!drag.active) {
        if (Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
          drag.active = true;
          viewport.setPointerCapture(e.pointerId);
          viewport.style.cursor = "grabbing";
        } else if (Math.abs(dy) > DRAG_THRESHOLD) {
          drag = null; // vuốt dọc → để trang cuộn
          return;
        } else return;
      }
      const now = performance.now();
      const dt = (now - drag.lastT) / 1000;
      if (dt > 0) vel = vel * 0.6 + ((e.clientX - drag.lastX) / dt) * 0.4;
      drag.lastX = e.clientX;
      drag.lastT = now;
      x = drag.baseX + dx;
      apply();
    };
    const onUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.active) {
        suppressClick = true; // chặn cú click ngay sau khi kéo
        setTimeout(() => (suppressClick = false), 0);
        if (performance.now() - drag.lastT > 80) vel = 0; // dừng tay trước khi thả → không trượt
        vel = Math.max(-2500, Math.min(2500, vel));
        viewport.style.cursor = "";
        if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
      }
      drag = null;
    };
    const onClickCapture = (e) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    };
    const onDragStart = (e) => e.preventDefault(); // không kéo ảnh / link thành "ảnh ma"

    // ---- Vuốt ngang touchpad (deltaX) ----
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // lăn dọc → cuộn trang (Lenis)
      e.preventDefault();
      vel = 0;
      x -= e.deltaX;
      wheelPauseUntil = performance.now() + 1200;
      apply();
    };

    // ---- Hover & bàn phím ----
    const onEnter = (e) => e.pointerType === "mouse" && (hover = true);
    const onLeave = (e) => e.pointerType === "mouse" && (hover = false);
    const onFocusIn = (e) => {
      focusPause = true;
      viewport.scrollLeft = 0; // khung overflow-hidden có thể bị trình duyệt tự cuộn khi focus
      const r = e.target.getBoundingClientRect();
      const c = viewport.getBoundingClientRect();
      if (r.left < c.left + 40) x += c.left + 40 - r.left;
      else if (r.right > c.right - 40) x -= r.right - (c.right - 40);
      apply();
    };
    const onFocusOut = (e) => {
      if (!viewport.contains(e.relatedTarget)) focusPause = false;
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    viewport.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("dragstart", onDragStart);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("dragstart", onDragStart);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("focusout", onFocusOut);
    };
  }, [speed]);

  return (
    <div
      ref={viewportRef}
      // Lenis bỏ qua cử chỉ ngang trong dải (để vuốt ngang touchpad lướt thẻ); lăn dọc vẫn cuộn trang
      data-lenis-prevent-horizontal
      // touch-action: pan-y → vuốt dọc trên điện thoại vẫn cuộn trang; vuốt ngang do dải xử lý
      className={cn("cursor-grab touch-pan-y overflow-hidden select-none", className)}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {children}
      </div>
    </div>
  );
}
