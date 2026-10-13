import { siteConfig } from "@/config/site";

/**
 * Tạo metadata cho từng trang, kế thừa cấu hình chung.
 * @param {{ title?: string, description?: string, path?: string, image?: string }} options
 */
export function createMetadata({ title, description, path = "/", image } = {}) {
  const desc = description || siteConfig.description;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: desc,
      url: path,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: desc,
      images: [ogImage],
    },
  };
}
