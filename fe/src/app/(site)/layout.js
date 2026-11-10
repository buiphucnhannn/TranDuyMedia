import { BookingModal, VideoModal } from "@/components/booking";
import { IntroSplash, PageTransition, Reveal, ScrollTop, SmoothScroll } from "@/components/fx";
import { FloatingContact, Footer, Header } from "@/components/layout";
import { buildNav } from "@/config/site";
import { getHome } from "@/lib/home";

/**
 * Khung chung của website công khai: header, footer, cuộn mượt, màn chào, popup đặt lịch / video.
 * Menu theo trạng thái bật / tắt ở trang quản trị (vd. trang Sản phẩm) — dữ liệu cache tag "home",
 * quản trị đổi trạng thái là website cập nhật ngay.
 */
export default async function SiteLayout({ children }) {
  const { flags } = await getHome();
  const nav = buildNav(flags);
  return (
    <>
      <a
        href="#main"
        className="sr-only z-100 rounded-lg bg-orange-500 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Bỏ qua đến nội dung chính
      </a>
      <SmoothScroll />
      {/* Màn chào thương hiệu: chỉ khi tải trang đầy đủ (lần đầu / F5), không hiện khi chuyển trang.
          Đặt SAU SmoothScroll để Lenis đã được tạo khi màn chào khoá cuộn. */}
      <IntroSplash />
      <PageTransition />
      <Reveal />
      <Header nav={nav} />
      <main id="main">{children}</main>
      <Footer nav={nav} flags={flags} />
      <FloatingContact />
      <ScrollTop />
      <BookingModal />
      <VideoModal />
    </>
  );
}
