import Image from "next/image";
import { partners } from "@/data/partners";

/**
 * Dải "thương hiệu đã đồng hành" — nền cam nhạt, 1 dòng tiêu đề ngắn + logo đặt thẳng trên nền (không khung),
 * tự lướt ngang liên tục (rê chuột → dừng, logo đang trỏ nở to, nổi lên + hiện tên). Ít chữ, đặt ngay dưới
 * phần mở đầu trang (trang chủ: dưới hero · Về chúng tôi: dưới đầu trang).
 */
export function Partners() {
  // Một nửa track (12 thẻ) dài hơn khung 1920px → lặp 2 lần cho vòng liền mạch
  const row = [...partners, ...partners];

  return (
    <section
      className="relative overflow-hidden bg-[#fff1e6] pt-10 pb-3 sm:pt-12 sm:pb-4"
      data-nav-theme="light"
      aria-labelledby="partners-title"
    >
      <h2
        id="partners-title"
        className="reveal px-5 text-center text-xl font-bold tracking-tight text-balance text-navy-900 uppercase sm:text-2xl lg:text-[1.75rem]"
      >
        Hàng trăm doanh nghiệp đã tin tưởng
      </h2>

      {/* 2 mép mờ dần vào nền cho mềm */}
      <div
        className="marquee mt-2 [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] sm:mt-3"
        aria-label="Thương hiệu đã đồng hành"
      >
        <div className="bleed-cap overflow-hidden">
          <ul className="marquee-track" style={{ "--marquee-duration": "21s" }}>
            {row.map((p, i) => (
              // ô bề rộng cố định thay cho gap → 2 nửa track nối nhau không bị lệch
              <li
                key={i}
                aria-hidden={i >= partners.length ? "true" : undefined}
                className="group relative flex h-[110px] w-[170px] shrink-0 items-center justify-center sm:h-[150px] sm:w-[290px]"
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={p.w}
                  height={160}
                  sizes="240px"
                  className="h-auto max-h-11 w-auto max-w-[130px] object-contain opacity-85 transition-[opacity,transform,filter,scale,translate] duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.3] group-hover:opacity-100 group-hover:drop-shadow-[0_10px_18px_rgba(15,20,32,0.18)] sm:max-h-[52px] sm:max-w-[160px]"
                />
                <span className="pointer-events-none absolute inset-x-2 bottom-1.5 translate-y-1 truncate text-center text-[12px] font-semibold text-ink opacity-0 transition-[opacity,translate,transform] delay-150 duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3">
                  {p.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
