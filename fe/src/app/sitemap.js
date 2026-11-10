import { buildNav, siteConfig } from "@/config/site";
import { getHome } from "@/lib/home";
import { getProducts } from "@/lib/products";
import { PRIVACY_POLICY } from "@/data/privacy";
import { services } from "@/data/services";

export default async function sitemap() {
  const [products, { flags }] = await Promise.all([getProducts(), getHome()]);
  const mainNav = buildNav(flags);
  // Trang chủ không nằm trong menu (logo thay thế) nên thêm riêng
  const home = { url: siteConfig.url, changeFrequency: "weekly", priority: 1 };
  const pages = mainNav
    .filter((item) => !item.href.includes("#"))
    .map((item) => ({
      url: `${siteConfig.url}${item.href}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  // Trang Sản phẩm đang tạm ẩn → chưa đưa các bộ sản phẩm lên sitemap
  const albums = (flags.products ? products : []).map((p) => ({
    url: `${siteConfig.url}/san-pham/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const servicePages = services.map((s) => ({
    url: `${siteConfig.url}/dich-vu/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  // Chính sách bảo mật: trang pháp lý (tín hiệu tin cậy) — ít thay đổi, ưu tiên thấp
  const legal = {
    url: `${siteConfig.url}${PRIVACY_POLICY.path}`,
    lastModified: PRIVACY_POLICY.version,
    changeFrequency: "yearly",
    priority: 0.3,
  };
  return [home, ...pages, ...servicePages, ...albums, legal];
}
