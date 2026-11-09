"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  DEFAULT_HERO,
  DEFAULT_INTRO,
  DEFAULT_SERVICES,
  DEFAULT_SHOWREEL,
  HERO_SLOTS,
  HOME_FRAMES,
  SERVICES_MAX,
} from "@/data/home";
import { services as serviceList } from "@/data/services";
import { describeError, revalidateSite } from "@/components/admin/products/jobs";
import { LinkInput, Select } from "./Dropdown";
import { ImageSlot } from "./ImageSlot";
import { ShowreelEditor } from "./ShowreelEditor";

/** Trang trong website gợi ý cho ô "Xem thêm". */
const PAGES = [
  ...serviceList.map((s) => ({ value: `/dich-vu/${s.slug}`, label: s.title })),
  { value: "/dich-vu", label: "Tất cả dịch vụ" },
  { value: "/san-pham", label: "Sản phẩm" },
  { value: "/gioi-thieu", label: "Về chúng tôi" },
  { value: "/lien-he", label: "Liên hệ" },
];
/** Dịch vụ chọn sẵn trong form "Liên hệ tư vấn". */
const BOOKING_OPTIONS = [
  { value: "", label: "Không chọn sẵn" },
  ...serviceList.map((s) => ({ value: s.slug, label: s.title })),
];

/** Thẻ mặc định → dạng chỉnh sửa (ảnh mặc định = null: website tự dùng ảnh có sẵn). */
const defaultCards = () => DEFAULT_SERVICES.map((c) => ({ ...c, key: newKey(), image: null }));
let seq = 0;
const newKey = () => `c${Date.now().toString(36)}${(seq++).toString(36)}`;

/** Dữ liệu từ máy chủ → bản nháp để chỉnh. */
function toDraft(d) {
  return {
    hero: Array.from({ length: HERO_SLOTS }, (_, i) => d?.hero?.[i] ?? null),
    showreel: {
      url: d?.showreel?.url ?? "",
      check: d?.showreel?.embed
        ? {
            url: d.showreel.url,
            embed: d.showreel.embed,
            provider: d.showreel.provider,
            autoPoster: d.showreel.autoPoster,
          }
        : null,
      poster: d?.showreel?.poster ?? null,
      title: d?.showreel?.title ?? "",
      caption: d?.showreel?.caption ?? "",
    },
    intro: { main: d?.intro?.main ?? null, side: d?.intro?.side ?? null },
    services: d?.services?.length
      ? d.services.map((c) => ({ ...c, key: newKey() }))
      : defaultCards(),
    servicesCustom: Boolean(d?.services?.length),
  };
}

/** Ảnh trong bản nháp → dữ liệu gửi máy chủ (bỏ phần chỉ dùng trên máy: ảnh xem trước, tiến độ…). */
const img = (v) =>
  v?.url
    ? { url: v.url, width: v.width ?? null, height: v.height ?? null, pos: v.pos, zoom: v.zoom }
    : null;

function toPayload(d) {
  return {
    hero: d.hero.map(img),
    showreel: {
      url: d.showreel.url.trim() || null,
      poster: d.showreel.url.trim() ? img(d.showreel.poster) : null,
      title: d.showreel.title.trim(),
      caption: d.showreel.caption.trim(),
    },
    intro: { main: img(d.intro.main), side: img(d.intro.side) },
    services: d.servicesCustom
      ? d.services.map((c) => ({
          name: c.name.trim(),
          desc: c.desc.trim(),
          image: img(c.image),
          link: c.link.trim(),
          booking: c.booking,
        }))
      : null,
  };
}

const LINK_OK = (v) => v === "" || /^\/(?!\/)\S*$/.test(v) || /^https?:\/\/\S+\.\S+$/i.test(v);

/** Lỗi nhập liệu (hiện ngay dưới ô, chặn lưu). */
function validate(d) {
  const errors = {};
  if (d.servicesCustom)
    d.services.forEach((c, i) => {
      if (!c.name.trim()) errors[`services.${i}.name`] = "Vui lòng nhập tên thẻ";
      if (!LINK_OK(c.link.trim()))
        errors[`services.${i}.link`] =
          "Nhập trang trong website (bắt đầu bằng /) hoặc link đầy đủ (https://...)";
    });
  if (d.showreel.url.trim() && d.showreel.check?.url !== d.showreel.url.trim())
    errors["showreel.url"] = "Bấm “Kiểm tra link” trước khi lưu";
  return errors;
}

/**
 * Tab "Trang chủ" — chỉnh nội dung trang chủ theo đúng thứ tự trên website:
 * Hero (4 ảnh) → Showreel (link YouTube / Google Drive) → Về Trần Duy Media (2 ảnh) → Hệ sinh thái dịch vụ (thẻ).
 * Ô nào để mặc định → website dùng nội dung có sẵn. Bấm "Lưu" → website cập nhật ngay.
 */
