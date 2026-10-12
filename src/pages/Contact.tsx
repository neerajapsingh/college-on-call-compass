import { Seo } from "@/components/Seo";
import { Breadcrumbs, PageHeader } from "@/components/common";
import { ContactForm } from "@/components/forms/EnquiryForms";
import { SITE, whatsappLink } from "@/lib/site";

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description="Contact College On Call by phone, email, WhatsApp or the enquiry form." path="/contact" />
      <PageHeader title="Contact College On Call" intro="Send us your query and our team will get back to you."><Breadcrumbs items={[{ label: "Contact" }]} /></PageHeader>
      <div className="container-site section grid gap-10 md:grid-cols-2">
        <ul className="space-y-3 text-sm">
          <li>Phone: <a className="text-primary" href={SITE.phoneHref}>{SITE.phoneDisplay}</a></li>
          <li>Email: <a className="text-primary" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          <li><a className="text-primary" href={whatsappLink("Hi College On Call")} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>
        </ul>
        <div className="rounded-xl border p-6 shadow-card"><ContactForm /></div>
      </div>
    </>
  );
}
