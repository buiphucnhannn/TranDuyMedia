import { Icon } from "@/components/icons";
import { Section } from "@/components/ui";
import { ContactForm, PageHeader } from "@/components/sections";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Liên hệ",
  description: "Liên hệ Trần Duy Media để được tư vấn và báo giá miễn phí.",
  path: "/lien-he",
});

const { contact } = siteConfig;

const contactItems = [
  { icon: "phone", label: "Hotline", value: contact.phone, href: contact.phoneHref },
  { icon: "mail", label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { icon: "mapPin", label: "Địa chỉ", value: contact.address },
  { icon: "clock", label: "Giờ làm việc", value: contact.workingHours },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Liên hệ với chúng tôi"
        breadcrumb="Liên hệ"
        description="Để lại thông tin, chúng tôi sẽ phản hồi trong vòng 24 giờ."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <ul className="space-y-4">
            {contactItems.map((item) => (
              <li key={item.label} className="flex gap-4 rounded-2xl bg-zinc-50 p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
                  <Icon name={item.icon} />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="font-semibold hover:text-brand-500">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-semibold">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-3xl border border-zinc-200 p-6 sm:p-10 lg:col-span-2">
            <h2 className="text-2xl font-bold">Yêu cầu tư vấn & báo giá</h2>
            <p className="mt-2 mb-8 text-zinc-600">Các trường có dấu * là bắt buộc.</p>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
