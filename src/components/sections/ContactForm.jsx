"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui";
import { services } from "@/data/home";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none";

function validate(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Vui lòng nhập họ tên";
  if (!/^[0-9+\s]{9,15}$/.test(data.phone || "")) errors.phone = "Số điện thoại không hợp lệ";
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Email không hợp lệ";
  if (!data.message?.trim()) errors.message = "Vui lòng mô tả ngắn nhu cầu";
  return errors;
}

export function ContactForm() {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("submitting");
    // TODO: Kết nối API thật (Route Handler, Formspree, Google Sheets...)
    await new Promise((r) => setTimeout(r, 800));
    form.reset();
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-green-50 p-10 text-center ring-1 ring-green-200">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-500 text-white">
          <Icon name="check" />
        </div>
        <h3 className="mt-6 text-xl font-semibold">Gửi thành công!</h3>
        <p className="mt-2 text-zinc-600">Chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.</p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Gửi yêu cầu khác
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Họ và tên" name="name" error={errors.name} required>
        <input id="name" name="name" autoComplete="name" className={inputClass} />
      </Field>
      <Field label="Số điện thoại" name="phone" error={errors.phone} required>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
      </Field>
      <Field label="Email" name="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" className={inputClass} />
      </Field>
      <Field label="Dịch vụ quan tâm" name="service">
        <select id="service" name="service" className={inputClass} defaultValue="">
          <option value="">-- Chọn dịch vụ --</option>
          {services.map((s) => (
            <option key={s.title}>{s.title}</option>
          ))}
        </select>
      </Field>
      <Field
        label="Nội dung"
        name="message"
        error={errors.message}
        required
        className="sm:col-span-2"
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Mô tả ngắn về dự án, thời gian, ngân sách dự kiến..."
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="w-full sm:w-auto"
        >
          {status === "submitting" ? "Đang gửi..." : "Gửi yêu cầu"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, name, error, required, className, children }) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={name} className="text-sm font-medium text-ink-900">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
