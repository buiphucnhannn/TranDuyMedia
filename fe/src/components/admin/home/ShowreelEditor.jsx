"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { HOME_FRAMES } from "@/data/home";
import { describeError } from "@/components/admin/products/jobs";
import { ImageSlot } from "./ImageSlot";

const PROVIDER = { youtube: "YouTube", drive: "Google Drive" };

/**
 * Video showreel: dán link YouTube (Công khai / Không công khai) hoặc Google Drive (đã chia sẻ "Bất kỳ ai có
 * đường liên kết") → máy chủ kiểm tra ngay (video riêng tư / chưa chia sẻ / không phải video → báo rõ cách sửa).
 * Hợp lệ → xem thử ngay tại đây; ảnh bìa tự lấy từ video hoặc tải ảnh riêng (cắt khung 2:1).
 * Để trống → website dùng video showreel mặc định.
 *
 * value: { url, check: { url, embed, provider, autoPoster } | null, poster, title, caption }
 */
export function ShowreelEditor({ value, error, defaults, onChange, onUploading }) {
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");
  const [playing, setPlaying] = useState(false);
  const link = value.url.trim();
  const ok = value.check && value.check.url === link ? value.check : null;
  const shownError = checkError || error;

  const check = async (raw = link) => {
    const url = raw.trim();
    if (!url) return;
    setChecking(true);
    setCheckError("");
    setPlaying(false);
    try {
      const res = await api("/home/video-check", { method: "POST", body: { url } });
      onChange("check", res.data);
    } catch (err) {
      onChange("check", null);
      setCheckError(describeError(err));
    } finally {
      setChecking(false);
    }
  };

  const clear = () => {
    onChange("url", "");
    onChange("check", null);
    onChange("poster", null);
    setCheckError("");
    setPlaying(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <div className="min-w-0 space-y-4">
        {/* Link video */}
        <div>
          <label
            htmlFor="showreel-url"
            className="mb-1.5 block text-xs font-semibold text-ink-soft"
          >
            Link video
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Icon
                name={ok?.provider === "youtube" ? "youtube" : "play"}
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted"
              />
              <input
                id="showreel-url"
                className="field pl-11"
                value={value.url}
                placeholder="https://youtu.be/... hoặc https://drive.google.com/file/d/..."
                spellCheck={false}
                aria-invalid={Boolean(shownError)}
                aria-describedby="showreel-url-note"
                onChange={(e) => {
                  onChange("url", e.target.value);
                  setCheckError("");
                }}
                // Dán link → kiểm tra luôn, không cần bấm nút
                onPaste={(e) => {
                  const text = e.clipboardData.getData("text");
                  if (text) setTimeout(() => check(text), 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    check();
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => check()}
              disabled={!link || checking || Boolean(ok)}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-navy-950 px-5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-40"
            >
              {checking ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Icon name="check" className="size-4" />
              )}
              {checking ? "Đang kiểm tra…" : ok ? "Link hợp lệ" : "Kiểm tra link"}
            </button>
          </div>
          <p
            id="showreel-url-note"
            className={cn("mt-1.5 text-xs", shownError ? "text-red-600" : "text-ink-muted")}
          >
            {shownError ||
              (link
                ? ok
                  ? `Video ${PROVIDER[ok.provider]} hợp lệ, xem được trên website.`
                  : "Bấm “Kiểm tra link” để xác nhận video xem được."
                : "Đang dùng video showreel mặc định của website.")}
          </p>
        </div>

        {/* Chữ đè lên khung video (góc dưới bên trái) — thứ tự ô nhập = thứ tự hiển thị: dòng nhỏ ở trên, tên video ở dưới */}
        <div className="grid gap-4 sm:grid-cols-[1fr_200px] sm:items-start">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-ink-soft">
                <Badge>1</Badge>
                Dòng chữ nhỏ trên tên video
              </span>
              <input
                className="field"
                value={value.caption}
                maxLength={120}
                placeholder={defaults.caption}
                onChange={(e) => onChange("caption", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-ink-soft">
                <Badge>2</Badge>
                Tên video (chữ lớn)
              </span>
              <input
                className="field"
                value={value.title}
                maxLength={80}
                placeholder={defaults.title}
                onChange={(e) => onChange("title", e.target.value)}
              />
            </label>
            <p className="text-xs text-ink-muted">
              Hai dòng chữ này nằm ở góc dưới bên trái khung video trên trang chủ (xem hình minh
              hoạ). Để trống thì dùng chữ mặc định đang hiện mờ trong ô.
            </p>
          </div>

          {/* Minh hoạ vị trí chữ trên khung video — cập nhật theo nội dung đang gõ */}
          <figure className="hidden sm:block">
            <div className="relative aspect-2/1 overflow-hidden rounded-lg bg-linear-to-br from-navy-800 to-navy-950 ring-1 ring-ink/10">
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/25 text-white">
                  <Icon name="play" className="ml-px size-3" strokeWidth={0} fill="currentColor" />
                </span>
              </span>
              <span className="absolute bottom-0 left-0 max-w-full p-2 text-white">
                <span className="flex items-center gap-1 text-[7px] tracking-wider text-white/70 uppercase">
                  <Badge small>1</Badge>
                  <span className="truncate">{value.caption.trim() || defaults.caption}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] leading-tight font-semibold">
                  <Badge small>2</Badge>
                  <span className="truncate">{value.title.trim() || defaults.title}</span>
                </span>
              </span>
            </div>
            <figcaption className="mt-1.5 text-center text-[11px] text-ink-muted">
              Vị trí trên khung video
            </figcaption>
          </figure>
        </div>

        <div className="rounded-2xl bg-paper/70 p-4 text-xs leading-relaxed text-ink-soft ring-1 ring-ink/5">
          <p className="mb-1.5 font-semibold text-ink">Link dùng được</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              <strong className="font-semibold">YouTube:</strong> video ở chế độ Công khai hoặc
              Không công khai (video Riêng tư không xem được trên website).
            </li>
            <li>
              <strong className="font-semibold">Google Drive:</strong> tệp video đã bật chia sẻ “Bất
              kỳ ai có đường liên kết” (quyền Người xem).
            </li>
          </ul>
        </div>
      </div>

      {/* Xem thử + ảnh bìa */}
      <div className="min-w-0 space-y-4">
        {ok ? (
          <>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-navy-950 ring-1 ring-ink/10">
              {playing ? (
                <iframe
                  src={
                    ok.provider === "youtube"
                      ? `${ok.embed}?autoplay=1&rel=0&playsinline=1`
                      : ok.embed
                  }
                  title="Xem thử video"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="size-full border-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group absolute inset-0 flex items-center justify-center"
                  aria-label="Xem thử video"
                >
                  {ok.autoPoster && (
                    // eslint-disable-next-line @next/next/no-img-element -- ảnh bìa lấy từ YouTube / Drive
                    <img
                      src={ok.autoPoster}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                  <span className="absolute inset-0 bg-navy-950/30" />
                  <span className="relative flex size-14 items-center justify-center rounded-full bg-white/90 text-navy-950 shadow-lg transition group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white">
                    <Icon
                      name="play"
                      className="ml-0.5 size-5"
                      strokeWidth={0}
                      fill="currentColor"
                    />
                  </span>
                </button>
              )}
              <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-ink shadow-sm">
                {PROVIDER[ok.provider]}
              </span>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition hover:text-red-600"
              >
                <Icon name="refresh" className="size-3.5" />
                Bỏ link, dùng video mặc định
              </button>
            </div>
            <ImageSlot
              label="Ảnh bìa video (tuỳ chọn)"
              hint="để trống thì lấy ảnh từ video"
              defaultLabel="Ảnh lấy từ video"
              frame={HOME_FRAMES.showreel}
              previews={[
                { caption: "Máy tính", note: "2:1", ratio: 2 },
                { caption: "Điện thoại", note: "4:3", ratio: 4 / 3 },
              ]}
              value={value.poster}
              fallback={ok.autoPoster ? { src: ok.autoPoster, pos: "center", zoom: 1 } : null}
              onChange={(next) => onChange("poster", next)}
              onUploadingChange={onUploading}
            />
          </>
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 p-6 text-center text-sm text-ink-muted">
            <Icon name="film" className="size-6" />
            {link ? "Kiểm tra link để xem thử video" : "Đang dùng video showreel mặc định"}
          </div>
        )}
      </div>
    </div>
  );
}

/** Số thứ tự nối ô nhập với vị trí trên hình minh hoạ. */
function Badge({ children, small }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-orange-500 font-bold text-white",
        small ? "size-2.5 text-[6px]" : "size-4 text-[10px]",
      )}
    >
      {children}
    </span>
  );
}
