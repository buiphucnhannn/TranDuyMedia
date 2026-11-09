import {
  BehindScenes,
  Hero,
  Intro,
  Partners,
  Process,
  Showreel,
  VideoFocus,
} from "@/components/sections";
import { getHome } from "@/lib/home";

// Thứ tự theo feedback 02/11: khối "Đối tác tiêu biểu" chuyển xuống cuối (ngay trên "Bắt đầu dự án…"),
// khối cảm nhận khách hàng thay bằng ảnh hậu trường sản xuất cuộn ngang (#hau-truong).
// Ảnh hero, video showreel, ảnh giới thiệu và thẻ dịch vụ do quản trị chỉnh ở tab "Trang chủ" (ô trống → mặc định).
export default async function HomePage() {
  const home = await getHome();
  return (
    <>
      <Hero slides={home.hero} />
      <Showreel video={home.showreel} />
      <Intro images={home.intro} />
      <VideoFocus panels={home.services} />
      <Process />
      <BehindScenes />
      <Partners />
    </>
  );
}
