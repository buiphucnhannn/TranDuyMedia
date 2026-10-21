"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { formatDateTime, formatDay, formatFullDateTime, formatPhone, serviceLabel } from "./format";
import { StatusSegmented } from "./StatusControl";

/** Ô thông tin: icon + nhãn nhỏ + giá trị. wide = chiếm trọn chiều ngang lưới. */
const Field = ({ icon, label, children, wide = false }) => (
  <div
    className={cn(
      "flex gap-3.5 rounded-2xl bg-paper/60 p-4 ring-1 ring-ink/5",
      wide && "sm:col-span-2",
    )}
  >
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-ink-soft ring-1 ring-ink/5">
      <Icon name={icon} className="size-4" />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold tracking-eyebrow text-ink-muted uppercase">{label}</p>
      <div className="mt-1 text-sm font-medium break-words text-ink">{children}</div>
    </div>
  </div>
);

const empty = <span className="font-normal text-ink-muted">Không có</span>;

/** Popup chi tiết đầy đủ một yêu cầu đặt lịch + đổi trạng thái + liên hệ nhanh. */
export function BookingDetail({ booking: b, onClose, onStatus, saving }) {
  const panel = useRef(null);

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    panel.current?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  const zalo = `https://zalo.me/${b.phone}`;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 [animation:fadeIn_.25s_ease-out_both] bg-navy-950/60 backdrop-blur-sm"
      />
      <div
        ref={panel}
        tabIndex={-1}
        className="relative flex max-h-[92svh] w-full max-w-2xl [animation:popIn_.4s_cubic-bezier(.22,1,.36,1)_both] flex-col overflow-hidden rounded-3xl bg-white shadow-soft outline-none sm:rounded-3xl"
      >
        {/* Đầu popup */}
        <div className="flex items-start gap-4 border-b border-ink/10 px-6 pt-6 pb-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy-950 text-lg font-bold text-white uppercase">
            {b.name.trim().split(" ").at(-1)?.[0]}
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="booking-title" className="truncate text-xl font-bold tracking-tight text-ink">
              {b.name}
            </h2>
            <p className="mt-0.5 text-left text-sm text-ink-soft">
              Gửi lúc {formatDateTime(b.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <p className="mb-2 text-[11px] font-semibold tracking-eyebrow text-ink-muted uppercase">
            Trạng thái xử lý
          </p>
          <StatusSegmented value={b.status} onChange={onStatus} disabled={saving} />
          {b.statusChangedAt && (
            <p className="mt-2 text-left text-xs text-ink-muted">
              Cập nhật lần cuối: {formatDateTime(b.statusChangedAt)}
            </p>
          )}

          {/* Lưới 2 cột: thông tin liên hệ → nhu cầu → thời gian; mô tả trải trọn chiều ngang */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Field icon="user" label="Họ và tên">
              {b.name}
            </Field>
            <Field icon="phone" label="Số điện thoại / Zalo">
              <a href={`tel:${b.phone}`} className="tabular-nums hover:text-orange-600">
                {formatPhone(b.phone)}
              </a>
            </Field>
            <Field icon="film" label="Dịch vụ quan tâm">
              {b.service ? serviceLabel(b.service) : empty}
            </Field>
            <Field icon="wallet" label="Ngân sách dự kiến">
              {b.budget ?? empty}
            </Field>
            <Field icon="calendar" label="Ngày mong muốn">
              <span className="tabular-nums">{formatDay(b.date) ?? empty}</span>
            </Field>
            <Field icon="clock" label="Thời gian gửi">
              <span className="tabular-nums">{formatFullDateTime(b.createdAt)}</span>
            </Field>
            <Field icon="note" label="Mô tả" wide>
              {b.note ? (
                <p className="text-left leading-relaxed font-normal whitespace-pre-wrap text-ink-soft">
                  {b.note}
                </p>
              ) : (
                empty
              )}
            </Field>
          </div>
          <p className="mt-4 text-center font-mono text-[11px] text-ink-muted">
            Mã yêu cầu: {b.id}
          </p>
        </div>

        {/* Liên hệ nhanh */}
        <div className="grid grid-cols-2 gap-2.5 border-t border-ink/10 bg-paper/60 px-6 py-4">
          <a
            href={`tel:${b.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-950 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            <Icon name="phone" className="size-4" />
            Gọi điện
          </a>
          <a
            href={zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white py-3 text-sm font-semibold text-ink transition hover:border-navy-900"
          >
            <Icon name="zalo" className="size-5" />
            Nhắn Zalo
          </a>
        </div>
        <span className="sr-only">{siteConfig.name}</span>
      </div>
    </div>
  );
}
