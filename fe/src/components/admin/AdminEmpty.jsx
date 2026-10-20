import { Icon } from "@/components/icons";

/** Khung nội dung trống của một tab quản trị (chờ xây dựng chức năng). */
export function AdminEmpty({ icon = "grid", title, children }) {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-paper text-navy-900">
        <Icon name={icon} className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-ink-soft">
        {children ?? "Nội dung của mục này đang được xây dựng."}
      </p>
    </section>
  );
}
