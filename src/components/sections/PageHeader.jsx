import Link from "next/link";
import { Container } from "@/components/ui";

/**
 * Banner đầu trang cho các trang con, kèm breadcrumb.
 */
export function PageHeader({ title, description, breadcrumb }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 py-20 text-white sm:py-28">
      <div className="absolute top-0 left-1/2 -z-10 size-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <Container>
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-400">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-brand-400">
              {breadcrumb || title}
            </li>
          </ol>
        </nav>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">{description}</p>
        )}
      </Container>
    </section>
  );
}
