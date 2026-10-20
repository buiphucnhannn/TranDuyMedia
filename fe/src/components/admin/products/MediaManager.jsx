"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { zoomStyle } from "@/lib/crop";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { ImageCropper } from "./ImageCropper";
import { VideoPreview } from "./VideoPreview";
import {
  ACCEPT,
  checkFile,
  guessLinkType,
  MAX_IMAGE_MB,
  MAX_VIDEO_MB,
  newKey,
  CROPPABLE,
  parseEmbed,
  isImage,
  keepImagesFirst,
  playUrl,
  previewOf,
} from "./media-utils";

const TYPE_LABEL = { image: "Ảnh", video: "Video", embed: "YouTube / Vimeo" };

/**
 * Quản lý ảnh & video của sản phẩm:
 * - Kéo-thả hoặc bấm để chọn tệp từ máy (nhiều tệp một lúc).
 * - Dán link ảnh / video / YouTube / Vimeo.
 * - Kéo thả thẻ để sắp xếp; tệp đầu tiên là ảnh bìa. Bấm vào 3 ảnh đầu (biểu tượng bút) để cắt khung hiển thị.
 * - Ảnh bìa + ảnh nổi bật (3 ô đầu) chỉ dùng ảnh — video luôn xếp phía sau.
 * Tệp chỉ được tải lên khi bấm "Lưu" (xem jobs.js).
 */
