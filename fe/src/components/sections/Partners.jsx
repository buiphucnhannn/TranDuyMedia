import Image from "next/image";
import { partners } from "@/data/partners";

/**
 * Dải "thương hiệu đã đồng hành" — băng màu cam thương hiệu, 1 dòng tiêu đề ngắn + logo trên thẻ trắng
 * tự lướt ngang liên tục (rê chuột → dừng, thẻ đang trỏ nổi lên + hiện tên). Ít chữ, đặt ngay dưới
 * phần mở đầu trang (trang chủ: dưới hero · Về chúng tôi: dưới đầu trang).
 */
export function Partners() {
  // Một nửa track (12 thẻ) dài hơn khung 1920px → lặp 2 lần cho vòng liền mạch
  const row = [...partners, ...partners];

  return (
    <section
      className="relative overflow-hidden bg-orange-500 py-10 text-white sm:py-12"
      data-nav-theme="dark"
      aria-labelledby="partners-title"
    >
      <h2
        id="partners-title"
        className="reveal px-5 text-center text-xl font-bold tracking-tight text-balance uppercase sm:text-2xl lg:text-[1.75rem]"
      >
        Hàng trăm doanh nghiệp đã tin tưởng
      </h2>

      {/* 2 mép mờ dần vào nền cam cho mềm */}
      <div
        className="marquee mt-7 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] sm:mt-8"
        aria-label="Thương hiệu đã đồng hành"
      >
        <div className="bleed-cap overflow-hidden py-2">
          <ul className="marquee-track" style={{ "--marquee-duration": "36s" }}>
            {row.map((p, i) => (
              // px thay cho gap: khoảng cách nằm trong từng thẻ → 2 nửa track nối nhau không bị lệch
              <li
                key={i}
                aria-hidden={i >= partners.length ? "true" : undefined}
                className="shrink-0 px-2 sm:px-2.5"
              >
                <div className="group relative flex h-[84px] w-[168px] items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_-14px_rgba(80,30,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 sm:h-[110px] sm:w-[230px]">
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={p.w}
                    height={160}
                    sizes="200px"
                    className="h-auto max-h-9 w-auto max-w-[120px] object-contain transition-transform duration-500 group-hover:scale-105 sm:max-h-12 sm:max-w-[160px]"
                  />
                  <span className="pointer-events-none absolute inset-x-2 bottom-1.5 truncate text-center text-[11px] font-semibold text-ink-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {p.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
