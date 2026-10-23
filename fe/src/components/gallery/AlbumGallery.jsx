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

/**
 * Chia ảnh thành các hàng "đều" (justified rows, như Google Photos): mỗi hàng lấp kín chiều ngang,
 * mọi ô trong hàng cao bằng nhau, chiều cao các hàng xấp xỉ nhau (≈ rowH).
 * Chọn cách ngắt hàng TỐI ƯU cho cả thư viện (quy hoạch động, như cách dàn trang chữ): mỗi hàng bị
 * "phạt" theo độ lệch chiều cao so với rowH → không còn hàng cao vọt (panorama cạnh ảnh dọc),
 * hàng quá thấp hay 1 ảnh mồ côi ở cuối; mọi hàng — kể cả hàng cuối — đều kín chiều ngang.
 * Hàng vẫn cao hơn rowH × MAX_STRETCH → giữ chiều cao tối đa, ô cắt nhẹ trên / dưới (object-cover).
 * Trả [{ height, items: [{ i, width }] }].
 */
function layoutRows(ratios, width, rowH, gap) {
  const n = ratios.length;
  const maxH = rowH * MAX_STRETCH;
  const heightOf = (sum, count) => (width - gap * (count - 1)) / sum;
  const penalty = (h) => {
    const shown = Math.min(h, maxH);
    const off = Math.log(shown / rowH); // lệch so với chiều cao chuẩn (tỉ lệ, đối xứng to / nhỏ)
    const crop = h > maxH ? Math.log(h / maxH) * 2 : 0; // phải cắt nhiều → phạt nặng hơn
    return off * off + crop * crop;
  };
  // best[i] = chi phí nhỏ nhất để xếp ảnh 0..i-1; from[i] = vị trí bắt đầu hàng cuối
  const best = new Array(n + 1).fill(Infinity);
  const from = new Array(n + 1).fill(0);
  best[0] = 0;
  for (let end = 1; end <= n; end++) {
    let sum = 0;
    for (let start = end - 1; start >= 0; start--) {
      sum += ratios[start];
      const h = heightOf(sum, end - start);
      if (h < rowH * 0.5) break; // thêm ảnh nữa chỉ càng thấp hơn
      const cost = best[start] + penalty(h);
      if (cost < best[end]) {
        best[end] = cost;
        from[end] = start;
      }
    }
  }
  const rows = [];
  for (let end = n; end > 0; end = from[end]) {
    const start = from[end];
    let sum = 0;
    for (let k = start; k < end; k++) sum += ratios[k];
    const free = width - gap * (end - start - 1);
    const natural = heightOf(sum, end - start);
    // Quá ít ảnh để lấp kín (vd. sản phẩm chỉ 1 ảnh dọc) → giữ đúng tỉ lệ ở cỡ chuẩn, căn giữa,
    // thay vì kéo ngang rồi cắt mất phần lớn ảnh
    const fit = natural <= maxH * 1.3;
    const height = fit ? Math.min(natural, maxH) : rowH;
    const items = [];
    for (let k = start; k < end; k++)
      items.push({ i: k, width: fit ? (ratios[k] / sum) * free : ratios[k] * rowH });
    rows.unshift({ height, items, centered: !fit });
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
              <div key={r} className={cn("flex", row.centered && "justify-center")}>
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
