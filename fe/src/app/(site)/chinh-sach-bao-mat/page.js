import { PageHeader } from "@/components/sections";
import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { PRIVACY_POLICY, privacySections } from "@/data/privacy";
import { createMetadata } from "@/lib/metadata";

const TITLE = "Chính sách bảo mật";
const DESCRIPTION = `Cách ${siteConfig.name} thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân khi bạn gửi yêu cầu tư vấn — theo Luật Bảo vệ dữ liệu cá nhân 2025. Quyền của bạn và cách liên hệ.`;

export const metadata = createMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PRIVACY_POLICY.path,
});

/** Ngày cập nhật dạng ISO (2026-11-09) cho dữ liệu có cấu trúc / thẻ <time>. */
const iso = PRIVACY_POLICY.version;

/**
 * Chính sách bảo mật & bảo vệ dữ liệu cá nhân — liên kết từ ô đồng ý của form đặt lịch tư vấn và chân trang.
 * SEO: tiêu đề / mô tả / canonical riêng, có trong sitemap, mục lục neo (#id) cho từng mục, dữ liệu có cấu trúc
 * WebPage + BreadcrumbList (ngày cập nhật, đơn vị phát hành).
 */
export default function PrivacyPage() {
  const url = `${siteConfig.url}${PRIVACY_POLICY.path}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: TITLE,
      description: DESCRIPTION,
      url,
      inLanguage: "vi-VN",
      dateModified: iso,
      isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
      publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: TITLE, item: url },
      ],
    },
  ];

  return (
    <>
      <PageHeader
        title={TITLE}
        eyebrow="Bảo vệ dữ liệu cá nhân"
        // Ảnh nền: studio của Trần Duy Media (ảnh riêng, không có thương hiệu đối tác) — phủ tối sẵn trong PageHeader
        image="/images/about-hd/studio-hall.webp"
        imagePos="center 60%"
        description="Chúng tôi chỉ thu thập thông tin cần thiết để liên hệ tư vấn, không bán hay chia sẻ dữ liệu của bạn cho mục đích quảng cáo."
      />

      <section className="bg-white section-y" data-nav-theme="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
            {/* Mục lục (dính khi cuộn trên máy tính) */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-sm text-ink-muted">
                Cập nhật lần cuối:{" "}
                <time dateTime={iso} className="font-semibold text-ink">
                  {PRIVACY_POLICY.updated}
                </time>
              </p>
              <nav aria-label="Mục lục" className="mt-6">
                <p className="mb-3 text-[11px] font-semibold tracking-eyebrow text-ink-muted uppercase">
                  Mục lục
                </p>
                <ol className="space-y-1 border-l border-ink/10">
                  {privacySections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-ink-soft transition-colors hover:border-orange-500 hover:text-ink"
                      >
                        {i + 1}. {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="max-w-3xl min-w-0">
              <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
                Chính sách này giải thích cách {siteConfig.name} thu thập, sử dụng, lưu trữ và bảo
                vệ dữ liệu cá nhân của bạn khi sử dụng website, theo Luật Bảo vệ dữ liệu cá nhân số
                91/2025/QH15 và các văn bản hướng dẫn thi hành. Khi tích vào ô “Tôi đồng ý…” và gửi
                form, bạn xác nhận đã đọc và đồng ý với chính sách này.
              </p>
              {(PRIVACY_POLICY.legalName || PRIVACY_POLICY.taxId) && (
                <p className="mt-4 text-sm text-ink-muted">
                  {PRIVACY_POLICY.legalName}
                  {PRIVACY_POLICY.legalName && PRIVACY_POLICY.taxId && " · "}
                  {PRIVACY_POLICY.taxId && `Mã số thuế: ${PRIVACY_POLICY.taxId}`}
                </p>
              )}

              {privacySections.map((s, i) => (
                <section key={s.id} id={s.id} className="mt-12 scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.65rem]">
                    <span className="mr-2 text-orange-500 tabular-nums">{i + 1}.</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
                    {s.body.map((b, k) =>
                      typeof b === "string" ? (
                        <p key={k} className="text-left">
                          {b}
                        </p>
                      ) : (
                        <ul key={k} className="space-y-2">
                          {b.list.map((li) => (
                            <li key={li} className="flex gap-3">
                              <span
                                aria-hidden="true"
                                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-orange-500"
                              />
                              <span>{li}</span>
                            </li>
                          ))}
                        </ul>
                      ),
                    )}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
