"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/ui";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { adminNav, findNav } from "./nav";

/**
 * Khung trang quản trị:
 * - Trái: thanh điều hướng tối (logo, các tab, tài khoản + đăng xuất). Mobile: ngăn kéo trượt.
 * - Phải: thanh tiêu đề tab hiện tại + vùng nội dung.
 * Quyền truy cập đã được kiểm tra ở proxy.js trước khi trang render.
 */
export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = findNav(pathname);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    api("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch(() => router.replace("/login"));
  }, [router]);

  const logout = async () => {
    setLeaving(true);
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    toast.info("Bạn đã đăng xuất khỏi trang quản trị.", { title: "Đã đăng xuất" });
    router.replace("/login");
    router.refresh();
  };

  const sidebar = (inDrawer = false) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 pt-7 pb-8">
        {/* Logo = nút xem website (mở trang chủ ở tab mới, trang quản trị vẫn giữ nguyên) */}
        <Link
          href="/"
          target="_blank"
          aria-label="Xem website (mở tab mới)"
          title="Xem website"
          className="rounded-lg transition-opacity hover:opacity-80"
        >
          <Logo light className="h-11" />
        </Link>
        {!inDrawer && (
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-eyebrow text-white/70 uppercase">
            Admin
          </span>
        )}
      </div>

      <p className="px-6 pb-3 text-[10px] font-semibold tracking-eyebrow text-white/35 uppercase">
        Quản lý
      </p>
      <nav aria-label="Điều hướng quản trị" className="flex-1 space-y-1 px-3">
        {adminNav.map((n) => {
          const active = n.href === current.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white text-ink" : "text-white/65 hover:bg-white/5 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-white/70 group-hover:text-white",
                )}
              >
                <Icon name={n.icon} className="size-4" />
              </span>
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white uppercase">
            {user?.name?.[0] ?? <Icon name="user" className="size-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? "…"}</p>
            <p className="truncate text-xs text-white/50">{user ? `ID: ${user.username}` : ""}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={leaving}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-[13px] font-medium text-white/75 transition hover:border-white/30 hover:text-white disabled:opacity-50"
        >
          <Icon name="logout" className="size-4" />
          {leaving ? "Đang đăng xuất..." : "Đăng xuất"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-paper lg:grid lg:grid-cols-[272px_1fr]">
      {/* Sidebar desktop */}
      <aside className="grain sticky top-0 hidden h-svh overflow-y-auto bg-navy-950 lg:block">
        {sidebar()}
      </aside>

      {/* Mobile: thanh trên + ngăn kéo */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-navy-950 px-4 py-3 lg:hidden">
        <Logo light className="h-9" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Mở menu quản trị"
          aria-expanded={open}
          className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <Icon name="menu" className="size-5" />
        </button>
      </div>
      <div
        className={cn(
          "fixed inset-0 z-50 transition lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-navy-950/60 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "grain absolute inset-y-0 left-0 w-[280px] overflow-y-auto bg-navy-950 transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
            className="absolute top-6 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <Icon name="close" className="size-4" />
          </button>
          {sidebar(true)}
        </aside>
      </div>

      {/* Nội dung */}
      <div className="flex min-w-0 flex-col">
        <header className="border-b border-ink/10 bg-white/80 px-5 py-5 backdrop-blur sm:px-8 lg:py-6">
          <nav aria-label="Breadcrumb" className="text-xs text-ink-muted">
            <Link href="/admin" className="hover:text-ink">
              Quản trị
            </Link>
            {current.href !== "/admin" && <span className="px-2 text-ink/25">/</span>}
            {current.href !== "/admin" && <span className="text-ink-soft">{current.label}</span>}
          </nav>
          {/* Icon cao bằng khối tiêu đề + mô tả; các dòng cách nhau vừa phải cho dễ đọc */}
          <div className="mt-3.5 flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-navy-950 text-orange-500">
              <Icon name={current.icon} className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl h-display text-ink" style={{ lineHeight: 1.2 }}>
                {current.label}
              </h1>
              <p className="mt-1 text-left text-sm text-ink-soft">{current.desc}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 sm:p-8 sm:pt-6">{children}</main>
      </div>
    </div>
  );
}
