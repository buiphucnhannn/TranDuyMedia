"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Đóng khi bấm ra ngoài. */
function useOutside(ref, open, close) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && close();
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [ref, open, close]);
}

/** Bảng lựa chọn xổ xuống (dùng chung cho Select và LinkInput). */
function Menu({ id, options, active, selected, onPick, onHover, empty }) {
  return (
    <ul
      id={id}
      role="listbox"
      className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-72 [animation:popIn_.18s_ease-out_both] overflow-y-auto overscroll-contain rounded-2xl bg-white p-1.5 shadow-[0_18px_50px_-18px_rgba(10,20,40,0.35)] ring-1 ring-ink/10"
    >
      {options.length === 0 && <li className="px-3 py-2.5 text-sm text-ink-muted">{empty}</li>}
      {options.map((o, i) => {
        const isSel = o.value === selected;
        return (
          <li
            key={o.value || "__none"}
            id={`${id}-${i}`}
            role="option"
            aria-selected={isSel}
            // mousedown: chọn trước khi ô nhập mất focus
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(o);
            }}
            onMouseEnter={() => onHover(i)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
              i === active ? "bg-paper" : "bg-transparent",
            )}
          >
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block truncate text-sm",
                  isSel ? "font-semibold text-ink" : "text-ink-soft",
                  !o.value && "text-ink-muted",
                )}
              >
                {o.label}
              </span>
              {o.sub && (
                <span className="block truncate font-mono text-[11px] text-ink-muted">{o.sub}</span>
              )}
            </span>
            {isSel && (
              <Icon name="check" className="size-4 shrink-0 text-orange-500" strokeWidth={2.5} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Phím ↑ ↓ Enter Esc cho danh sách. */
function useKeys({ open, setOpen, options, active, setActive, onPick }) {
  return (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      const d = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + d + options.length) % Math.max(options.length, 1));
    } else if (e.key === "Enter" && open && options[active]) {
      e.preventDefault();
      onPick(options[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    }
  };
}

/**
 * Ô chọn (thay <select> mặc định của trình duyệt) — cùng kiểu với các ô nhập trong trang quản trị.
 * options: [{ value, label, sub? }]
 */
export function Select({ value, options, onChange, id, placeholder = "Chọn…" }) {
  const listId = useId();
  const root = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const current = options.find((o) => o.value === value);
  useOutside(root, open, () => setOpen(false));

  const pick = (o) => {
    onChange(o.value);
    setOpen(false);
  };
  const onKeyDown = useKeys({ open, setOpen, options, active, setActive, onPick: pick });

  return (
    <div ref={root} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => {
          setActive(Math.max(0, options.indexOf(current)));
          setOpen((v) => !v);
        }}
        onKeyDown={onKeyDown}
        className={cn(
          "flex field items-center gap-3 text-left",
          open && "ring-2 ring-orange-500/30",
        )}
      >
        <span className={cn("min-w-0 flex-1 truncate", !current?.value && "text-ink-muted")}>
          {current?.label ?? placeholder}
        </span>
        <Icon
          name="chevronDown"
          className={cn(
            "size-4 shrink-0 text-ink-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <Menu
          id={listId}
          options={options}
          active={active}
          selected={value}
          onPick={pick}
          onHover={setActive}
        />
      )}
    </div>
  );
}

/**
 * Ô nhập link có gợi ý trang trong website (thay <datalist> mặc định): gõ để lọc, ↑ ↓ Enter để chọn,
 * vẫn nhập tự do được link ngoài https://…
 * pages: [{ value: "/dich-vu/...", label }]
 */
export function LinkInput({ value, onChange, pages, invalid, placeholder }) {
  const listId = useId();
  const root = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  useOutside(root, open, () => setOpen(false));

  const q = value.trim().toLowerCase();
  // Đang là đúng 1 trang gợi ý → vẫn hiện đủ danh sách để đổi nhanh
  const exact = pages.some((p) => p.value === value);
  const options = (
    !q || exact
      ? pages
      : pages.filter((p) => p.value.toLowerCase().includes(q) || p.label.toLowerCase().includes(q))
  ).map((p) => ({ value: p.value, label: p.label, sub: p.value }));

  const pick = (o) => {
    onChange(o.value);
    setOpen(false);
  };
  const onKeyDown = useKeys({ open, setOpen, options, active, setActive, onPick: pick });
  // Mở danh sách: tô sẵn dòng đang chọn (nếu có)
  const openList = () => {
    setActive(
      Math.max(
        0,
        options.findIndex((o) => o.value === value),
      ),
    );
    setOpen(true);
  };

  return (
    <div ref={root} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
        aria-invalid={invalid}
        className="field pr-11"
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        onFocus={openList}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label="Chọn trang trong website"
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) setOpen(false);
          else openList();
        }}
        className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-paper hover:text-ink"
      >
        <Icon
          name="chevronDown"
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <Menu
          id={listId}
          options={options}
          active={active}
          selected={value}
          onPick={pick}
          onHover={setActive}
          empty="Link ngoài — sẽ mở trong tab mới"
        />
      )}
    </div>
  );
}
