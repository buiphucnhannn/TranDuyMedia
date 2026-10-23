import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

const CORNERS = [
  "top-6 left-6 border-t-2 border-l-2",
  "top-6 right-6 border-t-2 border-r-2",
  "bottom-6 left-6 border-b-2 border-l-2",
  "bottom-6 right-6 border-b-2 border-r-2",
];

/**
 * Đăng nhập quản trị — bố cục 2 cột như popup đặt lịch: ảnh hậu trường kiểu khung ngắm (trái),
 * form trên nền giấy (phải). Mobile: chỉ form, căn giữa màn hình.
 * Đã đăng nhập mà vào /login → proxy.js chuyển thẳng vào /admin.
 */
export default function LoginPage() {
  return (
    <main className="grid min-h-svh bg-paper lg:grid-cols-[1.05fr_1fr]">
      {/* Cột ảnh */}
      <aside className="grain relative isolate hidden overflow-hidden bg-navy-950 text-white lg:block">
        <Image
          src="/images/bts/bts-05.webp"
          alt=""
          fill
          preload
          sizes="52vw"
          quality={80}
          className="-z-20 object-cover grayscale"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950 via-navy-950/55 to-navy-950/30" />
        {CORNERS.map((c) => (
          <span key={c} aria-hidden="true" className={`absolute size-8 border-orange-500 ${c}`} />
        ))}
        <div className="absolute top-12 left-12 flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] uppercase">
          <span className="size-2 animate-[introBlink_1s_steps(2,start)_infinite] rounded-full bg-red-500" />
          Rec - Admin studio
        </div>
        <div className="absolute inset-x-12 bottom-14">
          <Logo light className="h-14" />
          <p className="mt-8 max-w-md text-[2.4rem] h-display">
            Hậu trường của <span className="text-orange-500">mọi khung hình.</span>
          </p>
          <p className="mt-4 max-w-sm text-left text-sm leading-relaxed text-white/65">
            Quản lý yêu cầu đặt lịch, sản phẩm và thư viện hình ảnh – video của Trần Duy Media.
          </p>
        </div>
      </aside>

      {/* Cột form */}
      <section className="relative flex items-center justify-center px-5 py-16 sm:px-10">
        <Link
          href="/"
          className="absolute top-6 left-5 inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition hover:text-ink sm:left-10"
        >
          <Icon name="arrowRight" className="size-4 rotate-180" />
          Về trang chủ
        </Link>

        <div className="w-full max-w-[400px]">
          <div className="flex flex-col items-center text-center">
            <Logo className="h-12 lg:hidden" />
            <span className="mt-6 flex size-12 items-center justify-center rounded-2xl bg-navy-950 text-orange-500 lg:mt-0">
              <Icon name="lock" className="size-5" />
            </span>
            <h1 className="mt-5 text-[1.9rem] h-display text-ink">Đăng nhập quản trị</h1>
            <p className="mt-2 text-center text-sm text-ink-soft">
              Chỉ dành cho tài khoản quản trị của Trần Duy Media.
            </p>
          </div>

          <Suspense fallback={<div className="mt-8 h-[260px]" />}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
