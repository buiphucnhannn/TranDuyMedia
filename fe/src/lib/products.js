import { cacheLife, cacheTag } from "next/cache";
import { cdn } from "@/lib/cdn";
import { mediaCount } from "@/lib/media-count";

/**
 * Sản phẩm đã thực hiện — lấy từ backend (MongoDB), chỉ dùng phía server.
 * Kết quả được cache (tag "products"); trang quản trị gọi /api/revalidate sau khi thêm / sửa / xoá
 * để website cập nhật ngay. Backend lỗi → trả danh sách rỗng thay vì làm sập trang.
 */
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
export const PRODUCTS_TAG = "products";

/** Dữ liệu API → dạng các component đang dùng (ProductCard, AlbumGallery…). */
export function toView(p) {
  const media = (p.media ?? []).map((m) => ({
    // video / link nhúng chưa có ảnh đại diện → src null: thư viện tự lấy khung hình thật của video
    // (thay vì gắn tạm một ảnh không liên quan, sai cả nội dung lẫn tỉ lệ khung)
    src: cdn(m.type === "image" ? m.url : (m.poster ?? null)),
    pos: m.pos ?? "center",
    zoom: m.zoom ?? 1,
    width: m.width ?? null,
    height: m.height ?? null,
    type: m.type, // image | video | embed
    url: m.url,
    poster: m.poster,
    alt: m.alt || p.title,
  }));
  const images = media.length
    ? media
    : [{ src: "/images/og-image.png", pos: "center", type: "image" }];
  // Ảnh bìa + ảnh nổi bật chỉ lấy ẢNH (video chỉ hiện trong thư viện); không có ảnh nào → dùng ảnh đại diện video
  const photos = images.filter((m) => m.type === "image");
  const featured = photos.length ? photos : images.filter((m) => m.poster);
  const cover = featured[0] ?? { src: "/images/bts/bts-05.webp", pos: "center", type: "image" };
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    summary: p.summary,
    description: p.description,
    usage: p.usage,
    setName: p.location,
    set: p.studioSet,
    kind: p.kind,
    // Số lượng hiển thị theo đúng loại tệp: "15 ảnh · 01 video", "03 video", "16 ảnh"
    count: mediaCount(media),
    cover,
    covers: featured.slice(0, 3),
    images,
  };
}

/**
 * Bổ sung kích thước cho ảnh chưa có (ảnh mẫu lưu trong /public) — thư viện ảnh cần tỉ lệ thật
 * để xếp hàng ngay ngắn. Ảnh trên Cloudinary đã có sẵn width/height lúc tải lên.
 */
async function withSizes(view) {
  const missing = view.images.filter((m) => !(m.width && m.height) && m.src?.startsWith("/"));
  if (!missing.length) return view;
  const [{ default: sharp }, { join }] = await Promise.all([import("sharp"), import("node:path")]);
  await Promise.all(
    missing.map(async (m) => {
      try {
        const { width, height } = await sharp(join(process.cwd(), "public", m.src)).metadata();
        Object.assign(m, { width, height });
      } catch {
        // không đọc được → thư viện tự đo khi ảnh tải xong
      }
    }),
  );
  return view;
}

async function request(path) {
  const res = await fetch(`${BACKEND_URL}/api/v1${path}`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  return (await res.json()).data;
}

export async function getProducts() {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("minutes");
  try {
    // Kích thước ảnh thật → thẻ sản phẩm chọn đúng bản ảnh đủ nét cho khung đóng sẵn
    return await Promise.all(((await request("/products")) ?? []).map((p) => withSizes(toView(p))));
  } catch {
    return [];
  }
}

export async function getProduct(slug) {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("minutes");
  try {
    const p = await request(`/products/${encodeURIComponent(slug)}`);
    return p ? await withSizes(toView(p)) : null;
  } catch {
    return null;
  }
}
