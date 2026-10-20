import { NextResponse } from "next/server";
import { services } from "@/data/services";

/**
 * Bảo vệ khu vực quản trị NGAY TRÊN SERVER (trước khi render, không lộ HTML/JS của /admin):
 *
 * /admin/*  — hỏi backend /auth/me bằng cookie của request:
 *   • hợp lệ                        → cho vào
 *   • hết hạn nhưng còn phiên       → chuyển qua GET /api/v1/auth/resume (nơi refresh token được gửi),
 *                                     backend làm mới phiên rồi quay lại trang cũ
 *   • chưa đăng nhập                → hiển thị trang 403 (giữ nguyên URL, mã HTTP 403)
 *   • backend đang giới hạn tần suất → hiển thị trang 429 thân thiện (không đá sang /auth/resume)
 * /login    — đã đăng nhập → chuyển thẳng vào /admin
 * /san-pham/:slug, /dich-vu/:slug — slug không tồn tại → trang 404 với đúng mã HTTP 404
 *   (trang con render dạng streaming nên notFound() bên trong chỉ trả được mã 200)
 *
 * Proxy không giữ secret JWT: backend là nơi duy nhất kiểm tra token.
 * Lưu ý: địa chỉ chuyển tiếp /api/v1 (rewrites trong next.config.mjs) được chốt lúc BUILD —
 * đặt BACKEND_URL trước khi chạy `next build`.
 */
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const HINT = ["tdm_session", "__Host-tdm_session"];

/**
 * IP thật của người dùng (mục CUỐI của X-Forwarded-For do proxy/CDN phía trước thêm vào — người dùng
 * không giả được) → chuyển tiếp cho backend để giới hạn tần suất tính theo TỪNG người,
 * thay vì dồn mọi lượt hỏi từ server Next.js vào chung một IP.
 */
function forwardedFor(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return ip ? { "x-forwarded-for": ip } : {};
}

/** → { user } | { user: null, limited: true, retry } (bị giới hạn tần suất) | { user: null } */
async function currentUser(request) {
  const cookie = request.headers.get("cookie");
  if (!cookie) return { user: null };
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: { cookie, accept: "application/json", ...forwardedFor(request) },
      cache: "no-store",
      signal: AbortSignal.timeout(5000), // backend treo → không treo theo
    });
    if (res.status === 429) {
      return { user: null, limited: true, retry: res.headers.get("retry-after") ?? "60" };
    }
    if (!res.ok) return { user: null };
    return { user: (await res.json()).data.user };
  } catch {
    return { user: null }; // backend không phản hồi → coi như chưa đăng nhập
  }
}

/**
 * Trả trang lỗi (403 / 429) với ĐÚNG mã HTTP, giữ nguyên URL /admin… trên thanh địa chỉ.
 * (NextResponse.rewrite luôn giữ mã 200 nên proxy tự lấy HTML của trang lỗi.)
 */
async function statusPage(request, status, params) {
  const url = new URL(`/${status}`, request.url);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
  };
  try {
    const page = await fetch(url, {
      headers: { accept: "text/html" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return new NextResponse(page.body, { status, headers });
  } catch {
    return NextResponse.rewrite(url); // dự phòng: vẫn hiện trang lỗi (mã 200)
  }
}

const SERVICE_SLUGS = new Set(services.map((s) => s.slug));

/** Sản phẩm (lưu ở MongoDB) có tồn tại không — lỗi mạng thì coi như có (trang tự xử lý). */
async function productExists(request, slug) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/${encodeURIComponent(slug)}`, {
      headers: { accept: "application/json", ...forwardedFor(request) },
      signal: AbortSignal.timeout(4000),
    });
    return res.status !== 404;
  } catch {
    return true;
  }
}

/** Trả trang 404 (app/not-found.js) với đúng mã HTTP 404, giữ nguyên URL. */
async function notFoundPage(request) {
  try {
    const page = await fetch(new URL("/__not-found", request.url), {
      headers: { accept: "text/html" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return new NextResponse(page.body, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  } catch {
    return NextResponse.next(); // dự phòng: trang tự hiện 404 qua notFound()
  }
}

const hasSession = (request) => HINT.some((n) => request.cookies.has(n));

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;

  const slugOf = (prefix) => decodeURIComponent(pathname.slice(prefix.length)).replace(/\/$/, "");
  if (pathname.startsWith("/dich-vu/")) {
    return SERVICE_SLUGS.has(slugOf("/dich-vu/")) ? NextResponse.next() : notFoundPage(request);
  }
  if (pathname.startsWith("/san-pham/")) {
    return (await productExists(request, slugOf("/san-pham/")))
      ? NextResponse.next()
      : notFoundPage(request);
  }

  const { user, limited, retry } = await currentUser(request);

  if (pathname === "/login") {
    return user ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  // Bị giới hạn tần suất → trang /429 thân thiện (đếm ngược theo ?retry=, "Thử lại" về đúng trang),
  // KHÔNG coi là hết phiên (tránh chuyển sang /auth/resume rồi bị chặn tiếp)
  if (limited) {
    const url = new URL("/429", request.url);
    url.searchParams.set("next", pathname + search);
    url.searchParams.set("retry", retry);
    return NextResponse.redirect(url);
  }

  // /admin/*
  if (user) {
    // Vừa khôi phục phiên xong → bỏ tham số kỹ thuật khỏi thanh địa chỉ
    if (request.nextUrl.searchParams.has("resumed")) {
      const clean = request.nextUrl.clone();
      clean.searchParams.delete("resumed");
      return NextResponse.redirect(clean);
    }
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "private, no-store");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
  // Có cờ phiên mà access token hết hạn → khôi phục phiên (backend xoá cờ nếu thất bại → không lặp)
  if (hasSession(request) && request.nextUrl.searchParams.get("resumed") !== "1") {
    const back = new URL(pathname, request.url);
    request.nextUrl.searchParams.forEach((v, k) => back.searchParams.set(k, v));
    back.searchParams.set("resumed", "1");
    const resume = new URL("/api/v1/auth/resume", request.url);
    resume.searchParams.set("next", back.pathname + back.search);
    return NextResponse.redirect(resume);
  }

  return statusPage(request, 403, { from: pathname + search });
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/login", "/san-pham/:slug", "/dich-vu/:slug"],
};
