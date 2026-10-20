"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Lightbox } from "@/components/ui";
import { cn, pad } from "@/lib/utils";

const MIN_RATIO = 0.5; // ảnh dọc rất cao (≈ 1:2) — hẹp hơn nữa sẽ cắt nhẹ cho gọn hàng
const MAX_RATIO = 2.4; // ảnh ngang / panorama rất dài
const VIDEO_RATIO = 16 / 9;
const FILL_LAST_ROW = 0.7; // hàng cuối đã lấp ≥ 70% chiều ngang → giãn cho kín luôn

/**
 * Thư viện ảnh kiểu "hàng đều" (justified rows, như Google Photos): mỗi hàng lấp kín chiều ngang,
 * mọi ảnh trong hàng cao bằng nhau và giữ ĐÚNG TỈ LỆ GỐC — ảnh dọc, ngang, vuông trộn lẫn vẫn ngay
 * ngắn, thứ tự đọc từ trái sang phải. Chỉ dùng CSS flex:
 * - flex-basis = tỉ lệ × chiều cao mục tiêu (--row-h), flex-grow = tỉ lệ → phần dư của hàng chia
 *   theo tỉ lệ nên các ảnh luôn cao bằng nhau;
 * - phần tử giả cuối (grow rất lớn) giữ hàng cuối ở chiều cao mục tiêu, không bị kéo giãn;
 *   nếu hàng cuối đã gần đầy (≥ FILL_LAST_ROW) thì bỏ phần tử giả để hàng cuối cũng kín đều.
 * Kích thước ảnh lấy từ dữ liệu (width/height); thiếu thì đo khi ảnh tải xong.
 * images: [{src, width?, height?, type?: "image"|"video"|"embed", url?}]
 */
export function AlbumGallery({ images, name }) {
  const [idx, setIdx] = useState(null);
  const [measured, setMeasured] = useState({});
  const [fillLast, setFillLast] = useState(false);
  const grid = useRef(null);
  const lightboxImages = images.map((img, i) => ({ ...img, alt: `${name} — ${pad(i + 1)}` }));

  const ratioOf = (img) => {
    if (img.type === "embed") return VIDEO_RATIO; // ảnh đại diện YouTube có viền đen → cắt theo 16:9
    const r = img.width && img.height ? img.width / img.height : measured[img.src];
    return Math.min(MAX_RATIO, Math.max(MIN_RATIO, r || 0.8));
  };

  const ratios = images.map(ratioOf);
  const ratiosKey = ratios.join(",");

  // Mô phỏng cách flex xuống dòng để biết hàng cuối lấp được bao nhiêu (tính lại khi đổi cỡ màn hình)
  useLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;
    const check = () => {
      const style = getComputedStyle(el);
      const rowH = parseFloat(style.getPropertyValue("--row-h")) || 300;
      const gap = parseFloat(style.columnGap) || 0;
      const width = el.clientWidth;
      let row = 0;
      for (const r of ratiosKey.split(",").map(Number)) {
        const w = Math.min(r * rowH, width);
        row = row && row + gap + w <= width + 0.5 ? row + gap + w : w;
      }
      setFillLast(row / width >= FILL_LAST_ROW);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratiosKey]);

  return (
    <>
      <div
        ref={grid}
        className={cn(
          "flex flex-wrap gap-2 [--row-h:150px] sm:gap-3 sm:[--row-h:220px] lg:gap-4 lg:[--row-h:300px]",
          !fillLast && "after:grow-[999] after:content-['']",
        )}
      >
        {images.map((img, i) => {
          const r = ratios[i];
          return (
            <button
              type="button"
              key={img.src + i}
              onClick={() => setIdx(i)}
              className="group reveal relative block max-w-full overflow-hidden rounded-xl bg-paper-200"
              style={{
                flexGrow: r,
                flexBasis: `calc(var(--row-h) * ${r})`,
                "--reveal-delay": `${(i % 4) * 70}ms`,
              }}
              aria-label={`${name} ${i + 1}`}
            >
              {/* giữ đúng tỉ lệ ô theo ảnh */}
              <span className="block" style={{ paddingBottom: `${100 / r}%` }} />
              <Image
                src={img.src}
                alt=""
                fill
                sizes={`(min-width: 1024px) ${Math.round(r * 300 + 80)}px, (min-width: 640px) ${Math.round(r * 220 + 60)}px, ${Math.round(r * 150 + 40)}px`}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                onLoad={(e) => {
                  if (img.width && img.height) return;
                  const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                  if (w && h) setMeasured((m) => (m[img.src] ? m : { ...m, [img.src]: w / h }));
                }}
              />
              <span className="absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/15" />
              {img.type && img.type !== "image" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-navy-950 shadow-soft transition-transform group-hover:scale-110">
                    <Icon
                      name="play"
                      className="ml-0.5 size-5"
                      strokeWidth={0}
                      fill="currentColor"
                    />
                  </span>
                </span>
              )}
              <span className="absolute right-3 bottom-3 rounded-full bg-white/85 px-2 py-0.5 text-[10px] tracking-widest text-ink opacity-0 backdrop-blur transition group-hover:opacity-100">
                {pad(i + 1)}
              </span>
            </button>
          );
        })}
      </div>
      <Lightbox
        images={lightboxImages}
        index={idx}
        onClose={() => setIdx(null)}
        onChange={setIdx}
      />
    </>
  );
}
