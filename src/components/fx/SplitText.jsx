"use client";

import { Fragment, useEffect, useRef } from "react";
import { revealElement } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

/**
 * Tách tiêu đề thành từng từ và hiện dần kiểu blur-in.
 * - Mặc định: tự chạy khi cuộn tới (qua useReveal).
 * - manual + visible: tự điều khiển thời điểm (vd. hero chờ ảnh tải xong).
 * - accent: phần chữ được tô màu/in nghiêng (phải là chuỗi con của text).
 * - breakBefore: từ cần xuống dòng trước nó (chỉ từ sm trở lên; mobile để trình duyệt tự ngắt).
 */
export function SplitText({
  as: Tag = "h2",
  text,
  accent,
  accentClass = "text-orange-500",
  className,
  step = 45,
  baseDelay = 0,
  manual = false,
  visible = false,
  breakBeforeAccent = false,
  breakBefore,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (manual && visible && ref.current) revealElement(ref.current);
  }, [manual, visible]);

  const accentStart = accent ? text.indexOf(accent) : -1;
  const parts =
    accentStart >= 0
      ? [
          { t: text.slice(0, accentStart), accent: false },
          { t: accent, accent: true },
          { t: text.slice(accentStart + accent.length), accent: false },
        ]
      : [{ t: text, accent: false }];
  // Vị trí (theo thứ tự từ trong toàn câu) cần ngắt dòng trước nó
  const breakIdx = breakBefore ? text.split(" ").filter(Boolean).indexOf(breakBefore) : -1;

  let i = 0;
  return (
    <Tag
      ref={ref}
      className={cn("split", className)}
      style={{ "--step": `${step}ms`, "--base": `${baseDelay}ms` }}
      data-manual={manual ? "" : undefined}
      aria-label={text}
    >
      {parts.map((p, pi) => {
        const words = p.t.split(" ").filter(Boolean);
        return (
          <span key={pi} className={cn(p.accent && accentClass)} aria-hidden="true">
            {p.accent && breakBeforeAccent && <br />}
            {words.map((w, wi) => {
              const n = i++;
              return (
                <Fragment key={wi}>
                  {n === breakIdx && <br className="max-sm:hidden" />}
                  <span className="split-unit" style={{ "--i": n }}>
                    {w}
                    {wi < words.length - 1 || pi < parts.length - 1 ? " " : ""}
                  </span>
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
