import { Marquee } from "@/components/ui";

const items = [
  "TVC & iTVC",
  "Video documentary",
  "Phim doanh nghiệp",
  "Video sự kiện",
  "Cho thuê studio",
  "Chụp ảnh thương mại",
  "Lookbook & Key visual",
  "Video performance",
];

// Dải chữ chạy ngay dưới hero: liệt kê các mảng dịch vụ.
export function ServiceMarquee() {
  return (
    <Marquee
      items={items}
      duration="48s"
      className="border-b border-ink/10 bg-paper py-5"
      itemClassName="text-lg font-medium tracking-tight text-ink/70 sm:text-xl"
    />
  );
}
