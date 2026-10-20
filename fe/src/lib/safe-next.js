/**
 * Chỉ chấp nhận đường dẫn nội bộ thuộc khu quản trị cho tham số ?next= / ?from=
 * → không bị lợi dụng để chuyển hướng sang trang lừa đảo (open redirect).
 */
export function safeNext(value, fallback = "/admin") {
  if (!value || typeof value !== "string") return fallback;
  if (!value.startsWith("/admin") || value.startsWith("//") || value.includes("\\"))
    return fallback;
  const url = new URL(value, "http://x");
  url.searchParams.delete("resumed");
  return url.pathname + url.search;
}
