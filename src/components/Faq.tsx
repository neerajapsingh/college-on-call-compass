import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface FaqItem { q: string; a: string }

export function Faq({ items, title = "Frequently asked questions" }: { items: FaqItem[]; title?: string }) {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })) };
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container-site max-w-3xl">
        <h2 id="faq-title" className="text-center text-3xl font-bold">{title}</h2>
        <Accordion type="single" collapsible className="mt-8">
          {items.map((i, n) => (
            <AccordionItem key={n} value={`f${n}`}>
              <AccordionTrigger className="text-left">{i.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{i.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
    </section>
  );
}

export const GENERAL_FAQ: FaqItem[] = [
  { q: "What does College On Call do?", a: "We help students understand their options for online degrees and regular (campus) admissions, shortlist institutions and courses, and navigate the application process." },
  { q: "What is the difference between online and regular programmes?", a: "Online programmes are delivered remotely and suit working professionals or students who need flexibility. Regular programmes are full-time on campus. Always check that a programme's recognition suits your goals." },
  { q: "Why don't you show fees for regular/campus courses?", a: "Campus fees change often and vary by category and seat type, so we don't publish them. Our counsellors will help you get current figures directly from the institution." },
  { q: "Are all listed institutions your partners?", a: "No. We clearly mark verified partners. Other listings are shown for information and are labelled as non-partners where relevant." },
  { q: "How do I get counselling?", a: "Fill in the enquiry form or contact us on +91 7471166366 / info@collegeoncall.com. Our team will reach out to you." },
];
