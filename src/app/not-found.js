import { Icon } from "@/components/icons";
import { Button, Container } from "@/components/ui";

export const metadata = {
  title: "Không tìm thấy trang",
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-8xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Không tìm thấy trang</h1>
      <p className="mt-4 max-w-md text-zinc-600">
        Trang bạn tìm có thể đã bị xoá, đổi tên hoặc tạm thời không khả dụng.
      </p>
      <Button href="/" className="mt-10">
        <Icon name="arrowRight" className="size-4 rotate-180" />
        Về trang chủ
      </Button>
    </Container>
  );
}
