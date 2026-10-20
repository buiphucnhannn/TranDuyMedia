import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { ApiError } from "#utils/api-error.js";

const MB = 1024 * 1024;
const MAX_REDIRECTS = 5;
// Giả lập trình duyệt: nhiều trang chặn tải ảnh từ máy chủ lạ / thiếu Referer
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,video/*,*/*;q=0.8",
  "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
};

const importError = (message) => ApiError.badRequest(message, { code: "IMPORT_FAILED" });

/** IP nội bộ / loopback / link-local → không cho tải (chống SSRF dò mạng nội bộ của máy chủ). */
function isPrivateIp(ip) {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  return v6 === "::" || v6 === "::1" || /^f[cd]/.test(v6) || /^fe[89ab]/.test(v6);
}

async function assertPublicUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw importError("Link không hợp lệ.");
  }
  if (!["http:", "https:"].includes(url.protocol))
    throw importError("Link phải bắt đầu bằng http:// hoặc https://");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host)
    ? [host]
    : await lookup(host, { all: true, verbatim: true })
        .then((r) => r.map((x) => x.address))
        .catch(() => {
          throw importError("Không tìm thấy trang chứa link này. Vui lòng kiểm tra lại link.");
        });
  if (!addresses.length || addresses.some(isPrivateIp))
    throw importError("Link này trỏ tới địa chỉ nội bộ, không được phép tải.");
  return url;
}

/**
 * Tải ảnh / video từ link về bộ nhớ (như trình duyệt), kiểm tra an toàn và dung lượng.
 * → { buffer, kind: "image" | "video", contentType }
 * Mỗi lần chuyển hướng đều kiểm tra lại địa chỉ (không bị lừa chuyển vào mạng nội bộ).
 */
export async function downloadRemoteFile(raw, { maxImageMb, maxVideoMb, timeoutMs = 60_000 }) {
  let url = await assertPublicUrl(raw);
  let res;
  for (let hop = 0; ; hop++) {
    try {
      res = await fetch(url, {
        redirect: "manual",
        headers: { ...BROWSER_HEADERS, Referer: `${url.origin}/` },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      throw importError(
        err?.name === "TimeoutError"
          ? "Trang chứa tệp phản hồi quá chậm. Vui lòng thử lại hoặc tải tệp về máy rồi chọn tệp."
          : "Không kết nối được tới trang chứa tệp. Vui lòng kiểm tra lại link.",
      );
    }
    if (res.status < 300 || res.status >= 400) break;
    const location = res.headers.get("location");
    if (!location || hop >= MAX_REDIRECTS) throw importError("Link chuyển hướng quá nhiều lần.");
    url = await assertPublicUrl(new URL(location, url).href);
  }

  if (!res.ok) {
    throw importError(
      [401, 403].includes(res.status)
        ? "Trang chứa ảnh không cho phép tải về (có thể ảnh riêng tư hoặc bị chặn). Hãy tải ảnh về máy rồi chọn tệp."
        : res.status === 404
          ? "Không tìm thấy tệp ở link này (có thể link đã hết hạn)."
          : res.status >= 500
            ? `Trang chứa tệp đang lỗi (mã ${res.status}). Vui lòng thử lại sau.`
            : `Trang chứa tệp từ chối cho tải (mã ${res.status}). Hãy tải tệp về máy rồi chọn tệp.`,
    );
  }

  const contentType = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  // Một số máy chủ trả "application/octet-stream" cho ảnh → đoán theo đuôi tệp
  const ext = url.pathname.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? "";
  const generic = !contentType || /octet-stream|binary/.test(contentType);
  const kind =
    contentType.startsWith("image/") || (generic && /^(jpe?g|png|webp|avif|gif|heic)$/.test(ext))
      ? "image"
      : contentType.startsWith("video/") || (generic && /^(mp4|mov|webm|m4v)$/.test(ext))
        ? "video"
        : null;
  if (!kind) {
    res.body?.cancel().catch(() => {});
    throw importError(
      contentType.includes("html")
        ? "Link này là một trang web, không phải tệp ảnh. Hãy bấm chuột phải vào ảnh → “Sao chép địa chỉ hình ảnh” rồi dán lại."
        : "Link không phải ảnh hoặc video.",
    );
  }

  const limit = (kind === "image" ? maxImageMb : maxVideoMb) * MB;
  const label = kind === "image" ? `Ảnh tối đa ${maxImageMb}MB` : `Video tối đa ${maxVideoMb}MB`;
  if (Number(res.headers.get("content-length")) > limit) {
    res.body?.cancel().catch(() => {});
    throw ApiError.payloadTooLarge(`Tệp ở link này quá nặng. ${label}.`);
  }

  // Đọc dần, dừng ngay khi vượt dung lượng (không tin hoàn toàn content-length)
  const chunks = [];
  let size = 0;
  for await (const chunk of res.body) {
    size += chunk.length;
    if (size > limit) {
      res.body.cancel?.().catch(() => {});
      throw ApiError.payloadTooLarge(`Tệp ở link này quá nặng. ${label}.`);
    }
    chunks.push(chunk);
  }
  return { buffer: Buffer.concat(chunks), kind, contentType };
}
