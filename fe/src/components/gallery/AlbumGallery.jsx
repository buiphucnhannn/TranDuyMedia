"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Lightbox } from "@/components/ui";
import { cn, pad } from "@/lib/utils";

const MIN_RATIO = 0.5; // ảnh dọc rất cao (≈ 1:2) — hẹp hơn nữa sẽ cắt nhẹ cho gọn hàng
const MAX_RATIO = 2.4; // ảnh ngang / panorama rất dài
const VIDEO_RATIO = 16 / 9;
const MAX_STRETCH = 1.25; // hàng không cao quá 125% chiều cao chuẩn (ảnh tự cắt nhẹ cho vừa)
const FILL_LAST_ROW = 0.7; // hàng cuối đã lấp ≥ 70% chiều ngang → giãn cho kín luôn

/**
 * Chia ảnh thành các hàng "đều" (justified rows, như Google Photos): mỗi hàng lấp kín chiều ngang,
 * mọi ô trong hàng cao bằng nhau, chiều cao các hàng xấp xỉ nhau (≈ rowH).
 * - Thêm dần từng ảnh; khi hàng đã đủ thấp (≤ rowH) thì chọn ngắt TRƯỚC hoặc SAU ảnh vừa thêm, tuỳ
 *   phương án nào gần rowH hơn → không còn hàng cao vọt vì 1 ảnh panorama đứng cạnh 1 ảnh dọc.
 * - Hàng vẫn cao quá rowH × MAX_STRETCH → giữ chiều cao tối đa, ô giãn ngang cho kín (object-cover
 *   cắt nhẹ trên / dưới) — khung luôn đồng đều.
 * - Hàng cuối thiếu ảnh: giữ chiều cao chuẩn, căn trái (không phóng to bất thường).
 * Trả [{ height, items: [{ i, width }] }].
 */
function layoutRows(ratios, width, rowH, gap) {
  const rows = [];
  const heightOf = (sum, n) => (width - gap * (n - 1)) / sum;
  let start = 0;
  while (start < ratios.length) {
    let sum = 0;
    let end = start;
    let height = Infinity;
    while (end < ratios.length) {
      const nextSum = sum + ratios[end];
      const nextH = heightOf(nextSum, end - start + 1);
      if (nextH <= rowH && end > start) {
        // So sánh ngắt trước / sau ảnh này: lấy phương án có chiều cao gần rowH hơn (theo tỉ lệ)
        if (Math.abs(Math.log(nextH / rowH)) < Math.abs(Math.log(height / rowH))) {
          sum = nextSum;
          height = nextH;
          end++;
        }
        break;
      }
      sum = nextSum;
      height = nextH;
      end++;
    }
    const n = end - start;
    const isLast = end >= ratios.length;
    const natural = heightOf(sum, n);
    const fill = (sum * rowH + gap * (n - 1)) / width;
    let h = Math.min(natural, rowH * MAX_STRETCH);
    if (isLast && natural > rowH && fill < FILL_LAST_ROW) h = rowH; // hàng cuối thưa: giữ cỡ chuẩn
    const stretch = isLast && h === rowH && natural > rowH; // hàng cuối không giãn ngang
    const free = width - gap * (n - 1);
    const items = [];
    for (let k = start; k < end; k++) {
      items.push({ i: k, width: stretch ? ratios[k] * h : (ratios[k] / sum) * free });
    }
    rows.push({ height: h, items, sum, start, end });
    start = end;
  }

  // Hàng cuối chỉ lèo tèo 1–2 ảnh (lấp < 1/2 chiều ngang) → gộp vào hàng trên, hàng trên thấp xuống
  // một chút (không dưới 70% chuẩn) — tránh 1 ảnh mồ côi đứng lẻ cuối thư viện
  const last = rows.at(-1);
  const prev = rows.at(-2);
  if (prev && last.sum * rowH + gap * (last.items.length - 1) < width * 0.5) {
    const n = prev.items.length + last.items.length;
    const sum = prev.sum + last.sum;
    const h = heightOf(sum, n);
    if (h >= rowH * 0.7) {
      const free = width - gap * (n - 1);
      rows.splice(-2, 2, {
        height: h,
        items: Array.from({ length: n }, (_, k) => ({
          i: prev.start + k,
          width: (ratios[prev.start + k] / sum) * free,
        })),
      });
    }
  }
  return rows;
}

