"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { BOOKING_STATUSES } from "@/data/bookings";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { BookingDetail } from "./BookingDetail";
import { formatDay, formatPhone, serviceLabel, timeAgo, formatDateTime } from "./format";
import { StatusMenu } from "./StatusControl";

// Chiều cao 1 dòng (desktop bảng / mobile thẻ) — dùng để tính số dòng vừa đúng 1 màn hình
const ROW_H = { desktop: 69, mobile: 132 };
const MIN_ROWS = { desktop: 4, mobile: 3 };
const TABS = [{ value: "all", label: "Tất cả", dot: "bg-ink/30" }, ...BOOKING_STATUSES];

/**
 * Quản lý yêu cầu đặt lịch: tab theo trạng thái (kèm số lượng), tìm theo tên / SĐT, bảng tổng quan,
 * đổi trạng thái nhanh trên từng dòng, popup xem chi tiết. Desktop: bảng · Mobile: thẻ.
 * initialTab: tab mở sẵn (từ ?trang-thai= trên địa chỉ).
 */
export function BookingsManager({ initialTab = "all" }) {
  const router = useRouter();
  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], meta: null });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [toDelete, setToDelete] = useState(null); // yêu cầu đang chờ xác nhận xoá
  const [deleting, setDeleting] = useState(false);
  const reqId = useRef(0);
  const tableRef = useRef(null);
  const [limit, setLimit] = useState(null); // số dòng mỗi trang = vừa khít màn hình

  // Số dòng vừa 1 màn hình: từ mép trên bảng tới đáy màn hình, trừ tiêu đề bảng + thanh phân trang
  useLayoutEffect(() => {
    const measure = () => {
      const el = tableRef.current;
      if (!el) return;
      const mobile = window.innerWidth < 768;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const chrome = (mobile ? 0 : 49) + 61 + 24; // header bảng + phân trang + lề dưới
      const rows = Math.floor(
        (window.innerHeight - top - chrome) / ROW_H[mobile ? "mobile" : "desktop"],
      );
      const next = Math.max(MIN_ROWS[mobile ? "mobile" : "desktop"], Math.min(rows, 50));
      setLimit((prev) => {
        if (prev !== null && prev !== next) setPage(1);
        return next;
      });
    };
    measure();
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(measure, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Tìm kiếm: chờ người dùng ngừng gõ 350ms
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(query.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  // Khoá truy vấn hiện tại; "đang tải" = chưa nhận dữ liệu cho đúng khoá này
  const [tick, setTick] = useState(0);
  const key = `${page}|${tab}|${q}|${tick}|${limit}`;
  const [loadedKey, setLoadedKey] = useState(null);
  const loading = loadedKey !== key;

  const fetchList = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (tab !== "all") params.set("status", tab);
    if (q) params.set("q", q);
    return api(`/bookings?${params}`);
  }, [page, tab, q, limit]);

  useEffect(() => {
    if (!limit) return; // chờ đo xong kích thước màn hình
    const id = ++reqId.current;
    fetchList()
      .then((res) => {
        if (id !== reqId.current) return;
        setData({ items: res.data, meta: res.meta });
        setError("");
      })
      .catch((err) => {
        if (err.status === 401) return router.replace("/login");
        if (id === reqId.current) setError("Không tải được danh sách. Vui lòng thử lại.");
      })
      .finally(() => id === reqId.current && setLoadedKey(key));
  }, [fetchList, key, router, limit]);

  /** Tải lại (nút ↻ hoặc sau khi đổi trạng thái để cập nhật số đếm). */
  const load = ({ silent = false } = {}) => {
    if (!silent) return setTick((t) => t + 1);
    fetchList()
      .then((res) => setData({ items: res.data, meta: res.meta }))
      .catch(() => {});
  };

  /** Đổi trạng thái: cập nhật ngay trên giao diện, lỗi thì hoàn tác. */
  const changeStatus = async (id, status) => {
    const before = data.items;
    setSaving(id);
    setData((d) => ({ ...d, items: d.items.map((b) => (b.id === id ? { ...b, status } : b)) }));
    try {
      const res = await api(`/bookings/${id}/status`, { method: "PATCH", body: { status } });
      setData((d) => ({ ...d, items: d.items.map((b) => (b.id === id ? res.data : b)) }));
      toast.success(
        `Yêu cầu của ${res.data.name} → "${BOOKING_STATUSES.find((s) => s.value === status).label}".`,
        {
          title: "Đã cập nhật trạng thái",
        },
      );
      load({ silent: true }); // cập nhật số đếm trên các tab
    } catch (err) {
      setData((d) => ({ ...d, items: before }));
      if (err.status === 401) return router.replace("/login");
      toast.error("Vui lòng kiểm tra kết nối rồi thử lại.", {
        title: "Chưa cập nhật được trạng thái",
      });
    } finally {
      setSaving(null);
    }
  };

  /** Hoàn tác xoá (xoá mềm) → yêu cầu quay lại danh sách. */
  const restore = async (b) => {
    const id = toast.loading(`Đang khôi phục yêu cầu của ${b.name}…`, { title: "Đang hoàn tác" });
    try {
      await api(`/bookings/${b.id}/restore`, { method: "POST" });
      load({ silent: true });
      toast.update(id, {
        type: "success",
        title: "Đã khôi phục yêu cầu",
        message: `Yêu cầu của ${b.name} đã quay lại danh sách.`,
      });
    } catch (err) {
      if (err.status === 401) return router.replace("/login");
      toast.update(id, {
        type: "error",
        title: "Chưa khôi phục được",
        message:
          err.status === 404
            ? "Đã quá thời gian hoàn tác."
            : err.message || "Đã có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  /** Xoá (chỉ yêu cầu Đã giải quyết) — sau khi người dùng xác nhận trong hộp thoại. */
  const confirmDelete = async () => {
    const b = toDelete;
    setDeleting(true);
    try {
      await api(`/bookings/${b.id}`, { method: "DELETE" });
      setToDelete(null);
      if (selectedId === b.id) setSelectedId(null);
      setData((d) => ({ ...d, items: d.items.filter((x) => x.id !== b.id) }));
      toast.success(`Yêu cầu của ${b.name} đã được xoá khỏi danh sách.`, {
        title: "Đã xoá yêu cầu",
        duration: 8000, // đủ thời gian bấm "Hoàn tác"
        action: { label: "Hoàn tác", onClick: () => restore(b) },
      });
      // Trang hiện tại trống sau khi xoá → lùi về trang trước
      if (data.items.length === 1 && page > 1) setPage((p) => p - 1);
      else load({ silent: true });
    } catch (err) {
      if (err.status === 401) return router.replace("/login");
      setToDelete(null);
      if (err.code === "BOOKING_NOT_RESOLVED" || err.code === "BOOKING_CHANGED") {
        toast.warning("Hãy chuyển yêu cầu sang “Đã giải quyết” trước khi xoá.", {
          title: "Chưa thể xoá yêu cầu này",
        });
        load({ silent: true });
      } else if (err.status === 404) {
        toast.info("Yêu cầu này đã được xoá trước đó. Danh sách đã được làm mới.", {
          title: "Không còn tồn tại",
        });
        load({ silent: true });
      } else {
        toast.error("Vui lòng kiểm tra kết nối mạng rồi thử lại.", {
          title: "Chưa xoá được yêu cầu",
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  const counts = data.meta?.counts;
  const totalPages = data.meta?.totalPages ?? 1;
  const selected = data.items.find((b) => b.id === selectedId);

  return (
    // Khoảng cách giữa các khối = padding trên của <main> (5 / sm:6) → thanh công cụ cách đều trên / dưới
    <div className="space-y-5 sm:space-y-6">
      {/* Thanh công cụ: tab trạng thái + tìm kiếm */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div
          role="tablist"
          aria-label="Lọc theo trạng thái"
          className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 xl:pb-0"
        >
          {TABS.map((t) => {
            const on = tab === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setTab(t.value);
                  setPage(1);
                  // Giữ tab trên địa chỉ (?trang-thai=) → tải lại trang vẫn đúng tab đang xem
                  const url = new URL(window.location.href);
                  if (t.value === "all") url.searchParams.delete("trang-thai");
                  else url.searchParams.set("trang-thai", t.value);
                  window.history.replaceState(null, "", url);
                }}
                className={cn(
                  // Viền dùng border (nằm trong ô) thay vì ring — ring bị khung cuộn ngang cắt mất mép trên / dưới
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  on
                    ? "border-navy-950 bg-navy-950 text-white"
                    : "border-ink/10 bg-white text-ink-soft hover:border-ink/20 hover:text-ink",
                )}
              >
                <span className={cn("size-2 rounded-full", t.dot)} />
                {t.label}
                <span
                  className={cn(
                    "min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] tabular-nums",
                    on ? "bg-white/15" : "bg-paper",
                  )}
                >
                  {counts?.[t.value] ?? "–"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <label className="relative flex-1 xl:w-80 xl:flex-none">
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted"
            />
            <span className="sr-only">Tìm theo tên hoặc số điện thoại</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tên hoặc số điện thoại"
              maxLength={100}
              className="field rounded-full pl-11"
            />
          </label>
          <button
            type="button"
            onClick={() => load()}
            aria-label="Tải lại"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-ink-soft ring-1 ring-ink/10 transition hover:text-ink"
          >
            <Icon name="refresh" className={cn("size-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Bảng */}
      <section ref={tableRef} className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink/10">
        {error ? (
          <State icon="refresh" title={error}>
            <button
              type="button"
              onClick={() => load()}
              className="mt-4 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Thử lại
            </button>
          </State>
        ) : !loading && data.items.length === 0 ? (
          <State icon="inbox" title={q ? "Không tìm thấy yêu cầu phù hợp" : "Chưa có yêu cầu nào"}>
            {q
              ? "Thử tìm với tên hoặc số điện thoại khác."
              : "Yêu cầu khách gửi từ form đặt lịch trên website sẽ hiện ở đây."}
          </State>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[940px] text-left text-sm">
                <thead className="border-b border-ink/10 bg-paper/60 text-[11px] font-semibold tracking-eyebrow text-ink-muted uppercase">
                  <tr>
                    <th className="px-5 py-3.5 text-center">Khách hàng</th>
                    <th className="px-4 py-3.5 text-center">Dịch vụ</th>
                    <th className="px-4 py-3.5 text-center">Ngày mong muốn</th>
                    <th className="px-4 py-3.5 text-center">Ngân sách</th>
                    <th className="px-4 py-3.5 text-center">Gửi lúc</th>
                    <th className="px-4 py-3.5 text-center">Trạng thái</th>
                    <th className="py-3.5 pr-6 pl-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y divide-ink/5", loading && "opacity-50")}>
                  {loading && data.items.length === 0
                    ? Array.from({ length: limit ?? 6 }, (_, i) => <SkeletonRow key={i} />)
                    : data.items.map((b) => (
                        <tr key={b.id} className="transition-colors hover:bg-paper/50">
                          <td className="px-5 py-3.5">
                            {/* Cả khối (avatar + tên + SĐT) căn giữa dưới tên cột, như các cột khác */}
                            <div className="mx-auto flex w-fit max-w-[220px] items-center gap-3 text-left">
                              <Avatar name={b.name} />
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-ink">{b.name}</p>
                                <a
                                  href={`tel:${b.phone}`}
                                  className="text-xs text-ink-soft tabular-nums hover:text-orange-600"
                                >
                                  {formatPhone(b.phone)}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center whitespace-nowrap text-ink-soft">
                            {serviceLabel(b.service)}
                          </td>
                          <td className="px-4 py-3.5 text-center text-ink-soft tabular-nums">
                            {formatDay(b.date) ?? <Dash />}
                          </td>
                          <td className="px-4 py-3.5 text-center whitespace-nowrap text-ink-soft">
                            {b.budget ?? <Dash />}
                          </td>
                          <td
                            className="px-4 py-3.5 text-center whitespace-nowrap text-ink-soft"
                            title={formatDateTime(b.createdAt)}
                          >
                            {timeAgo(b.createdAt)}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <StatusMenu
                              value={b.status}
                              disabled={saving === b.id}
                              onChange={(s) => changeStatus(b.id, s)}
                            />
                          </td>
                          <td className="py-3.5 pr-6 pl-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <EyeButton onClick={() => setSelectedId(b.id)} name={b.name} />
                              <DeleteButton booking={b} onClick={() => setToDelete(b)} />
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className={cn("divide-y divide-ink/5 md:hidden", loading && "opacity-50")}>
              {data.items.map((b) => (
                <li key={b.id} className="flex items-start gap-3 px-4 py-4">
                  <Avatar name={b.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{b.name}</p>
                        <p className="text-xs text-ink-soft tabular-nums">
                          {formatPhone(b.phone)} - {timeAgo(b.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <EyeButton onClick={() => setSelectedId(b.id)} name={b.name} />
                        <DeleteButton booking={b} onClick={() => setToDelete(b)} />
                      </div>
                    </div>
                    <p className="mt-1.5 truncate text-left text-[13px] text-ink-soft">
                      {serviceLabel(b.service)}
                      {b.budget && ` - ${b.budget}`}
                    </p>
                    <div className="mt-2.5">
                      <StatusMenu
                        value={b.status}
                        disabled={saving === b.id}
                        onChange={(s) => changeStatus(b.id, s)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Phân trang */}
            <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-6 py-3.5 text-sm text-ink-soft">
              <span>
                {data.meta?.total ?? 0} yêu cầu - Trang {page}/{totalPages}
              </span>
              <div className="flex gap-1.5">
                <PageButton
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  icon="chevronLeft"
                  label="Trang trước"
                />
                <PageButton
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  icon="chevronRight"
                  label="Trang sau"
                />
              </div>
            </div>
          </>
        )}
      </section>

      <ConfirmDialog
        open={!!toDelete}
        title="Xoá yêu cầu đặt lịch?"
        description={
          toDelete && (
            <>
              {/* Giữ liền tên, số điện thoại, "quản lý"; câu hỏi xác nhận xuống dòng riêng */}
              Yêu cầu của{" "}
              <strong className="font-semibold whitespace-nowrap text-ink">
                {toDelete.name}
              </strong>{" "}
              <span className="whitespace-nowrap">({formatPhone(toDelete.phone)})</span>{" "}
              <span className="whitespace-nowrap">sẽ bị xoá</span> khỏi danh sách{" "}
              <span className="whitespace-nowrap">quản lý.</span>
              <br />
              Bạn có chắc chắn muốn tiếp tục?
            </>
          )
        }
        confirmLabel="Xoá yêu cầu"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />

      {selected && (
        <BookingDetail
          booking={selected}
          saving={saving === selected.id}
          onClose={() => setSelectedId(null)}
          onStatus={(s) => changeStatus(selected.id, s)}
        />
      )}
    </div>
  );
}

const Dash = () => <span className="text-ink/25">—</span>;

function Avatar({ name }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-bold text-navy-900 uppercase ring-1 ring-ink/5">
      {name.trim().split(" ").at(-1)?.[0]}
    </span>
  );
}

function EyeButton({ onClick, name }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Xem chi tiết yêu cầu của ${name}`}
      className="inline-flex size-9 items-center justify-center rounded-full text-ink-soft ring-1 ring-ink/10 transition hover:bg-navy-950 hover:text-white hover:ring-navy-950"
    >
      <Icon name="eye" className="size-4" />
    </button>
  );
}

function DeleteButton({ booking: b, onClick }) {
  const allowed = b.status === "resolved";
  return (
    <span title={allowed ? undefined : "Chỉ xoá được yêu cầu đã giải quyết"}>
      <button
        type="button"
        onClick={onClick}
        disabled={!allowed}
        aria-label={`Xoá yêu cầu của ${b.name}`}
        className="inline-flex size-9 items-center justify-center rounded-full text-ink-soft ring-1 ring-ink/10 transition hover:bg-red-600 hover:text-white hover:ring-red-600 disabled:bg-transparent disabled:text-ink/20 disabled:ring-ink/5"
      >
        <Icon name="trash" className="size-4" />
      </button>
    </span>
  );
}

function PageButton({ disabled, onClick, icon, label }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full ring-1 ring-ink/10 transition hover:bg-paper disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon name={icon} className="size-4" />
    </button>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[180, 140, 90, 90, 80, 110, 36].map((w, i) => (
        <td key={i} className={cn("py-4", i === 0 ? "pr-4 pl-6" : "px-4")}>
          <span
            className="block h-3.5 animate-pulse rounded-full bg-paper-200"
            style={{ width: w }}
          />
        </td>
      ))}
    </tr>
  );
}

function State({ icon, title, children }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-paper text-navy-900">
        <Icon name={icon} className="size-6" />
      </span>
      <h2 className="mt-5 text-lg font-bold tracking-tight text-ink">{title}</h2>
      {typeof children === "string" ? (
        <p className="mt-2 max-w-xl text-center text-sm text-balance text-ink-soft">{children}</p>
      ) : (
        children
      )}
    </div>
  );
}