export function HomeManager() {
  const [saved, setSaved] = useState(null); // bản đã lưu (để so sánh có thay đổi chưa)
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [errors, setErrors] = useState({});
  const [tick, setTick] = useState(0);
  const root = useRef(null);

  useEffect(() => {
    let alive = true;
    api("/home")
      .then((res) => {
        if (!alive) return;
        const d = toDraft(res.data);
        setSaved(d);
        setDraft(d);
        setError("");
      })
      .catch((err) => alive && setError(describeError(err)));
    return () => {
      alive = false;
    };
  }, [tick]);

  const dirty = useMemo(
    () =>
      Boolean(saved && draft) &&
      JSON.stringify(toPayload(saved)) !== JSON.stringify(toPayload(draft)),
    [saved, draft],
  );

  // Rời trang khi chưa lưu / ảnh đang tải → hỏi lại
  useEffect(() => {
    if (!dirty && !uploads) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, uploads]);

  /** Cập nhật 1 nhánh của bản nháp; nhận giá trị hoặc hàm (giá trị cũ → mới) — ảnh đang tải dùng dạng hàm. */
  const patch = useCallback((path, next) => {
    setDraft((d) => {
      const copy = structuredClone(d);
      const keys = path.split(".");
      let o = copy;
      for (const k of keys.slice(0, -1)) o = o[k];
      const last = keys.at(-1);
      o[last] = typeof next === "function" ? next(o[last]) : next;
      return copy;
    });
    setErrors((e) => {
      if (!Object.keys(e).some((k) => k.startsWith(path))) return e;
      return Object.fromEntries(Object.entries(e).filter(([k]) => !k.startsWith(path)));
    });
  }, []);
  const onUploading = useCallback((n) => setUploads((u) => u + n), []);

  // Thẻ dịch vụ: chỉnh bất kỳ thẻ nào → lưu danh sách thẻ riêng (không còn dùng thẻ mặc định)
  const patchCard = (i, field, value) => {
    patch(`services.${i}.${field}`, value);
    patch("servicesCustom", true);
  };
  const setCards = (fn) => {
    setDraft((d) => ({ ...d, services: fn(d.services), servicesCustom: true }));
    setErrors({});
  };

  const save = async () => {
    const errs = validate(draft);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() =>
        root.current
          ?.querySelector("[aria-invalid='true']")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return toast.warning("Vui lòng kiểm tra lại các ô được đánh dấu đỏ.", {
        title: "Chưa lưu được",
      });
    }
    setSaving(true);
    try {
      const res = await api("/home", { method: "PUT", body: toPayload(draft) });
      // Giữ ảnh xem trước trên máy (không phải tải lại), dữ liệu còn lại lấy theo máy chủ
      const next = {
        ...toDraft(res.data),
        services: draft.services,
        servicesCustom: draft.servicesCustom,
      };
      next.hero = next.hero.map((h, i) => (h ? { ...h, preview: draft.hero[i]?.preview } : h));
      if (!draft.servicesCustom) next.services = defaultCards();
      setSaved(next);
      setDraft(next);
      await revalidateSite("home");
      toast.success("Trang chủ đã cập nhật nội dung mới.", {
        title: "Đã lưu",
        action: { label: "Xem trang chủ", onClick: () => window.open("/", "_blank") },
      });
    } catch (err) {
      if (err?.code === "VIDEO_LINK_INVALID") setErrors({ "showreel.url": err.message });
      toast.error(describeError(err), { title: "Chưa lưu được" });
    } finally {
      setSaving(false);
    }
  };

  if (error)
    return (
      <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-ink/10">
        <p className="text-sm text-ink-soft">{error}</p>
        <button
          type="button"
          onClick={() => setTick((t) => t + 1)}
          className="mt-4 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Thử lại
        </button>
      </div>
    );
  if (!draft)
    return (
      <div className="flex justify-center py-20 text-ink-muted">
        <span className="size-6 animate-spin rounded-full border-2 border-ink/15 border-t-orange-500" />
      </div>
    );

  return (
    <div ref={root} className="space-y-5 sm:space-y-6">
      <p className="text-sm text-ink-soft">
        Chỉnh hình ảnh và nội dung trang chủ theo đúng thứ tự trên website. Ảnh tải lên được cắt
        đúng khung trước, vẫn giữ nguyên độ nét của ảnh gốc. Ô để mặc định sẽ dùng nội dung có sẵn.
      </p>

      {/* 1. Hero */}
      <Section
        n={1}
        title="Ảnh hero đầu trang"
        desc="4 ảnh nền tự chuyển ở đầu trang chủ, theo thứ tự từ trái sang phải."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {draft.hero.map((v, i) => (
            <ImageSlot
              key={i}
              label={`Ảnh ${i + 1}`}
              hint="điện thoại hiện phần quanh điểm đã chọn"
              frame={HOME_FRAMES.hero}
              previews={[
                { caption: "Máy tính", note: "16:9", ratio: 16 / 9 },
                { caption: "Điện thoại", note: "9:19", ratio: 9 / 19 },
              ]}
              value={v}
              fallback={DEFAULT_HERO[i]}
              onChange={(next) => patch(`hero.${i}`, next)}
              onUploadingChange={onUploading}
            />
          ))}
        </div>
      </Section>

      {/* 2. Showreel */}
      <Section
        n={2}
        title="Video showreel"
        desc="Thay video showreel bằng link YouTube (Công khai hoặc Không công khai) hoặc Google Drive đã chia sẻ."
      >
        <ShowreelEditor
          value={draft.showreel}
          error={errors["showreel.url"]}
          defaults={DEFAULT_SHOWREEL}
          onChange={(field, next) => patch(`showreel.${field}`, next)}
          onUploading={onUploading}
        />
      </Section>

      {/* 3. Về Trần Duy Media */}
      <Section
        n={3}
        title="Ảnh mục “Về Trần Duy Media”"
        desc="Ảnh nhỏ bên trái và ảnh lớn bên phải, xếp giống trên website."
      >
        {/* Cột 5fr (1:1) + 4fr (4:5) → 2 ảnh cao bằng nhau, thẳng hàng trên dưới */}
        <div className="mx-auto grid max-w-3xl grid-cols-[5fr_4fr] gap-4 sm:gap-6">
          <ImageSlot
            label="Ảnh nhỏ"
            frame={HOME_FRAMES.introSide}
            value={draft.intro.side}
            fallback={DEFAULT_INTRO.side}
            onChange={(next) => patch("intro.side", next)}
            onUploadingChange={onUploading}
          />
          <ImageSlot
            label="Ảnh lớn"
            frame={HOME_FRAMES.introMain}
            value={draft.intro.main}
            fallback={DEFAULT_INTRO.main}
            onChange={(next) => patch("intro.main", next)}
            onUploadingChange={onUploading}
          />
        </div>
      </Section>

      {/* 4. Hệ sinh thái dịch vụ */}
      <Section
        n={4}
        title="Thẻ “Hệ sinh thái dịch vụ trọng tâm”"
        desc={`Ảnh, tên, mô tả, link “Xem thêm” và dịch vụ chọn sẵn khi khách bấm “Liên hệ tư vấn”. Tối đa ${SERVICES_MAX} thẻ.`}
        action={
          draft.servicesCustom && (
            <button
              type="button"
              onClick={() => {
                setDraft((d) => ({ ...d, services: defaultCards(), servicesCustom: false }));
                setErrors({});
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold text-ink-soft ring-1 ring-ink/15 transition hover:text-ink hover:ring-ink/30"
            >
              <Icon name="refresh" className="size-3.5" />
              Dùng {DEFAULT_SERVICES.length} thẻ mặc định
            </button>
          )
        }
      >
        <ol className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {draft.services.map((c, i) => (
            <li
              key={c.key}
              className="flex flex-col gap-4 rounded-2xl bg-paper/60 p-4 ring-1 ring-ink/10 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold tracking-eyebrow text-ink-muted uppercase">
                  Thẻ {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-1">
                  <IconButton
                    icon="arrowUp"
                    label="Chuyển lên trước"
                    disabled={i === 0}
                    onClick={() =>
                      setCards((list) => {
                        const l = [...list];
                        [l[i - 1], l[i]] = [l[i], l[i - 1]];
                        return l;
                      })
                    }
                  />
                  <IconButton
                    icon="arrowDown"
                    label="Chuyển xuống sau"
                    disabled={i === draft.services.length - 1}
                    onClick={() =>
                      setCards((list) => {
                        const l = [...list];
                        [l[i + 1], l[i]] = [l[i], l[i + 1]];
                        return l;
                      })
                    }
                  />
                  <IconButton
                    icon="trash"
                    label="Xoá thẻ"
                    tone="danger"
                    disabled={draft.services.length <= 1}
                    onClick={() => setCards((list) => list.filter((_, k) => k !== i))}
                  />
                </div>
              </div>

              <ImageSlot
                label="Ảnh thẻ"
                hint="trên web hiện trắng đen, rê chuột hiện màu"
                frame={HOME_FRAMES.service}
                value={c.image}
                fallback={DEFAULT_SERVICES[i % DEFAULT_SERVICES.length].image}
                onChange={(next) =>
                  setDraft((d) => {
                    const services = [...d.services];
                    const cur = services[i].image;
                    services[i] = {
                      ...services[i],
                      image: typeof next === "function" ? next(cur) : next,
                    };
                    return { ...d, services, servicesCustom: true };
                  })
                }
                onUploadingChange={onUploading}
              />

              <Field label="Tên thẻ" error={errors[`services.${i}.name`]} count={[c.name, 60]}>
                <input
                  className="field"
                  value={c.name}
                  maxLength={60}
                  aria-invalid={Boolean(errors[`services.${i}.name`])}
                  onChange={(e) => patchCard(i, "name", e.target.value)}
                />
              </Field>
              <Field label="Mô tả ngắn" count={[c.desc, 160]}>
                <textarea
                  className="min-h-20 field resize-y py-3"
                  rows={2}
                  value={c.desc}
                  maxLength={160}
                  onChange={(e) => patchCard(i, "desc", e.target.value)}
                />
              </Field>
              <Field
                label="Link “Xem thêm”"
                hint="Trang trong website (chọn gợi ý) hoặc link ngoài https://… — để trống thì ẩn nút."
                error={errors[`services.${i}.link`]}
              >
                <LinkInput
                  value={c.link}
                  pages={PAGES}
                  placeholder="/dich-vu/... hoặc https://..."
                  invalid={Boolean(errors[`services.${i}.link`])}
                  onChange={(v) => patchCard(i, "link", v)}
                />
              </Field>
              <Field label="Dịch vụ chọn sẵn khi bấm “Liên hệ tư vấn”">
                <Select
                  value={c.booking}
                  options={BOOKING_OPTIONS}
                  onChange={(v) => patchCard(i, "booking", v)}
                />
              </Field>
            </li>
          ))}
          {draft.services.length < SERVICES_MAX && (
            <li>
              <button
                type="button"
                onClick={() =>
                  setCards((list) => [
                    ...list,
                    { key: newKey(), name: "", desc: "", image: null, link: "", booking: "" },
                  ])
                }
                className="flex size-full min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 text-sm font-semibold text-ink-soft transition hover:border-orange-500 hover:text-orange-600"
              >
                <Icon name="plus" className="size-5" />
                Thêm thẻ dịch vụ
              </button>
            </li>
          )}
        </ol>
      </Section>

      {/* Thanh lưu: bám đáy màn hình khi có thay đổi chưa lưu */}
      {(dirty || uploads > 0 || saving) && (
        <div className="sticky bottom-3 z-30 sm:bottom-5">
          <div className="mx-auto flex max-w-3xl [animation:popIn_.35s_cubic-bezier(.22,1,.36,1)_both] items-center justify-between gap-3 rounded-full bg-white py-2 pr-2 pl-5 shadow-[0_18px_50px_-18px_rgba(10,20,40,0.45)] ring-1 ring-ink/10">
            <p className="min-w-0 text-sm text-ink-soft">
              {uploads
                ? `Đang tải ${uploads} ảnh lên…`
                : saving
                  ? "Đang lưu…"
                  : "Có thay đổi chưa lưu"}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(saved);
                  setErrors({});
                }}
                disabled={saving || Boolean(uploads)}
                className="h-11 rounded-full px-4 text-sm font-semibold text-ink-soft ring-1 ring-ink/15 transition hover:text-ink disabled:opacity-40"
              >
                Hoàn tác
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || Boolean(uploads) || !dirty}
                className="relative inline-flex h-11 items-center gap-2 rounded-full bg-navy-950 pr-1.5 pl-5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50"
              >
                {saving ? "Đang lưu…" : "Lưu & cập nhật website"}
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-500">
                  {saving ? (
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <Icon name="check" className="size-4" strokeWidth={2.5} />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ n, title, desc, action, children }) {
  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-ink/10 sm:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-xs font-bold text-white">
            {n}
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
            <p className="mt-0.5 text-left text-sm text-ink-muted">{desc}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, error, count, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3 text-xs font-semibold text-ink-soft">
        {label}
        {count && (
          <span className="font-normal text-ink-muted tabular-nums">
            {count[0].length}/{count[1]}
          </span>
        )}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-ink-muted">{hint}</span>
      )}
    </label>
  );
}

function IconButton({ icon, label, tone, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-full text-ink-soft transition hover:bg-white hover:text-ink disabled:pointer-events-none disabled:opacity-30",
        tone === "danger" && "hover:text-red-600",
      )}
      {...props}
    >
      <Icon name={icon} className="size-4" />
    </button>
  );
}
