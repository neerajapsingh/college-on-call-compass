import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/forms/EnquiryForms";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Seo title="College On Call — Online Degrees & Regular Admissions Guidance" description="Admission guidance for online degrees and regular campus programmes in India. Enquire with College On Call." path="/" />
      <section className="bg-hero-gradient text-navy-foreground">
        <div className="container-site grid gap-10 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-muted">{SITE.tagline}</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Find the right online degree or campus programme</h1>
            <p className="mt-4 max-w-xl text-navy-muted">Talk to College On Call about courses, institutions and the admission process — then choose with confidence.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary"><a href="#enquiry">Enquire Now</a></Button>
              <Button asChild size="lg" variant="outline" className="border-navy-muted bg-transparent text-navy-foreground hover:bg-navy-light"><Link to="/contact">Contact Us</Link></Button>
            </div>
          </div>
          <div id="enquiry" className="scroll-mt-24 rounded-2xl bg-card p-6 text-card-foreground shadow-card">
            <h2 className="mb-4 text-xl font-bold">Request a callback</h2>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
