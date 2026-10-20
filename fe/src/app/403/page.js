import { Suspense } from "react";
import Link from "next/link";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { LoginLink } from "./LoginLink";

export const metadata = {
  title: "Không có quyền truy cập",
  robots: { index: false, follow: false },
};

/**
 * Trang 403 — proxy.js hiển thị trang này (mã HTTP 403, giữ nguyên URL) khi chưa đăng nhập mà vào /admin.
 * Nút đăng nhập mang theo trang định vào (?next=) để đăng nhập xong quay lại đúng chỗ.
 */
export default function Forbidden() {
  return (
    <ErrorScreen
      code="403"
      eyebrow="Khu vực dành cho quản trị viên"
      title="Bạn chưa có quyền truy cập"
      description={
        <>
          Trang này chỉ dành cho tài khoản quản trị.
          <br />
          Vui lòng đăng nhập để tiếp tục.
        </>
      }
    >
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Suspense fallback={<LoginLink />}>
          <LoginLink withNext />
        </Suspense>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white hover:text-ink"
        >
          Về trang chủ
        </Link>
      </div>
    </ErrorScreen>
  );
}
