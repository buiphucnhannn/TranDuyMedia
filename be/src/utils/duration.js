/** "15m" | "7d" | "12h" | "30s" | "900" → mili-giây. */
const UNIT = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 };

export function toMs(value) {
  const m = /^(\d+)\s*([smhd]?)$/i.exec(String(value).trim());
  if (!m) throw new Error(`Thời lượng không hợp lệ: ${value}`);
  return Number(m[1]) * (UNIT[m[2].toLowerCase()] ?? 1e3);
}
