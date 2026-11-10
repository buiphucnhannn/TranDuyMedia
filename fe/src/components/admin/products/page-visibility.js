"use client";

import { useSyncExternalStore } from "react";

/**
 * Trạng thái Ẩn / Hiện của CẢ trang "Sản phẩm" trên website — dùng chung giữa công tắc ở thanh tiêu đề
 * (ProductsVisibility) và lưới thẻ sản phẩm (ProductsManager): trang đang ẩn → khoá nút ẩn / hiện từng sản
 * phẩm và nút mở trên website. null = chưa tải xong.
 */
let value = null;
const subs = new Set();

export const setPageVisible = (v) => {
  value = v;
  subs.forEach((fn) => fn());
};

const subscribe = (fn) => {
  subs.add(fn);
  return () => subs.delete(fn);
};

export const usePageVisible = () =>
  useSyncExternalStore(
    subscribe,
    () => value,
    () => null,
  );
