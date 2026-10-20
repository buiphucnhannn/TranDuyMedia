"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Hộp thoại xác nhận dùng chung (xoá, huỷ…).
 * - Nút "Huỷ" được focus sẵn → lỡ nhấn Enter cũng không thực hiện thao tác nguy hiểm.
 * - Esc / bấm ra ngoài để đóng (trừ khi đang xử lý).
 * tone: "danger" (đỏ) | "default"
 */
export function ConfirmDialog({
  open,
  title,
  description,
  children,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ",
  tone = "danger",
  icon = tone === "danger" ? "trash" : "alert",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const cancelBtn = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelBtn.current?.focus();
    const esc = (e) => e.key === "Escape" && !loading && onCancel();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, loading, onCancel]);

  if (!open) return null;
  const danger = tone === "danger";

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div
        onClick={() => !loading && onCancel()}
        className="absolute inset-0 [animation:fadeIn_.2s_ease-out_both] bg-navy-950/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md [animation:popIn_.35s_cubic-bezier(.22,1,.36,1)_both] rounded-3xl bg-white p-6 text-center shadow-soft sm:p-8">
        <span
          className={cn(
            "mx-auto flex size-14 items-center justify-center rounded-full ring-8",
            danger
              ? "bg-red-50 text-red-600 ring-red-50/60"
              : "bg-orange-50 text-orange-600 ring-orange-50/60",
          )}
        >
          <Icon name={icon} className="size-6" />
        </span>
        <h2 id="confirm-title" className="mt-6 text-xl font-bold tracking-tight text-ink">
          {title}
        </h2>
        <div id="confirm-desc" className="mt-2 text-center text-sm leading-relaxed text-ink-soft">
          {description}
        </div>
        {children}
        <div className="mt-7 grid grid-cols-2 gap-2.5">
          <button
            ref={cancelBtn}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-ink/15 py-3 text-sm font-semibold text-ink transition hover:bg-paper disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition disabled:cursor-wait disabled:opacity-80",
              danger ? "bg-red-600 hover:bg-red-700" : "bg-navy-950 hover:bg-navy-800",
            )}
          >
            {loading && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {loading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
