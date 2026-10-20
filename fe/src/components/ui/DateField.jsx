"use client";

import { useRef } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** "2026-11-01" → "01/11/2026" */
const toVN = (ymd) => (ymd ? ymd.split("-").reverse().join("/") : "");

/**
 * Ô chọn ngày hiển thị kiểu Việt Nam (dd/mm/yyyy) nhưng vẫn dùng lịch chọn gốc của trình duyệt
 * (dễ dùng trên điện thoại). Ô input date thật nằm trong suốt phủ lên trên để nhận thao tác.
 * value / onChange theo định dạng chuẩn "YYYY-MM-DD".
 */
export function DateField({ label, value, onChange, min, className }) {
  const input = useRef(null);
  const open = () => {
    try {
      input.current?.showPicker();
    } catch {
      input.current?.focus();
    }
  };

  return (
    <div className={cn("relative flex field items-center pt-5", className)}>
      <span className="pointer-events-none absolute top-1.5 left-4 text-[10px] tracking-wider text-ink-muted uppercase max-sm:left-3">
        {label}
      </span>
      <span className={cn("flex-1 truncate tabular-nums", !value && "text-ink-muted")}>
        {value ? toVN(value) : "dd/mm/yyyy"}
      </span>
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Xoá ngày đã chọn"
          className="relative z-10 -mr-1 flex size-7 items-center justify-center rounded-full text-ink-muted transition hover:bg-ink/5 hover:text-ink"
        >
          <Icon name="close" className="size-3.5" />
        </button>
      ) : (
        <Icon name="calendar" className="size-4 text-ink-muted" />
      )}
      <input
        ref={input}
        type="date"
        aria-label={label}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onClick={open}
        className="absolute inset-0 cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
      />
    </div>
  );
}
