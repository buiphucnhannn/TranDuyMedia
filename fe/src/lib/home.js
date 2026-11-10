import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_HERO, DEFAULT_INTRO, DEFAULT_SERVICES, DEFAULT_SHOWREEL } from "@/data/home";

/**
 * Nội dung trang chủ do quản trị viên chỉnh (tab "Trang chủ") — chỉ dùng phía server.
 * Cache theo tag "home": trang quản trị gọi /api/revalidate sau khi lưu để website cập nhật ngay.
 * Ô nào để trống / backend lỗi → dùng nội dung mặc định (trang chủ không bao giờ bị trống).
 */
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
// Backend lỗi → giữ kết quả dự phòng ngắn rồi tự lấy lại (≥ 5 phút hết hạn để Next vẫn dựng sẵn trang lúc build;
// hồ sơ "seconds" quá ngắn khiến trang bị coi là trang động)
const RETRY_SOON = { stale: 300, revalidate: 30, expire: 600 };
export const HOME_TAG = "home";

/** Ảnh đã lưu (Cloudinary + cách cắt) → dạng các section đang dùng. */
const toImage = (img, alt) =>
  img?.url
    ? {
        src: img.url,
        alt,
        pos: img.pos || "center",
        zoom: img.zoom || 1,
        ratio: img.width && img.height ? img.width / img.height : undefined,
      }
    : null;

/** Dữ liệu API (có thể null) + mặc định → nội dung đầy đủ cho trang chủ. */
export function toHomeView(d) {
  const hero = DEFAULT_HERO.map((def, i) => toImage(d?.hero?.[i], def.alt) ?? def);
  const s = d?.showreel ?? {};
  const showreel = s.embed
    ? {
        embed: s.embed,
        provider: s.provider,
        poster: toImage(s.poster, "Showreel"),
        autoPoster: s.autoPoster,
        title: s.title || DEFAULT_SHOWREEL.title,
        caption: s.caption || DEFAULT_SHOWREEL.caption,
      }
    : {
        embed: null,
        poster: toImage(s.poster, "Showreel"),
        title: s.title || DEFAULT_SHOWREEL.title,
        caption: s.caption || DEFAULT_SHOWREEL.caption,
      };
  const intro = {
    main: toImage(d?.intro?.main, DEFAULT_INTRO.main.alt) ?? DEFAULT_INTRO.main,
    side: toImage(d?.intro?.side, DEFAULT_INTRO.side.alt) ?? DEFAULT_INTRO.side,
  };
  const services = d?.services?.length
    ? d.services.map((c, i) => ({
        name: c.name,
        desc: c.desc,
        // Thẻ chưa có ảnh → ảnh mặc định cùng vị trí (thẻ thứ 7+ dùng lại ảnh mặc định theo vòng)
        image: toImage(c.image, c.name) ?? {
          ...DEFAULT_SERVICES[i % DEFAULT_SERVICES.length].image,
          alt: c.name,
        },
        link: c.link || "",
        booking: c.booking || "",
      }))
    : DEFAULT_SERVICES;
  // Bật / tắt mục website (trang Sản phẩm) — chỉnh ở trang quản trị; backend lỗi → ẩn (mặc định)
  const flags = { products: Boolean(d?.features?.products) };
  return { hero, showreel, intro, services, flags };
}

/**
 * Backend lỗi / chưa có API (vd. lúc build trên Vercel khi backend chưa cập nhật) → KHÔNG ném lỗi (lỗi ném ra
 * trong "use cache" lúc build làm hỏng cả bản build) mà trả null → trang dùng nội dung mặc định.
 * Kết quả lỗi chỉ giữ ~30 giây (RETRY_SOON — mức ngắn nhất được áp dụng) → backend ổn lại là tự lấy mới.
 */
async function cachedHome() {
  "use cache";
  cacheTag(HOME_TAG);
  cacheLife("minutes");
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/home`, {
      headers: { accept: "application/json" },
      cache: "no-store", // cache do "use cache" + tag quản lý (xem lib/products.js)
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    return (await res.json()).data;
  } catch {
    cacheLife(RETRY_SOON);
    return null;
  }
}

export async function getHome() {
  return toHomeView(await cachedHome());
}
