"use client";

import { siteConfig } from "@/config/site";

/**
 * Gọi API backend từ trình duyệt (cùng tên miền → cookie HttpOnly tự gửi kèm, JS không đọc được token).
 * Access token hết hạn (401 TOKEN_EXPIRED) → tự gọi /auth/refresh MỘT lần rồi thử lại request.
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
const refreshSession = () =>
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

  if (res.status === 401 && data?.error?.code === "TOKEN_EXPIRED" && retry) {
    if (await refreshSession()) return api(path, { body, headers, retry: false, ...init });
  }
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}
