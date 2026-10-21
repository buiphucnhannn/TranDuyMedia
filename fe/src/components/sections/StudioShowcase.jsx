import Image from "next/image";
import { Icon } from "@/components/icons";
import { DragMarquee } from "@/components/gallery/DragMarquee";
import { Button, Container } from "@/components/ui";
import { collections } from "@/data/collections";
import { cn } from "@/lib/utils";

const CARD_W = "w-[290px] sm:w-[330px] lg:w-[360px]";

/**
 * Bối cảnh studio cho thuê — dải thẻ tự trôi ngang liên tục, chậm rãi (vòng lặp liền mạch), kéo được.
 * - Rê chuột vào → dừng; nhấn-kéo (chuột) / vuốt (điện thoại, touchpad) → lướt qua lại.
 * - Danh sách được nhân đôi để vòng lặp không có điểm nối. Bản sao ẩn với trình đọc màn hình và
 *   không nhận Tab (aria-hidden + tabIndex -1).
 * - Tốc độ tự trôi: prop speed (px/giây) của DragMarquee.
 * Đặt ở trang dịch vụ "Cho thuê bối cảnh studio" (/dich-vu/cho-thue-studio).
 */
export function StudioShowcase({ eyebrow = "Cho thuê studio" }) {
  return (
    <section
      id="studio"
      className="grain relative overflow-hidden bg-navy-950 section-y text-white"
      data-nav-theme="dark"
    >
      <Container>
        <p className="reveal mb-4 eyebrow">{eyebrow}</p>
        {/* Nút canh giữa theo chiều cao tiêu đề; mô tả nằm dưới hàng */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="reveal max-w-2xl h-section" style={{ "--reveal-delay": "80ms" }}>
            Sáu bối cảnh sẵn sàng, chỉ cần mang ý tưởng đến.
          </h2>
          <div className="reveal" style={{ "--reveal-delay": "240ms" }}>
            <Button href="/san-pham" variant="white" pill>
              Xem sản phẩm thực tế
            </Button>
          </div>
        </div>
        <p
          className="reveal mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
          style={{ "--reveal-delay": "160ms" }}
        >
          Phòng vintage xanh rêu, box studio trắng, sân thượng ánh sáng tự nhiên và các bối cảnh
          theo mùa — đã setup đèn Godox, phông nền và đạo cụ. Thuê theo giờ, có kỹ thuật hỗ trợ.
        </p>
      </Container>

      {/* Dải thẻ tự trôi, kéo được — 2 mép mờ dần cho mềm */}
      <div className="reveal bleed-cap mt-10" style={{ "--reveal-delay": "200ms" }}>
        <DragMarquee
          speed={32}
          className="[mask-image:linear-gradient(to_right,transparent,#000_3%,#000_97%,transparent)]"
        >
          <CardSet />
          <CardSet clone />
        </DragMarquee>
      </div>
    </section>
  );
}

/** Một bộ thẻ (6 bối cảnh + ô đặt lịch). clone: bản sao cho vòng lặp — ẩn khỏi trình đọc màn hình & Tab. */
function CardSet({ clone = false }) {
  const tab = clone ? -1 : undefined;
  return (
    <div className="flex" aria-hidden={clone || undefined}>
      {collections.map((c) => (
        // pr-5 thay cho gap: khoảng cách nằm trong từng thẻ → 2 bộ nối nhau không bị lệch
        <div key={c.slug} className={cn("shrink-0 pr-5", CARD_W)}>
          {/* Thẻ giới thiệu bối cảnh (không còn trang riêng → không dẫn link) */}
          <article className="group relative overflow-hidden rounded-2xl bg-navy-800">
            <div className="relative aspect-4/5">
              <Image
                src={c.cover.src}
                alt={clone ? "" : c.name}
                fill
                sizes="360px"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                style={{ objectPosition: c.cover.pos }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 top-0 p-4 text-[10px] tracking-[0.18em] whitespace-nowrap uppercase sm:p-5 sm:text-[11px] sm:tracking-eyebrow">
              {/* Nền đặc → đọc được cả trên ảnh sáng (tường trắng, tuyết, nắng) */}
              <span className="inline-block rounded-full bg-orange-500 px-3 py-1.5 font-semibold text-white shadow-[0_6px_18px_-6px_rgba(248,104,8,0.7)]">
                {c.eyebrow}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-center text-legible sm:p-6">
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{c.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-center text-sm leading-relaxed text-balance text-white/85">
                {c.tagline}
              </p>
            </div>
          </article>
        </div>
      ))}

      {/* Ô đặt lịch — cùng kích thước với thẻ ảnh */}
      <div className={cn("shrink-0 pr-5", CARD_W)}>
        <div className="flex aspect-4/5 flex-col items-center justify-center rounded-2xl border border-white/15 p-6 text-center sm:p-8">
          <p className="mb-5 eyebrow">Đặt lịch studio</p>
          <div>
            <p className="text-3xl h-display text-balance sm:text-4xl">
              Thuê theo giờ, tối thiểu 2 giờ.
            </p>
            <p className="mx-auto mt-4 max-w-[17rem] text-center text-sm leading-relaxed text-balance text-white/70">
              Đã bao gồm đèn, phông, đạo cụ của từng bối cảnh. Gửi lịch mong muốn, chúng tôi xác
              nhận trong ngày.
            </p>
            <button
              type="button"
              data-booking="cho-thue-studio"
              tabIndex={tab}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 py-1.5 pr-1.5 pl-6 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Đặt lịch ngay
              <span className="flex size-9 items-center justify-center rounded-full bg-white text-navy-900 transition-transform group-hover:translate-x-0.5">
                <Icon name="arrowRight" className="size-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
