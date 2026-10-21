/** Dùng chung cho website (server) và trang quản trị (trình duyệt). */
const pad2 = (n) => String(n).padStart(2, "0");

/** "15 ảnh · 01 video" — đếm ảnh và video (cả tải lên lẫn link YouTube / Vimeo) riêng. */
export function mediaCount(media) {
  const videos = media.filter((m) => m.type !== "image").length;
  const photos = media.length - videos;
  return (
    [photos && `${pad2(photos)} ảnh`, videos && `${pad2(videos)} video`]
      .filter(Boolean)
      .join(" - ") || "00 ảnh"
  );
}
