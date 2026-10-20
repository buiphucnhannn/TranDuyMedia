import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: { default: "Quản trị", template: "%s - Quản trị | Tran Duy Media" },
  robots: { index: false, follow: false },
};

/** Khu quản trị — đã được proxy.js kiểm tra đăng nhập trước khi render. */
export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