export function MediaManager({ items, onChange, error }) {
  const input = useRef(null);
  const [link, setLink] = useState("");
  const [over, setOver] = useState(false);
  const [dragKey, setDragKey] = useState(null);
  const [cropKey, setCropKey] = useState(null);
  const cropItem = cropKey && items.find((m) => m.key === cropKey);
  const [playKey, setPlayKey] = useState(null);
  const playItem = playKey && items.find((m) => m.key === playKey);
  const visual = items.filter(isImage);
  const featured = Math.min(CROPPABLE, visual.length); // số ô đầu chỉ dành cho ảnh

  // Mọi thay đổi danh sách đều qua đây: luôn đưa ảnh lên các ô bìa / nổi bật
  const commit = (list) => onChange(keepImagesFirst(list));

  const addFiles = (files) => {
    const next = [];
    const problems = [];
    for (const file of files) {
      const problem = checkFile(file);
      if (problem) problems.push(problem);
      else
        next.push({
          key: newKey(),
          source: "file",
          type: file.type.startsWith("video/") ? "video" : "image",
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          pos: "center",
        });
    }
    if (problems.length) {
      toast.warning(problems.slice(0, 3).join(" "), {
        title: problems.length > 1 ? `${problems.length} tệp chưa được thêm` : "Tệp chưa được thêm",
      });
    }
    if (next.length) commit([...items, ...next]);
  };

  const addLink = () => {
    const url = link.trim();
    if (!url) return;
    if (!/^https?:\/\/\S+\.\S+/i.test(url)) {
      return toast.warning("Link cần bắt đầu bằng http:// hoặc https://", {
        title: "Link chưa hợp lệ",
      });
    }
    if (items.some((m) => m.url === url || m.sourceUrl === url)) {
      return toast.info("Link này đã có trong danh sách.", { title: "Đã thêm trước đó" });
    }
    const embed = parseEmbed(url);
    commit([
      ...items,
      embed
        ? { key: newKey(), source: "existing", ...embed, sourceUrl: url, pos: "center" }
        : {
            key: newKey(),
            source: "link",
            type: guessLinkType(url),
            url,
            preview: url,
            sourceUrl: url,
            pos: "center",
          },
    ]);
    setLink("");
  };

  const update = (key, patch) =>
    onChange(items.map((m) => (m.key === key ? { ...m, ...patch } : m)));
  const remove = (key) => {
    const m = items.find((x) => x.key === key);
    if (m?.source === "file") URL.revokeObjectURL(m.preview);
    commit(items.filter((x) => x.key !== key));
  };
  const move = (from, to) => {
    if (to < 0 || to >= items.length || from === to) return;
    if (!isImage(items[from]) && to < featured) {
      toast.info("Ảnh bìa và ảnh nổi bật chỉ dùng ảnh, video sẽ nằm phía sau.", {
        title: "Không thể đưa video lên đầu",
      });
      return;
    }
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    commit(next);
  };

  return (
    <div>
      {/* Vùng chọn tệp */}
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes("Files")) return;
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return;
          e.preventDefault();
          setOver(false);
          addFiles([...e.dataTransfer.files]);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-7 text-center transition",
          over
            ? "border-orange-500 bg-orange-50"
            : error
              ? "border-red-300 bg-red-50/40"
              : "border-ink/15 bg-paper/60 hover:border-ink/30",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm ring-1 ring-ink/5">
          <Icon name="image" className="size-5" />
        </span>
        <span className="mt-3 text-sm font-semibold text-ink">
          Kéo thả ảnh / video vào đây hoặc bấm để chọn
        </span>
        <span className="mt-1 text-xs text-ink-muted">
          JPG, PNG, WEBP (≤ {MAX_IMAGE_MB}MB) - MP4, MOV, WEBM (≤ {MAX_VIDEO_MB}MB) - chọn được
          nhiều tệp
        </span>
      </button>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => {
          addFiles([...e.target.files]);
          e.target.value = "";
        }}
      />

      {/* Thêm bằng link */}
      <div className="mt-3 flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Dán link ảnh, video hoặc YouTube</span>
          <Icon
            name="external"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted"
          />
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLink();
              }
            }}
            placeholder="Hoặc dán link ảnh, video, YouTube / Vimeo…"
            className="field pl-11"
          />
        </label>
        <button
          type="button"
          onClick={addLink}
          disabled={!link.trim()}
          className="shrink-0 rounded-xl bg-navy-950 px-5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-40"
        >
          Thêm
        </button>
      </div>
      {error && <p className="mt-2 pl-1 text-left text-[12px] text-red-600">{error}</p>}

      {/* Danh sách */}
      {items.length > 0 && (
        <>
          <p className="mt-5 mb-2 text-left text-xs text-ink-muted">
            {items.length} tệp - kéo thả để sắp xếp - ảnh đầu là{" "}
            <strong className="font-semibold text-ink">ảnh bìa</strong>, 2 ảnh kế là{" "}
            <strong className="font-semibold text-ink">ảnh nổi bật</strong>
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((m, i) => {
              const src = previewOf(m);
              // Chỉ ảnh bìa + ảnh nổi bật bị đóng khung trên website → chỉ những ảnh này cắt được
              const rank = visual.indexOf(m);
              const croppable = rank >= 0 && rank < CROPPABLE;
              return (
                <li
                  key={m.key}
                  draggable
                  onDragStart={(e) => {
                    setDragKey(m.key);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => dragKey && e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    move(
                      items.findIndex((x) => x.key === dragKey),
                      i,
                    );
                    setDragKey(null);
                  }}
                  onDragEnd={() => setDragKey(null)}
                  className={cn(
                    "group overflow-hidden rounded-xl bg-white ring-1 ring-ink/10 transition",
                    dragKey === m.key && "opacity-40",
                    rank === 0 && "ring-2 ring-orange-500",
                  )}
                >
                  <div className="relative aspect-4/3 cursor-grab overflow-hidden bg-paper-200 active:cursor-grabbing">
                    {src ? (
                      <span
                        className="absolute inset-0"
                        style={croppable ? zoomStyle(m) : undefined}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- xem trước tệp cục bộ / link bất kỳ */}
                        <img
                          src={src}
                          alt=""
                          className="size-full object-cover"
                          style={{ objectPosition: croppable ? m.pos : undefined }}
                          draggable={false}
                        />
                      </span>
                    ) : m.type === "video" && playUrl(m) ? (
                      // Chưa có ảnh đại diện → lấy 1 khung hình ở khoảng 1/3 video (đầu video thường tối)
                      <video
                        src={playUrl(m)}
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={(e) => {
                          const v = e.currentTarget;
                          v.currentTime = Math.min(Math.max(v.duration * 0.3, 1), 15) || 1;
                        }}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-ink-muted">
                        <Icon name="film" className="size-6" />
                      </span>
                    )}

                    {m.type === "image" ? (
                      // Ảnh: rê chuột → hiện bút; bấm → mở công cụ cắt khung
                      croppable && (
                        <button
                          type="button"
                          onClick={() => setCropKey(m.key)}
                          aria-label="Cắt khung hiển thị"
                          className="absolute inset-0 flex items-center justify-center bg-navy-950/0 transition group-hover:bg-navy-950/35 focus-visible:bg-navy-950/35"
                        >
                          <span className="flex size-10 scale-75 items-center justify-center rounded-full bg-white text-navy-950 opacity-0 shadow-soft transition group-hover:scale-100 group-hover:opacity-100 in-focus-visible:opacity-100 [@media(hover:none)]:absolute [@media(hover:none)]:right-2 [@media(hover:none)]:bottom-2 [@media(hover:none)]:size-8 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100">
                            <Icon name="pen" className="size-4" />
                          </span>
                        </button>
                      )
                    ) : (
                      <>
                        {/* Video / link nhúng: bấm → xem trước (phát, tua, dừng) */}
                        <button
                          type="button"
                          onClick={() => setPlayKey(m.key)}
                          aria-label="Xem trước video"
                          className="absolute inset-0 flex items-center justify-center bg-navy-950/10 transition group-hover:bg-navy-950/35 focus-visible:bg-navy-950/35"
                        >
                          <span className="flex size-11 items-center justify-center rounded-full bg-white/95 text-navy-950 shadow-soft transition group-hover:scale-110">
                            <Icon
                              name="play"
                              className="ml-0.5 size-4"
                              strokeWidth={0}
                              fill="currentColor"
                            />
                          </span>
                        </button>
                      </>
                    )}
                    <span className="absolute top-2 left-2 flex gap-1">
                      {rank === 0 && (
                        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          Ảnh bìa
                        </span>
                      )}
                      {m.type !== "image" && (
                        <span className="rounded-full bg-navy-950/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {TYPE_LABEL[m.type]}
                        </span>
                      )}
                      {croppable && rank > 0 && (
                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink">
                          Ảnh nổi bật
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(m.key)}
                      aria-label="Gỡ tệp này"
                      className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition hover:bg-red-600 hover:text-white"
                    >
                      <Icon name="close" className="size-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-1.5">
                    <IconBtn
                      label="Lên trước"
                      icon="chevronLeft"
                      disabled={i === 0 || (!isImage(m) && i - 1 < featured)}
                      onClick={() => move(i, i - 1)}
                    />
                    <IconBtn
                      label="Ra sau"
                      icon="chevronRight"
                      disabled={i === items.length - 1}
                      onClick={() => move(i, i + 1)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {playItem && (
        <VideoPreview
          type={playItem.type}
          url={playUrl(playItem)}
          poster={playItem.poster}
          name={playItem.name}
          onClose={() => setPlayKey(null)}
        />
      )}

      {cropItem && (
        <ImageCropper
          item={{
            key: cropItem.key,
            src: previewOf(cropItem),
            pos: cropItem.pos,
            zoom: cropItem.zoom,
          }}
          rank={visual.indexOf(cropItem)}
          onClose={() => setCropKey(null)}
          onApply={(crop) => {
            update(cropItem.key, crop);
            setCropKey(null);
          }}
        />
      )}
    </div>
  );
}

function IconBtn({ label, icon, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex size-7 items-center justify-center rounded-lg text-ink-soft transition hover:bg-paper hover:text-ink disabled:opacity-30"
      {...props}
    >
      <Icon name={icon} className="size-3.5" />
    </button>
  );
}