/**
 * Thư viện ảnh của trang chi tiết sản phẩm: ảnh / video giữ đúng tỉ lệ thật trong các hàng đều nhau.
 * Kích thước ảnh lấy từ dữ liệu (width/height); thiếu thì đo khi ảnh / video tải xong.
 * Video chưa có ảnh đại diện → hiện khung hình thật của video (không dùng ảnh tạm khác tỉ lệ).
 * Trước khi đo được bề rộng khung (lần render đầu trên server) dùng bố cục flex dự phòng.
 * images: [{src, width?, height?, type?: "image"|"video"|"embed", url?, poster?}]
 */
export function AlbumGallery({ images, name }) {
  const [idx, setIdx] = useState(null);
  const [measured, setMeasured] = useState({});
  const [box, setBox] = useState(null); // { width, rowH, gap } theo cỡ màn hình
  const grid = useRef(null);
  const lightboxImages = images.map((img, i) => ({ ...img, alt: `${name} — ${pad(i + 1)}` }));

  const keyOf = (img, i) => img.src ?? img.url ?? String(i);
  const ratioOf = (img, i) => {
    if (img.type === "embed") return VIDEO_RATIO; // ảnh đại diện YouTube có viền đen → cắt theo 16:9
    const r = img.width && img.height ? img.width / img.height : measured[keyOf(img, i)];
    return Math.min(
      MAX_RATIO,
      Math.max(MIN_RATIO, r || (img.type === "video" ? VIDEO_RATIO : 0.8)),
    );
  };
  const ratios = images.map(ratioOf);

  // Đo bề rộng khung + chiều cao hàng / khoảng cách theo breakpoint (biến CSS --row-h, gap)
  useLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;
    const measure = () => {
      const style = getComputedStyle(el);
      setBox({
        width: el.clientWidth,
        rowH: parseFloat(style.getPropertyValue("--row-h")) || 300,
        gap: parseFloat(style.columnGap) || 0,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const remember = (img, i, w, h) => {
    if (img.width && img.height) return;
    const k = keyOf(img, i);
    if (w && h) setMeasured((m) => (m[k] ? m : { ...m, [k]: w / h }));
  };

  const tile = (img, i, style) => (
    <button
      type="button"
      key={keyOf(img, i) + i}
      onClick={() => setIdx(i)}
      className="group reveal relative block overflow-hidden rounded-xl bg-navy-900"
      style={{ ...style, "--reveal-delay": `${(i % 4) * 70}ms` }}
      aria-label={`${name} ${i + 1}`}
    >
      {img.src ? (
        <Image
          src={img.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, (min-width: 640px) 60vw, 90vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onLoad={(e) =>
            remember(img, i, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
          }
        />
      ) : img.type === "video" && img.url ? (
        // Không có ảnh đại diện → khung hình thật của video (đúng nội dung, đúng tỉ lệ)
        <video
          src={`${img.url}#t=0.5`}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedMetadata={(e) =>
            remember(img, i, e.currentTarget.videoWidth, e.currentTarget.videoHeight)
          }
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <span className="absolute inset-0 bg-linear-to-br from-navy-800 to-navy-950" />
      )}
      <span className="absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/15" />
      {img.type && img.type !== "image" && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-navy-950 shadow-soft transition-transform group-hover:scale-110">
            <Icon name="play" className="ml-0.5 size-5" strokeWidth={0} fill="currentColor" />
          </span>
        </span>
      )}
      <span className="absolute right-3 bottom-3 rounded-full bg-white/85 px-2 py-0.5 text-[10px] tracking-widest text-ink opacity-0 backdrop-blur transition group-hover:opacity-100">
        {pad(i + 1)}
      </span>
    </button>
  );

  const rows = box?.width ? layoutRows(ratios, box.width, box.rowH, box.gap) : null;

  return (
    <>
      <div
        ref={grid}
        className={cn(
          "[--row-h:150px] sm:[--row-h:220px] lg:[--row-h:300px]",
          "flex flex-col gap-2 sm:gap-3 lg:gap-4 [&>div]:gap-2 sm:[&>div]:gap-3 lg:[&>div]:gap-4",
          !rows && "flex-row flex-wrap after:grow-[999] after:content-['']",
        )}
      >
        {rows
          ? rows.map((row, r) => (
              <div key={r} className="flex">
                {row.items.map(({ i, width }) =>
                  tile(images[i], i, { width, height: row.height, flex: "none" }),
                )}
              </div>
            ))
          : // Dự phòng trước khi đo được bề rộng (render phía server)
            images.map((img, i) =>
              tile(img, i, {
                flexGrow: ratios[i],
                flexBasis: `calc(var(--row-h) * ${ratios[i]})`,
                aspectRatio: ratios[i],
              }),
            )}
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
