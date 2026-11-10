"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { safeNext } from "@/lib/safe-next";
import { cn } from "@/lib/utils";

/**
 * Form đăng nhập quản trị (ID + mật khẩu). Token KHÔNG đi qua JavaScript: backend đặt cookie HttpOnly
 * trong response, form chỉ chuyển trang khi thành công.
 */

/** Thông báo thân thiện theo từng tình huống lỗi. */
function friendlyError(err) {
  if (err.code === "INVALID_CREDENTIALS")
    return "ID hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
  if (err.status === 429) return "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.";
  if (err.code === "VALIDATION_ERROR") return "Vui lòng nhập đầy đủ ID và mật khẩu.";
  if (err.code === "ADMIN_NOT_CONFIGURED") return err.message;
  if (err.status === 403) return "Yêu cầu bị từ chối. Vui lòng tải lại trang rồi thử lại.";
  if (err.status === 0 || err.status >= 500)
    return "Không kết nối được máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau ít phút.";
  return err.message || "Đăng nhập không thành công. Vui lòng thử lại.";
}
/**
 * Đăng nhập nhanh cho BẢN DEMO: chỉ hiện khi đặt cả 2 biến môi trường (fe/.env.local hoặc Vercel → Environment
 * Variables, rồi build lại). Không viết cứng vào code → tài khoản không nằm trong git.
 * LƯU Ý: biến NEXT_PUBLIC_* nằm trong mã gửi về trình duyệt — ai mở trang đăng nhập cũng vào được quản trị.
 * Chỉ bật cho bản demo; bản chính thức: XOÁ 2 biến này (nút tự biến mất) và đổi mật khẩu quản trị.
 */
const DEMO_LOGIN =
  process.env.NEXT_PUBLIC_DEMO_LOGIN_ID && process.env.NEXT_PUBLIC_DEMO_LOGIN_PASSWORD
    ? {
        username: process.env.NEXT_PUBLIC_DEMO_LOGIN_ID,
        password: process.env.NEXT_PUBLIC_DEMO_LOGIN_PASSWORD,
      }
    : null;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const expired = params.get("het-phien") === "1";
  const loggedOut = params.get("da-dang-xuat") === "1";

  // Bị chuyển về đây vì phiên đã hết hạn → báo nhẹ nhàng, đăng nhập xong quay lại đúng trang cũ
  useEffect(() => {
    if (expired)
      toast.info("Vui lòng đăng nhập lại để tiếp tục công việc.", {
        title: "Phiên đăng nhập đã hết hạn",
      });
  }, [expired]);

  // Vừa đăng xuất (trang quản trị chuyển về đây) → báo nhẹ, rồi bỏ tham số khỏi địa chỉ
  useEffect(() => {
    if (!loggedOut) return;
    toast.info("Bạn đã đăng xuất khỏi trang quản trị.", { title: "Đã đăng xuất" });
    window.history.replaceState(null, "", window.location.pathname);
  }, [loggedOut]);
  // Mặc định KHÔNG ghi nhớ (an toàn cho máy dùng chung): đóng trình duyệt là đăng xuất
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const set = (k) => (e) => setForm((v) => ({ ...v, [k]: e.target.value }));

  const login = async (body) => {
    setPending(true);
    try {
      await api("/auth/login", { method: "POST", body, retry: false });
      toast.success("Chào mừng bạn quay lại trang quản trị.", { title: "Đăng nhập thành công" });
      router.replace(next);
      router.refresh();
    } catch (err) {
      toast[err.status === 429 ? "warning" : "error"](friendlyError(err), {
        title: err.code === "INVALID_CREDENTIALS" ? "Đăng nhập không thành công" : undefined,
      });
      setForm((v) => ({ ...v, password: "" }));
      setPending(false);
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    login(form);
  };
  // Điền sẵn tài khoản demo (thấy được trên form) rồi đăng nhập luôn — vẫn theo lựa chọn "Ghi nhớ đăng nhập"
  const quickLogin = () => {
    const body = { ...form, ...DEMO_LOGIN };
    setForm(body);
    login(body);
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3" noValidate>
      <label className="relative block">
        <span className="absolute top-1.5 left-4 text-[10px] tracking-wider text-ink-muted uppercase">
          ID đăng nhập
        </span>
        <input
          type="text"
          name="username"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          className="field pt-5"
          placeholder="Nhập ID quản trị"
          value={form.username}
          onChange={set("username")}
        />
      </label>

      <label className="relative block">
        <span className="absolute top-1.5 left-4 text-[10px] tracking-wider text-ink-muted uppercase">
          Mật khẩu
        </span>
        <input
          type={show ? "text" : "password"}
          name="password"
          required
          autoComplete="current-password"
          className="field pt-5 pr-12"
          placeholder="••••••••••••"
          value={form.password}
          onChange={set("password")}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-ink/5 hover:text-ink"
        >
          <Icon name={show ? "eyeOff" : "eye"} className="size-[18px]" />
        </button>
      </label>

      {/*
        Ghi nhớ đăng nhập (căn giữa, ngay trên nút): có → giữ đăng nhập 7 ngày trên thiết bị này;
        không → đóng trình duyệt là đăng xuất. Ô vuông tự vẽ nhưng vẫn là checkbox thật (bàn phím, trình đọc màn hình).
      */}
      <label className="group mx-auto flex w-fit cursor-pointer items-center gap-2.5 pt-3 select-none">
        <input
          type="checkbox"
          name="remember"
          className="peer sr-only"
          checked={form.remember}
          onChange={(e) => setForm((v) => ({ ...v, remember: e.target.checked }))}
        />
        <span
          aria-hidden
          className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-ink/30 bg-white text-white transition group-hover:border-navy-950/60 peer-checked:border-navy-950 peer-checked:bg-navy-950 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 peer-focus-visible:ring-offset-2 [&>svg]:scale-50 [&>svg]:opacity-0 [&>svg]:transition peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
        >
          <Icon name="check" className="size-3" strokeWidth={3} />
        </span>
        <span className="text-sm text-ink-soft transition group-hover:text-ink">
          Ghi nhớ đăng nhập
        </span>
      </label>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={pending || !form.username || !form.password}
          className={cn(
            "group relative inline-flex h-12 min-w-[240px] items-center justify-center rounded-full bg-navy-950 px-14 text-sm font-semibold text-white transition hover:bg-navy-800 sm:min-w-[280px]",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {pending ? "Đang đăng nhập..." : "Đăng nhập"}
          <span className="absolute right-1.5 flex size-9 items-center justify-center rounded-full bg-orange-500 text-white transition-transform group-hover:translate-x-0.5">
            {pending ? (
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <Icon name="arrowRight" className="size-4" />
            )}
          </span>
        </button>
      </div>

      {DEMO_LOGIN && (
        <div className="pt-2">
          <div className="flex items-center gap-3 text-[11px] tracking-wider text-ink-muted uppercase">
            <span className="h-px flex-1 bg-ink/10" />
            Bản demo
            <span className="h-px flex-1 bg-ink/10" />
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={quickLogin}
              disabled={pending}
              className="inline-flex h-11 min-w-[240px] items-center justify-center gap-2 rounded-full border border-dashed border-orange-500/60 bg-orange-50 px-6 text-sm font-semibold text-orange-700 transition hover:border-orange-500 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[280px]"
            >
              <Icon name="sparkle" className="size-4" />
              Đăng nhập nhanh
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
