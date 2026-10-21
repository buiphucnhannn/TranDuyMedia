import { ErrorScreen } from "@/components/ui/ErrorScreen";

export const metadata = {
  title: "404 - Không tìm thấy trang",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      eyebrow="Cảnh này không có trong kịch bản"
      title="Không tìm thấy trang"
      description="Trang bạn tìm có thể đã được đổi tên, gỡ xuống hoặc đường dẫn chưa chính xác."
      actions={[
        { href: "/", label: "Về trang chủ", primary: true },
        { href: "/dich-vu", label: "Xem dịch vụ" },
      ]}
    />
  );
}
