import { SmartImage as Image } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";

/**
 * Logo thật của khách (public/images/brand). Tỉ lệ 989x768.
 * light=true: bản chữ trắng + tam giác cam, đặt trên ảnh/nền tối.
 * Hai bản chồng lên nhau và mờ dần → đổi theme header không bị nháy.
 */
export function Logo({ className = "h-10", light = false, preload = false }) {
  return (
    <span className={cn("relative block aspect-[989/768]", className)}>
      <Image
        src="/images/brand/logo.webp"
        alt="Tran Duy Media Studio"
        fill
        sizes="80px"
        preload={preload}
        className={cn("object-contain transition-opacity duration-500", light && "opacity-0")}
      />
      <Image
        src="/images/brand/logo-light.webp"
        alt=""
        fill
        sizes="80px"
        className={cn("object-contain transition-opacity duration-500", !light && "opacity-0")}
      />
    </span>
  );
}
