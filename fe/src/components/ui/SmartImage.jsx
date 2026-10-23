"use client";

import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import DIMS from "@/data/image-dims.json";

/**
 * next/image + tự chọn bản ảnh ĐỦ NÉT cho khung đang hiển thị.
 *
 * Ảnh `fill` + object-cover đặt trong khung khác tỉ lệ (vd. ảnh ngang trong khung dọc) thực chất bị
 * phóng to để phủ kín — `sizes` khai báo theo bề rộng khung là chưa đủ, trình duyệt tải bản nhỏ rồi
 * kéo giãn → mờ. Sau khi gắn vào trang, đo khung thật + tỉ lệ ảnh gốc (src/data/image-dims.json, hoặc
 * prop `ratio` / width-height của ảnh từ Cloudinary), tính bề rộng ảnh THỰC SỰ hiển thị (gồm cả phóng
 * do object-cover và transform của lớp cha như zoom cắt khung) rồi cập nhật `sizes` → trình duyệt tự
 * chọn bản đủ độ phân giải (nhân thêm mật độ điểm ảnh màn hình). Chỉ tăng, không giảm.
 * Ảnh lazy (mặc định) chỉ tải khi gần màn hình — lúc đó `sizes` đã đúng, không tải 2 lần.
 * Props như next/image; thêm `ratio` (rộng / cao ảnh gốc) khi ảnh không nằm trong public/.
 */
export const SmartImage = forwardRef(function SmartImage(
  { sizes, ratio, fill, onLoad, alt, ...props },
  forwardedRef,
) {
  const ref = useRef(null);
  const [auto, setAuto] = useState(null);
  const natural = useRef(ratio ?? ratioOf(props.src));

  const setRefs = useCallback(
    (el) => {
      ref.current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    },
    [forwardedRef],
  );

  const measure = useCallback(() => {
    const img = ref.current;
    if (!img || !fill) return;
    const w = img.offsetWidth;
    const h = img.offsetHeight;
    if (!w || !h) return;
    // transform của lớp cha (zoom cắt khung, parallax scale…) → bề rộng hiển thị thật / bề rộng bố cục
    const scale = Math.max(1, img.getBoundingClientRect().width / w);
    const R = natural.current;
    const cover = getComputedStyle(img).objectFit === "cover" && R ? Math.max(1, (h * R) / w) : 1;
    const need = Math.ceil(w * cover * scale);
    setAuto((prev) => (prev && prev >= need ? prev : need));
  }, [fill]);

  useLayoutEffect(() => {
    measure();
    const img = ref.current;
    if (!img || !fill || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(img);
    return () => ro.disconnect();
  }, [measure, fill]);

  return (
    <Image
      ref={setRefs}
      alt={alt}
      fill={fill}
      sizes={auto ? `${auto}px` : sizes}
      onLoad={(e) => {
        const el = e.currentTarget;
        if (!natural.current && el.naturalWidth && el.naturalHeight) {
          natural.current = el.naturalWidth / el.naturalHeight;
          measure();
        }
        onLoad?.(e);
      }}
      {...props}
    />
  );
});

/** Tỉ lệ ảnh gốc (rộng / cao) từ bảng kích thước ảnh tĩnh — null nếu không có. */
export function ratioOf(src) {
  const key = typeof src === "string" ? src.split("?")[0] : null;
  const d = key && DIMS[key];
  return d ? d[0] / d[1] : null;
}
