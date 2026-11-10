"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { describeError, revalidateSite } from "./jobs";
import { setPageVisible, usePageVisible } from "./page-visibility";

/**
 * Công tắc Ẩn / Hiện trang "Sản phẩm" trên website (thanh tiêu đề tab Sản phẩm của trang quản trị).
 * - Hiện: mục "Sản phẩm" xuất hiện trên menu đầu trang + chân trang, các link "Xem tất cả sản phẩm",
 *   trang /san-pham được Google lập chỉ mục.
 * - Ẩn (mặc định): gỡ các mục trên; trang vẫn mở được bằng link trực tiếp để quản trị xem trước.
 * Đổi là áp dụng ngay (lưu backend + làm mới website), bấm lại để hoàn tác.
 */
export function ProductsVisibility() {
  const on = usePageVisible(); // null = đang tải (dùng chung với lưới thẻ sản phẩm)
  const setOn = setPageVisible;
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    api("/home")
      .then((r) => alive && setPageVisible(Boolean(r.data.features?.products)))
      .catch(() => alive && setPageVisible(false));
    return () => {
      alive = false;
    };
  }, []);

  const toggle = async () => {
    const next = !on;
    setOn(next); // phản hồi ngay
    setBusy(true);
    try {
      await api("/home/features", { method: "PATCH", body: { products: next } });
      await revalidateSite("home");
      toast.success(
        next
          ? "Mục “Sản phẩm” đã xuất hiện trên menu website, khách xem được trang Sản phẩm."
          : "Mục “Sản phẩm” đã được gỡ khỏi menu website.",
        { title: next ? "Đã hiện trang Sản phẩm" : "Đã ẩn trang Sản phẩm" },
      );
    } catch (err) {
      setOn(!next); // trả lại như cũ
      toast.error(describeError(err), { title: "Chưa đổi được trạng thái" });
    } finally {
      setBusy(false);
    }
  };

  if (on === null)
    return <span className="h-11 w-56 animate-pulse rounded-full bg-ink/5" aria-hidden="true" />;

  return (
    <div className="flex items-center justify-between gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-4 ring-1 ring-ink/10">
      <span className="flex items-center gap-2 text-sm whitespace-nowrap">
        <span
          className={cn("size-2 rounded-full", on ? "bg-emerald-500" : "bg-ink/30")}
          aria-hidden="true"
        />
        <span className="text-ink-soft">Trên website:</span>
        <strong className={cn("font-semibold", on ? "text-emerald-600" : "text-ink")}>
          {on ? "Đang hiển thị" : "Đang ẩn"}
        </strong>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Hiển thị trang Sản phẩm trên website"
        onClick={toggle}
        disabled={busy}
        title={
          on ? "Ẩn: gỡ mục Sản phẩm khỏi menu website" : "Hiện: thêm mục Sản phẩm lên menu website"
        }
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold whitespace-nowrap transition disabled:cursor-wait disabled:opacity-60",
          on
            ? "bg-paper text-ink ring-1 ring-ink/10 hover:bg-ink/5"
            : "bg-navy-950 text-white hover:bg-navy-800",
        )}
      >
        <Icon name={on ? "eyeOff" : "eye"} className="size-3.5" />
        {on ? "Ẩn trang" : "Hiện trang"}
      </button>
    </div>
  );
}
