import Image from "next/image";
import { Container } from "@/components/ui";
import { partners } from "@/data/partners";

/**
 * Thương hiệu đã đồng hành (nền sáng): dải logo tự lướt ngang liên tục.
 * Logo màu thật, không khung; rê chuột vào dải → dừng lướt, logo đang trỏ nở to, nổi lên và hiện tên.
 * Dùng ở trang chủ và trang Về chúng tôi.
 */
export function Partners() {
  // Một nửa track (12 thẻ × ~240px) dài hơn khung 1920px → lặp 2 lần cho vòng liền mạch
  const row = [...partners, ...partners];

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20" data-nav-theme="light">
      <Container>
        <p className="reveal mb-4 eyebrow">Đối tác & khách hàng</p>
        {/* Mô tả canh giữa theo chiều cao tiêu đề */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="reveal max-w-2xl h-section" style={{ "--reveal-delay": "80ms" }}>
            Hàng trăm doanh nghiệp đã tin tưởng{" "}
            <span className="text-orange-500">Tran Duy Media.</span>
          </h2>
          <div className="reveal flex items-center gap-4" style={{ "--reveal-delay": "160ms" }}>
            <span className="text-5xl h-display text-ink">10+</span>
            <p className="text-[11px] leading-relaxed tracking-eyebrow text-ink-muted uppercase">
              Ngành hàng
              <br />
              đã đồng hành
            </p>
          </div>
        </div>
      </Container>

      {/* Dải logo */}
      {/* Dải logo — không khung thẻ, logo màu thật; rê chuột: dải dừng, logo nở to + hiện tên */}
      <div
        className="marquee mt-10 [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] sm:mt-12"
        aria-label="Thương hiệu đã đồng hành"
      >
        <div className="bleed-cap overflow-hidden">
          <ul className="marquee-track" style={{ "--marquee-duration": "21s" }}>
            {row.map((p, i) => (
              <li
                key={i}
                aria-hidden={i >= partners.length ? "true" : undefined}
                className="group relative flex h-[120px] w-[200px] shrink-0 items-center justify-center sm:h-[150px] sm:w-[290px]"
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
