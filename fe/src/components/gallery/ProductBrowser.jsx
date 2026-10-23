"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { ProductCard } from "./ProductCard";

/** Bỏ dấu tiếng Việt + chữ thường → gõ "giang sinh" vẫn ra "Giáng sinh". */
const fold = (s = "") =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();

/**
 * Danh sách sản phẩm ở /san-pham: tìm theo tên / thể loại / mô tả / bối cảnh (không cần gõ dấu).
 * Lọc ngay trên trình duyệt (dữ liệu đã có sẵn từ server).
 * products: dạng toView (lib/products.js)
 */
export function ProductBrowser({ products }) {
  const [query, setQuery] = useState("");
  // Điện thoại: gợi ý ngắn để không bị cắt cụt trong ô tìm kiếm
  const [hint, setHint] = useState("Tìm sản phẩm theo tên, thể loại, bối cảnh…");
  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setHint("Tìm theo tên, thể loại…"); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  const input = useRef(null);

  const index = useMemo(
    () =>
      products.map((p) => ({
        p,
        text: fold([p.title, p.category, p.summary, p.setName, p.usage].join(" ")),
      })),
    [products],
  );

  const terms = fold(query).split(/s+/).filter(Boolean);
  const shown = index.filter(({ text }) => terms.every((t) => text.includes(t))).map(({ p }) => p);

  const reset = () => {
    setQuery("");
    input.current?.focus();
  };

  return (
    <>
      {/* Thanh tìm kiếm căn giữa, cách đều phía trên (padding section) và phía dưới (tới lưới): 40 / 48 / 56px */}
      <div className="mx-auto mb-10 max-w-2xl sm:mb-12 lg:mb-14">
        <label className="group relative block">
          <span className="sr-only">Tìm sản phẩm</span>
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-ink-muted transition-colors group-focus-within:text-orange-500"
          />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder={hint}
            maxLength={80}
            className="h-14 w-full rounded-full border border-ink/10 bg-white pr-14 pl-14 text-base text-ink shadow-[0_12px_32px_-18px_rgba(10,16,32,0.35)] transition outline-none placeholder:text-ink-muted focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={reset}
              aria-label="Xoá từ khoá"
              className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink-soft transition hover:bg-navy-950 hover:text-white"
            >
              <Icon name="close" className="size-3.5" />
            </button>
          )}
        </label>
        {/* Số kết quả chỉ đọc cho trình đọc màn hình (không hiện dòng mô tả) */}
        <p className="sr-only" aria-live="polite">
          {terms.length ? `Tìm thấy ${shown.length} trên ${products.length} sản phẩm` : ""}
        </p>
      </div>

      {shown.length > 0 ? (
        /* Lưới đều: mọi thẻ cùng kích thước (3 cột desktop, 2 cột tablet, 1 cột mobile) */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div
          className="flex flex-col items-center rounded-3xl border border-dashed border-ink/15 bg-white/60 px-6 py-16 text-center"
          aria-live="polite"
        >
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-ink-muted shadow-sm ring-1 ring-ink/5">
            <Icon name="search" className="size-6" />
          </span>
          <p className="mt-5 text-lg font-semibold text-ink">Chưa tìm thấy sản phẩm phù hợp</p>
          <p className="mt-1.5 max-w-md text-center text-sm text-ink-soft">
            Không có sản phẩm nào khớp với “{query.trim()}”. Thử từ khoá khác hoặc xem tất cả sản
            phẩm.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            <Icon name="refresh" className="size-4" />
            Xem tất cả sản phẩm
          </button>
        </div>
      ) : (
        <p className="py-16 text-center text-ink-soft">
          Sản phẩm đang được cập nhật, vui lòng quay lại sau.
        </p>
      )}
    </>
  );
}
