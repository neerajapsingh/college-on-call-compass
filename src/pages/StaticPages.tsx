import { Link } from "react-router-dom";
import { Compass, Eye, Target } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export function AboutPage() {
  return (
    <>
      <Seo title="About Us" description="College On Call helps students explore online degrees and regular admissions with honest, verified guidance." path="/about" />
      <PageHeader title="About College On Call" intro={SITE.tagline}><Breadcrumbs items={[{ label: "About Us" }]} /></PageHeader>
      <div className="container-site section grid gap-8 md:grid-cols-3">
        {[
          { icon: Target, t: "Our mission", d: "To help every student make a well-informed choice about their higher education by offering clear, honest guidance on online and regular programmes." },
          { icon: Eye, t: "Our vision", d: "A future where students across India can access trustworthy admission information and support, wherever they live." },
          { icon: Compass, t: "How we work", d: "We share only verified information, clearly label partner institutions, never publish campus fees, and keep your enquiry details private." },
        ].map((b) => (
          <section key={b.t} className="rounded-xl border p-6"><b.icon className="h-7 w-7 text-primary" aria-hidden /><h2 className="mt-3 text-xl font-bold">{b.t}</h2><p className="mt-2 text-muted-foreground">{b.d}</p></section>
        ))}
      </div>
      <div className="container-site pb-16 text-center"><Button asChild size="lg"><Link to="/#enquiry">Get Free Counselling</Link></Button></div>
    </>
  );
}

const LAST_UPDATED = "13 October 2026";

function Legal({ title, path, sections }: { title: string; path: string; sections: [string, string][] }) {
  return (
    <>
      <Seo title={title} description={`${title} for the ${SITE.name} website.`} path={path} />
      <PageHeader title={title}><Breadcrumbs items={[{ label: title }]} /></PageHeader>
      <article className="container-site section max-w-3xl">
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        {sections.map(([h, b]) => <section key={h} className="mt-8"><h2 className="text-xl font-bold">{h}</h2><p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">{b}</p></section>)}
        <p className="mt-10 text-sm">Questions? Email <a className="text-primary" href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phoneDisplay}.</p>
      </article>
    </>
  );
}

export const PrivacyPage = () => (
  <Legal title="Privacy Policy" path="/privacy-policy" sections={[
    ["Who we are", `${SITE.name} ("we", "us") provides admission guidance for online and regular higher-education programmes in India. This policy explains how we handle personal information collected through this website.`],
    ["Information we collect", "When you submit an enquiry or contact form we collect the details you provide: name, mobile number, email (if given), qualification, study preferences, course interest, topic and message. We also record the date/time, the page you submitted from and your consent statement. Our servers may log technical information such as IP address and browser type for security and abuse prevention."],
    ["How we use it", "We use your information to respond to your enquiry, provide counselling, schedule follow-ups and improve our service. With your consent, we may contact you by phone, SMS, email or WhatsApp about your enquiry."],
    ["Sharing", "We do not sell your personal information. We may share relevant details with an institution only where needed to progress your application and with your agreement, or where required by law. Service providers who host our systems process data on our behalf under confidentiality obligations."],
    ["Retention", "We keep enquiry records only for as long as needed for the purposes above or as required by law, after which they are deleted or anonymised."],
    ["Your choices and rights", `You may ask to access, correct or delete your information, or withdraw consent to be contacted, by emailing ${SITE.email}. Withdrawing consent does not affect processing already carried out.`],
    ["Security", "We use reasonable technical and organisational measures to protect your information. No method of transmission or storage is completely secure."],
    ["Changes", "We may update this policy. The \"Last updated\" date above shows when it was last revised."],
  ]} />
);

export const TermsPage = () => (
  <Legal title="Terms & Conditions" path="/terms-and-conditions" sections={[
    ["Acceptance", `By using this website you agree to these terms. If you do not agree, please do not use the website.`],
    ["Our service", `${SITE.name} provides information and admission guidance. We are not a university or college and do not grant admission. Admission decisions are made solely by the institutions concerned.`],
    ["Accuracy of information", "We aim to show only verified information, but programme details, eligibility, recognition and fees can change. You are responsible for confirming all details with the institution and relevant regulator before applying or paying."],
    ["Your responsibilities", "You agree to provide accurate information in forms and not to misuse the website, submit spam, or attempt to access restricted areas."],
    ["Third-party links", "Links to institutions, exam bodies and other websites are provided for convenience. We are not responsible for their content or practices."],
    ["Limitation of liability", "To the extent permitted by law, we are not liable for any loss arising from reliance on information on this website or from decisions made by institutions."],
    ["Governing law", "These terms are governed by the laws of India."],
  ]} />
);

export const DisclaimerPage = () => (
  <Legal title="Disclaimer" path="/disclaimer" sections={[
    ["General", "Information on this website is for general guidance only and does not constitute a guarantee of admission, placement or any outcome."],
    ["Institutions and partnerships", "Institutions are labelled as verified partners only where a partnership is confirmed. Other institutions are listed for information. Names and logos belong to their respective owners."],
    ["Fees", "Fees are shown only for online programmes where we have verified the fee and its validity period. Fees for regular/campus programmes are not published. Always confirm current fees with the institution."],
    ["Entrance exams", "Exam information is linked to official sources with a last-verified date. Exam bodies may change dates and rules at any time; the official website is the final authority."],
  ]} />
);
