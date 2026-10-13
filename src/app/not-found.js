import { Icon } from "@/components/icons";
import { Button, Container } from "@/components/ui";

export const metadata = {
  title: "Không tìm thấy trang",
};

export default function NotFound() {
  return (
    <section className="bg-navy-950 text-white" data-nav-theme="dark">
      <Container className="flex min-h-[80vh] flex-col items-center justify-center py-32 text-center">
        <p className="text-8xl h-display text-orange-500 sm:text-9xl">404</p>
        <h1 className="mt-4 text-3xl h-display sm:text-4xl">Không tìm thấy trang</h1>
        <p className="mt-4 max-w-md text-white/70">
          Trang bạn tìm có thể đã bị xoá, đổi tên hoặc tạm thời không khả dụng.
        </p>
        <Button href="/" variant="white" className="mt-10">
          <Icon name="arrowRight" className="size-4 rotate-180" />
          Về trang chủ
        </Button>
      </Container>
    </section>
  );
}
