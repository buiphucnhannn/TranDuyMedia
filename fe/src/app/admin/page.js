import { OverviewDashboard } from "@/components/admin/overview/OverviewDashboard";

// Trang cùng cấp với layout quản trị → template của layout không áp dụng, đặt tên tab đầy đủ
export const metadata = { title: { absolute: "Tổng quan | Quản trị Tran Duy Media" } };

export default function Page() {
  return <OverviewDashboard />;
}
