import { mainNav, siteConfig } from "@/config/site";
import { getProducts } from "@/lib/products";
import { services } from "@/data/services";

export default async function sitemap() {
  const products = await getProducts();
  // Trang chủ không nằm trong menu (logo thay thế) nên thêm riêng
  const home = { url: siteConfig.url, changeFrequency: "weekly", priority: 1 };
  const pages = mainNav
    .filter((item) => !item.href.includes("#"))
    .map((item) => ({
      url: `${siteConfig.url}${item.href}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  const albums = products.map((p) => ({
    url: `${siteConfig.url}/san-pham/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const servicePages = services.map((s) => ({
    url: `${siteConfig.url}/dich-vu/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [home, ...pages, ...servicePages, ...albums];
}
