"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Form đặt lịch / yêu cầu báo giá (demo, chưa có backend):
 * soạn tin nhắn từ các ô nhập, sao chép vào clipboard rồi mở Messenger / Zalo để khách dán & gửi.
 * Khi có backend, thay handleSend bằng gọi API (Route Handler) — các field đã sẵn trong `form`.
 * preset: slug dịch vụ chọn sẵn (từ data-booking="slug").
 */
export function BookingForm({ preset = "", compact = false }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: preset,
    date: "",
    budget: "",
    note: "",
  });
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setForm((v) => ({ ...v, [k]: e.target.value }));

  const compose = () => {
    const svc = services.find((s) => s.slug === form.service);
    return [
      "Xin chào Tran Duy Media, tôi muốn đặt lịch tư vấn:",
      `• Họ tên: ${form.name}`,
      `• Điện thoại: ${form.phone}`,
      `• Dịch vụ: ${svc ? svc.title : "Chưa xác định"}`,
      form.date && `• Thời gian mong muốn: ${form.date}`,
      form.budget && `• Ngân sách dự kiến: ${form.budget}`,
      form.note && `• Mô tả: ${form.note}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleSend = async (channel) => {
    const text = compose();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {}
    const url = channel === "zalo" ? siteConfig.socials.zalo : siteConfig.socials.messenger;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const label = (text) => (
    <span className="absolute top-1.5 left-4 text-[10px] tracking-wider text-ink-muted uppercase">
      {text}
    </span>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend("messenger");
      }}
      className="space-y-2.5 sm:space-y-3"
    >
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        <input
          required
          className="field"
          placeholder="Họ và tên *"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
        />
        <input
          required
          className="field"
          type="tel"
          placeholder="Số điện thoại / Zalo *"
          autoComplete="tel"
          value={form.phone}
          onChange={set("phone")}
        />
      </div>
      <label className="relative block">
        {label("Dịch vụ quan tâm")}
        <select className="field pt-5" value={form.service} onChange={set("service")}>
          <option value="">Chưa xác định — cần tư vấn</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </label>
      {/* Thời gian + ngân sách: luôn 2 cột (kể cả mobile) để form vừa 1 màn hình */}
      <div className="grid grid-cols-[1.1fr_1fr] gap-2.5 sm:grid-cols-2 sm:gap-3">
        <label className="relative block">
          {label("Ngày mong muốn")}
          <input
            className="field pt-5 pr-2 pl-3 sm:px-4"
            type="date"
            value={form.date}
            onChange={set("date")}
          />
        </label>
        <label className="relative block">
          {label(
            <>
              Ngân sách<span className="max-[379px]:hidden"> dự kiến</span>
            </>,
          )}
          <select className="field pt-5 pr-1 pl-3 sm:px-4" value={form.budget} onChange={set("budget")}>
            <option value="">Chưa rõ</option>
            {["Dưới 20 triệu", "20 – 50 triệu", "50 – 100 triệu", "Trên 100 triệu"].map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>
      <textarea
        className={cn(
          "field resize-none",
          compact ? "min-h-[60px] sm:min-h-[72px]" : "min-h-[110px]",
        )}
        placeholder="Mô tả ngắn: sản phẩm, kênh phát, thời lượng, deadline..."
        value={form.note}
        onChange={set("note")}
      />

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-3.5 text-[13px] font-medium whitespace-nowrap text-ink transition hover:border-navy-900 hover:bg-navy-900 hover:text-white sm:px-6 sm:text-sm"
        >
          <Icon name="messenger" className="size-4" />
          {/* Màn rất hẹp (< 380px): bỏ chữ "Gửi qua" để 2 nút không tràn */}
          <span>
            <span className="max-[379px]:hidden">Gửi qua </span>Messenger
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleSend("zalo")}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-3.5 text-[13px] font-medium whitespace-nowrap text-ink transition hover:border-navy-900 hover:bg-navy-900 hover:text-white sm:px-6 sm:text-sm"
        >
          <Icon name="zalo" className="size-5" />
          <span>
            <span className="max-[379px]:hidden">Gửi qua </span>Zalo
          </span>
        </button>
      </div>

      <p
        className={cn(
          "flex items-center justify-center gap-2 text-center text-[12px] transition-all duration-300",
          copied ? "text-ink" : "text-ink-muted",
        )}
      >
        {copied && <Icon name="check" className="size-3.5" />}
        {copied
          ? "Đã sao chép nội dung — dán vào khung chat và gửi cho chúng tôi."
          : "Thông tin chỉ dùng để liên hệ tư vấn, không chia sẻ cho bên thứ ba."}
      </p>
    </form>
  );
}
