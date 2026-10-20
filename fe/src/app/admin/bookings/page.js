import { Suspense } from "react";
import { BookingsManager } from "@/components/admin/bookings/BookingsManager";

export const metadata = { title: "Yêu cầu đặt lịch" };

const TABS = new Set(["pending", "contacting", "resolved"]);

/** ?trang-thai=pending|contacting|resolved → mở sẵn tab trạng thái đó (vd. từ trang Tổng quan). */
async function Manager({ searchParams }) {
  const status = (await searchParams)?.["trang-thai"];
  return <BookingsManager initialTab={TABS.has(status) ? status : "all"} />;
}

export default function Page({ searchParams }) {
  // Đọc tham số địa chỉ là dữ liệu lúc chạy → đặt trong Suspense (cacheComponents)
  return (
    <Suspense fallback={null}>
      <Manager searchParams={searchParams} />
    </Suspense>
  );
}
