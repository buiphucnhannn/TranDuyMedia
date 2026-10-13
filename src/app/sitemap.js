import { mainNav, siteConfig } from "@/config/site";
import { collections } from "@/data/collections";
import { services } from "@/data/services";

export default function sitemap() {
  // Trang chủ không nằm trong menu (logo thay thế) nên thêm riêng
  const home = { url: siteConfig.url, changeFrequency: "weekly", priority: 1 };
  const pages = mainNav
    .filter((item) => !item.href.includes("#"))
    .map((item) => ({
      url: `${siteConfig.url}${item.href}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  const albums = collections.map((c) => ({
    url: `${siteConfig.url}/studio/${c.slug}`,
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
