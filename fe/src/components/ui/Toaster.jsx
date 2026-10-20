"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons";
import { dismiss, subscribe } from "@/lib/toast";
import { cn } from "@/lib/utils";

const STYLE = {
  success: { icon: "check", tint: "bg-emerald-500", bar: "bg-emerald-500", title: "Thành công" },
  error: { icon: "close", tint: "bg-red-500", bar: "bg-red-500", title: "Có lỗi xảy ra" },
  warning: { icon: "clock", tint: "bg-orange-500", bar: "bg-orange-500", title: "Lưu ý" },
  info: { icon: "sparkle", tint: "bg-sky-500", bar: "bg-sky-500", title: "Thông báo" },
  loading: { icon: null, tint: "bg-white/10", bar: "bg-orange-500", title: "Đang xử lý" },
};

/**
 * Vùng hiển thị toast — portal vào <body>, z-index cao nhất trang (trên header, popup, lightbox,
 * màn hình lỗi). Desktop: góc trên phải · Mobile: trên cùng, giữa màn hình.
 */
export function Toaster() {
  const [list, setList] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => subscribe(setList), []);
  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect

  if (!mounted) return null;
  return createPortal(
    <section
      aria-label="Thông báo"
      className="pointer-events-none fixed inset-x-0 top-0 z-[2147483000] flex flex-col items-center gap-2.5 p-3 sm:inset-x-auto sm:right-0 sm:items-end sm:p-5"
    >
      {list.map((t) => (
        <ToastItem key={`${t.id}-${t.type}`} toast={t} />
      ))}
    </section>,
    document.body,
  );
}

function ToastItem({ toast: t }) {
  const s = STYLE[t.type];
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const remaining = useRef(t.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused || leaving || !Number.isFinite(t.duration)) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => setLeaving(true), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, leaving, t.duration]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => dismiss(t.id), 220);
    return () => clearTimeout(timer);
  }, [leaving, t.id]);

  return (
    <div
      role={t.type === "error" ? "alert" : "status"}
      aria-live={t.type === "error" ? "assertive" : "polite"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      className={cn(
        "pointer-events-auto relative w-full max-w-[380px] overflow-hidden rounded-2xl bg-navy-950/95 text-white shadow-[0_18px_50px_-12px_rgba(7,12,22,0.55)] ring-1 ring-white/10 backdrop-blur-md",
        leaving
          ? "[animation:toastOut_.22s_ease-in_both]"
          : "[animation:toastIn_.38s_cubic-bezier(.22,1,.36,1)_both]",
      )}
    >
      <div className="flex items-start gap-3 py-3.5 pr-3 pl-4">
        <span
          className={cn(
            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
            s.tint,
          )}
        >
          {s.icon ? (
            <Icon name={s.icon} className="size-3.5" strokeWidth={3} />
          ) : (
            <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-left text-sm font-semibold">{t.title ?? s.title}</p>
          {t.message && (
            <p className="mt-0.5 text-left text-[13px] leading-relaxed text-white/70">
              {t.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setLeaving(true)}
          aria-label="Đóng thông báo"
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <Icon name="close" className="size-3.5" />
        </button>
      </div>
      {/* Tiến độ (tác vụ dài) hoặc thời gian còn lại */}
      {t.type === "loading" ? (
        typeof t.progress === "number" && (
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <span
              className="block h-full bg-orange-500 transition-[width] duration-500 ease-out"
              style={{ width: `${Math.round(Math.min(1, Math.max(0, t.progress)) * 100)}%` }}
            />
          </span>
        )
      ) : (
        <span
          aria-hidden="true"
          className={cn("absolute bottom-0 left-0 h-0.5 w-full origin-left opacity-70", s.bar)}
          style={{
            animation: `toastBar ${t.duration}ms linear forwards`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      )}
    </div>
  );
}
