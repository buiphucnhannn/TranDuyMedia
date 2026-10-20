import { Suspense } from "react";
import Link from "next/link";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { RetryButton } from "./RetryButton";

export const metadata = {
  title: "Thao tác quá nhanh",
  robots: { index: false, follow: false },
};

/**
 * Trang 429 — hiện khi hệ thống tạm giới hạn số lượt truy cập (chống dò mật khẩu / spam).
 * proxy.js trả trang này với đúng mã HTTP 429; backend chuyển về đây khi /auth/resume bị giới hạn.
 * ?next= trang định vào · ?retry= số giây cần chờ (đếm ngược trên nút "Thử lại").
 */
export default function TooManyRequests() {
  return (
    <ErrorScreen
      code="429"
      eyebrow="Hệ thống đang tạm giới hạn"
      title="Bạn thao tác hơi nhanh"
      description={
        <>
          Để bảo vệ tài khoản, hệ thống tạm giới hạn số lượt truy cập liên tục.
          <br />
          Vui lòng đợi một chút rồi thử lại.
        </>
      }
    >
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Suspense fallback={<RetryButton />}>
          <RetryButton withParams />
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
