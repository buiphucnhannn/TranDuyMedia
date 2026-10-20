"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";
import { faqs } from "@/data/services";
import { cn } from "@/lib/utils";

/** items: câu hỏi riêng (mặc định: FAQ chung). title: tiêu đề cột trái. */
export function Faq({
  items = faqs,
  // Giữ liền các cụm "khách hàng", "bắt đầu." → không bị tách mỗi chữ một dòng
  title = (
    <>
      Những điều <span className="whitespace-nowrap">khách hàng</span> hay hỏi trước khi{" "}
      <span className="whitespace-nowrap">bắt đầu.</span>
    </>
  ),
  bg = "bg-paper",
}) {
  const [open, setOpen] = useState(0);

  return (
    <section className={cn(bg, "section-y")} data-nav-theme="light">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <SectionHeading
            eyebrow="Câu hỏi thường gặp"
            title={title}
            description="Chưa thấy câu trả lời? Gọi hotline hoặc để lại thông tin, chúng tôi phản hồi trong 24 giờ."
          />
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="reveal" style={{ "--reveal-delay": `${(i % 3) * 70}ms` }}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-medium tracking-tight sm:text-xl">{f.q}</span>
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-all duration-300",
                        isOpen && "rotate-45 bg-navy-900 text-white",
                      )}
                    >
                      <Icon name="plus" className="size-4" />
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <p className="overflow-hidden pr-14 leading-relaxed text-ink-soft">
                      <span className="block pb-6">{f.a}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
