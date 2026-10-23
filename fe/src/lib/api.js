"use client";

import { siteConfig } from "@/config/site";

/**
 * Gọi API backend từ trình duyệt (cùng tên miền → cookie HttpOnly tự gửi kèm, JS không đọc được token).
 * Access token hết hạn / mất (401) → tự gọi /auth/refresh MỘT lần rồi thử lại request; phiên hết
 * hạn thật (refresh cũng thất bại) → về trang đăng nhập, đăng nhập xong quay lại đúng trang cũ.
 * Nhiều request hết hạn cùng lúc chỉ dùng chung một lần refresh.
 */
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error?.message || "Đã có lỗi xảy ra, vui lòng thử lại");
    this.status = status;
    this.code = body?.error?.code;
    this.details = body?.error?.details;
  }
}

let refreshing = null;
/**
 * Làm mới phiên DÙNG CHUNG cho mọi nơi gọi API (api() bên dưới, hàng đợi tải tệp ở jobs.js…):
 * mọi request hết hạn cùng lúc chỉ tạo MỘT lần refresh — nhiều lần refresh đồng thời bằng cùng
 * một refresh token sẽ bị backend coi là dùng lại token và có thể thu hồi phiên oan.
 */
export const refreshSession = () =>
  (refreshing ??= fetch(`${siteConfig.apiUrl}/auth/refresh`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "X-Requested-With": "fetch" },
  })
    .then((r) => r.ok)
    .finally(() => (refreshing = null)));

export async function api(path, { body, headers, retry = true, ...init } = {}) {
  let res;
  try {
    res = await fetch(`${siteConfig.apiUrl}${path}`, {
      credentials: "same-origin",
      ...init,
      headers: {
        Accept: "application/json",
        // Header chống CSRF — backend từ chối request ghi không có header này
        "X-Requested-With": "fetch",
        ...(body !== undefined &&
          !(body instanceof FormData) && { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, null); // mất mạng / máy chủ không phản hồi
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);

  // 401 ở API thường (không phải đăng nhập / làm mới phiên): access token hết hạn HOẶC không còn
  // (cookie bị trình duyệt xoá) → thử làm mới phiên bằng refresh token rồi gọi lại đúng 1 lần.
  const isAuthCall = path.startsWith("/auth/");
  if (res.status === 401 && !isAuthCall && retry && SESSION_CODES.has(data?.error?.code)) {
    if (await refreshSession()) return api(path, { body, headers, retry: false, ...init });
    // Refresh token cũng hết hạn / bị thu hồi → phiên kết thúc thật: về trang đăng nhập, đăng nhập
    // xong quay lại đúng trang đang làm. Promise treo lại để nơi gọi không hiện thêm lỗi chồng lên.
    if (redirectToLogin()) return new Promise(() => {});
  }
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

const SESSION_CODES = new Set(["TOKEN_EXPIRED", "UNAUTHENTICATED", "SESSION_EXPIRED"]);

/** Chuyển sang /login?next=<trang hiện tại>&het-phien=1 (chỉ trong khu quản trị). */
export function redirectToLogin() {
  if (typeof window === "undefined" || !window.location.pathname.startsWith("/admin")) return false;
  const next = window.location.pathname + window.location.search;
  window.location.replace(`/login?next=${encodeURIComponent(next)}&het-phien=1`);
  return true;
}
