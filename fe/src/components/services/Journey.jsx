"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui";
import { processSteps } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Quy trình sản xuất 7 bước (nền tối) — theo feedback 09/11: bỏ ảnh, dùng khối NỀN TRƠN đồng nhất cho gọn mắt.
 * Desktop: các cột cùng màu, bước đang chọn nở rộng (rê chuột / chạm / Tab để đổi) và hiện biểu tượng, tên, mô tả;
 * số thứ tự lớn chìm làm điểm nhấn. Bước thu gọn hiện số + tên xoay dọc.
 * Mobile: danh sách dọc có đường nối, số thứ tự và biểu tượng.
 */
export function Journey() {
  const [active, setActive] = useState(0);

  return (
    <section
      data-nav-theme="dark"
      className="grain relative flex screen items-center overflow-hidden bg-navy-950 py-16 text-white"
    >
      <div className="pointer-events-none absolute top-1/3 -left-32 size-[480px] rounded-full bg-orange-500/15 blur-[150px]" />
      <Container className="relative">
        <p className="reveal mb-4 eyebrow">Quy trình sản xuất</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="reveal max-w-xl h-section" style={{ "--reveal-delay": "80ms" }}>
            Bảy bước, từ <span className="whitespace-nowrap">tiếp nhận</span>{" "}
            <span className="whitespace-nowrap text-orange-500">đến bàn giao.</span>
          </h2>
          <p
            className="reveal hidden max-w-xs text-sm text-white/60 lg:block"
            style={{ "--reveal-delay": "200ms" }}
          >
            Rê chuột qua từng bước để xem chúng tôi làm gì ở mỗi giai đoạn.
          </p>
        </div>

        {/* Desktop: các cột nền trơn, cột đang chọn rộng hơn */}
        <div className="reveal mt-10 hidden gap-3 lg:flex" style={{ "--reveal-delay": "250ms" }}>
          {processSteps.map((s, i) => {
            const on = active === i;
            return (
              <button
                key={s.step}
                type="button"
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={on}
                className={cn(
                  "group relative h-[calc(var(--screen)*0.5)] min-h-[360px] overflow-hidden rounded-3xl text-left ring-1 transition-[flex,background-color,box-shadow] duration-[800ms] ease-out",
                  on
                    ? "flex-[4] bg-white/[0.07] ring-orange-500/40"
                    : "flex-1 bg-white/[0.035] ring-white/10 hover:bg-white/[0.06]",
                )}
              >
                {/* Vạch cam trên cùng của bước đang chọn */}
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 origin-left bg-orange-500 transition-transform duration-700",
                    on ? "scale-x-100" : "scale-x-0",
                  )}
                />
                {/* Số thứ tự lớn chìm phía sau (chỉ bước đang chọn) */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -right-2 -bottom-8 text-[11rem] leading-none font-bold tracking-tighter text-white/[0.04] tabular-nums transition-opacity duration-700 select-none xl:text-[13rem]",
                    on ? "opacity-100" : "opacity-0",
                  )}
                >
                  {s.step}
                </span>

                <span
                  className={cn(
                    "absolute top-5 left-5 flex size-11 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors duration-500",
                    on
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-white/25 text-white/70 group-hover:border-white/50",
                  )}
                >
                  {s.step}
                </span>

                {/* Tên bước xoay dọc khi thu gọn */}
                <span
                  className={cn(
                    "absolute bottom-7 left-1/2 -translate-x-1/2 rotate-180 text-lg font-semibold whitespace-nowrap text-white/85 transition-all duration-500 [writing-mode:vertical-rl] xl:text-xl",
                    on ? "pointer-events-none opacity-0" : "opacity-100",
                  )}
                >
                  {s.title}
                </span>

                {/* Nội dung bước đang chọn */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-7 transition-all duration-700 xl:p-8",
                    on ? "translate-y-0 opacity-100 delay-200" : "translate-y-6 opacity-0",
                  )}
                >
                  <Icon name={s.icon} className="size-8 text-orange-500" strokeWidth={1.5} />
                  <p className="mt-5 text-[11px] font-semibold tracking-eyebrow text-white/50 uppercase">
                    Bước {s.step} / {String(processSteps.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 text-3xl font-bold tracking-tight whitespace-nowrap">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile: danh sách dọc có đường nối */}
        <ol className="relative mt-10 space-y-4 border-l border-white/15 pl-8 lg:hidden">
          {processSteps.map((s) => (
            <li key={s.step} className="reveal relative">
              <span className="absolute top-5 -left-[2.55rem] flex size-9 items-center justify-center rounded-full border border-white/40 bg-navy-950 text-xs font-semibold tabular-nums">
                {s.step}
              </span>
              <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <Icon
                    name={s.icon}
                    className="size-6 shrink-0 text-orange-500"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
