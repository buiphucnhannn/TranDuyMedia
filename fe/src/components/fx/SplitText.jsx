"use client";

import { useEffect, useRef } from "react";
import { revealElement } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

/**
 * Tách tiêu đề thành từng từ và hiện dần kiểu blur-in.
 * - Mặc định: tự chạy khi cuộn tới (qua useReveal).
 * - manual + visible: tự điều khiển thời điểm (vd. hero chờ ảnh tải xong).
 * - accent: phần chữ được tô màu/in nghiêng (phải là chuỗi con của text).
 * - breakBefore: từ cần xuống dòng trước nó (mặc định chỉ từ sm trở lên; breakMobile → mọi màn hình).
 * - keep: các cụm từ ghép không được tách ra 2 dòng (vd ["thương hiệu", "điện ảnh"]).
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
  breakMobile = false,
  keep = [],
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
  const all = text.split(" ").filter(Boolean);
  // Vị trí (theo thứ tự từ trong toàn câu) cần ngắt dòng trước nó
  const breakIdx = breakBefore ? all.indexOf(breakBefore) : -1;
  // Cụm từ ghép giữ liền: vị trí từ đầu cụm → số từ trong cụm
  const groupAt = new Map();
  keep.forEach((phrase) => {
    const pw = phrase.split(" ");
    for (let k = 0; k + pw.length <= all.length; k++)
      if (pw.every((w, j) => all[k + j] === w)) groupAt.set(k, pw.length);
  });

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
        // Khoảng trắng đặt NGOÀI các khối inline-block (khoảng trắng cuối khối bị trình duyệt bỏ)
        const isLast = (wi) => wi === words.length - 1 && pi === parts.length - 1;
        const unit = (w, wi) => (
          <span key={wi} className="split-unit" style={{ "--i": i++ }}>
            {w}
          </span>
        );
        const out = [];
        for (let wi = 0; wi < words.length;) {
          if (i === breakIdx)
            out.push(<br key={`br${wi}`} className={breakMobile ? undefined : "max-sm:hidden"} />);
          const len = Math.min(groupAt.get(i) || 1, words.length - wi);
          if (len > 1) {
            out.push(
              <span key={`g${wi}`} className="whitespace-nowrap">
                {words
                  .slice(wi, wi + len)
                  .flatMap((w, k) => (k ? [" ", unit(w, wi + k)] : [unit(w, wi + k)]))}
              </span>,
            );
          } else out.push(unit(words[wi], wi));
          wi += len;
          if (!isLast(wi - 1)) out.push(" ");
        }
        return (
          <span key={pi} className={cn(p.accent && accentClass)} aria-hidden="true">
            {p.accent && breakBeforeAccent && <br />}
            {out}
          </span>
        );
      })}
    </Tag>
  );
}
