import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ClipboardCheck, Compass, GraduationCap, Laptop, Building2, PhoneCall, ShieldCheck, Scale, Search, FileCheck2, HeartHandshake } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/common";
import { EnquiryForm } from "@/components/forms/EnquiryForms";
import { InstitutionCard } from "@/components/cards";
import { CATEGORY_LABEL } from "@/components/Directory";
import { Faq, GENERAL_FAQ } from "@/components/Faq";
import { useInstitutions } from "@/lib/queries";
import { SITE } from "@/lib/site";
import hero from "@/assets/hero-students.jpg";

export const COURSE_CATEGORIES = [
  { slug: "mba-pgdm", label: "MBA / PGDM", icon: GraduationCap },
  { slug: "btech", label: "B.Tech", icon: Building2 },
  { slug: "mca-bca", label: "MCA / BCA", icon: Laptop },
  { slug: "bba-bcom", label: "BBA / B.Com", icon: BookOpen },
  { slug: "data-analytics", label: "Data & Analytics", icon: Compass },
  { slug: "other", label: "Other Degrees", icon: FileCheck2 },
];

function SearchBox() {
  const nav = useNavigate();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p = new URLSearchParams();
    fd.forEach((v, k) => { if (String(v).trim()) p.set(k, String(v).trim()); });
    nav(`/universities?${p.toString()}`);
  };
  return (
    <form role="search" aria-label="Find institutions" onSubmit={onSubmit} className="grid gap-3 rounded-2xl border bg-card p-4 shadow-card sm:grid-cols-2 lg:grid-cols-5">
      <div><label htmlFor="hs-cat" className="mb-1 block text-xs font-medium">Institution category</label>
        <NativeSelect id="hs-cat" name="category"><option value="">Any</option>{Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</NativeSelect></div>
      <div><label htmlFor="hs-course" className="mb-1 block text-xs font-medium">Course</label><Input id="hs-course" name="course" placeholder="e.g. MBA" /></div>
      <div><label htmlFor="hs-mode" className="mb-1 block text-xs font-medium">Mode</label>
        <NativeSelect id="hs-mode" name="mode"><option value="">Online or Regular</option><option value="online">Online</option><option value="regular">Regular</option></NativeSelect></div>
      <div><label htmlFor="hs-loc" className="mb-1 block text-xs font-medium">Location</label><Input id="hs-loc" name="location" placeholder="City or state" /></div>
      <div className="flex items-end"><Button type="submit" className="w-full gap-2"><Search className="h-4 w-4" aria-hidden />Search</Button></div>
    </form>
  );
}

function Showcase() {
  const q = useInstitutions({ featured: 1, per_page: 6 });
  const items = (q.data?.items ?? []).slice(0, 6);
  // Only render when backed by real, verified data from the API.
  if (q.isLoading || q.isError || items.length === 0) return null;
  return (
    <section className="section bg-secondary/50" aria-labelledby="showcase-title">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="showcase-title" className="text-3xl font-bold">Featured institutions</h2>
          <Link to="/universities" className="text-sm font-medium text-primary hover:underline">View full directory</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((i) => <InstitutionCard key={i.id} inst={i} />)}</div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: PhoneCall, t: "Share your goals", d: "Submit an enquiry or call us. Tell us your qualification, preferred mode and interests." },
  { icon: Compass, t: "Get counselling", d: "A counsellor helps you compare suitable institutions and programmes." },
  { icon: ClipboardCheck, t: "Apply with support", d: "We guide you through documents, applications and next steps." },
];
const WHY = [
  { icon: Scale, t: "Online and regular options", d: "One place to explore online degrees and private campus programmes." },
  { icon: ShieldCheck, t: "Verified information only", d: "We show recognition and online fees only when verified and current." },
  { icon: HeartHandshake, t: "Transparent partnerships", d: "Partner institutions are clearly labelled so you can decide with full context." },
  { icon: PhoneCall, t: "Reachable counsellors", d: `Call ${SITE.phoneDisplay} or message us on WhatsApp.` },
];

export default function Home() {
  return (
    <>
      <Seo title="College On Call — Online Degrees & Regular Admissions in India" description="Explore online degrees and private campus admissions in India. Compare institutions and get free counselling from College On Call." path="/"
        jsonLd={{ "@context": "https://schema.org", "@type": "Organization", name: SITE.name, url: SITE.url, email: SITE.email, telephone: "+917471166366", slogan: SITE.tagline }} />

      <section className="bg-hero-gradient text-navy-foreground">
        <div className="container-site grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-muted">{SITE.tagline}</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">Your Dream Degree Starts Here.</h1>
            <p className="mt-5 max-w-xl text-lg text-navy-muted">Explore online degrees and regular campus admissions, compare institutions, and get guidance from College On Call counsellors.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary"><a href="#enquiry">Get Free Counselling</a></Button>
              <Button asChild size="lg" variant="outline" className="border-navy-muted bg-transparent text-navy-foreground hover:bg-navy-light hover:text-navy-foreground"><Link to="/courses">Explore Courses</Link></Button>
            </div>
          </div>
          <img src={hero} alt="Students walking together on a university campus" width={1280} height={960} fetchPriority="high" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
        </div>
      </section>

      <div className="container-site -mt-8 relative z-10"><SearchBox /></div>

      <section className="section" aria-labelledby="paths-title">
        <div className="container-site">
          <h2 id="paths-title" className="text-3xl font-bold">Choose your path</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { to: "/online-degrees", icon: Laptop, t: "Online Degrees", d: "Flexible programmes from recognised universities — study while you work." },
              { to: "/regular-admissions", icon: Building2, t: "Regular Admissions", d: "Full-time campus programmes at private B-schools and engineering colleges." },
            ].map((p) => (
              <Link key={p.to} to={p.to} className="group rounded-2xl border bg-card p-7 shadow-card transition-shadow hover:shadow-card-hover">
                <p.icon className="h-8 w-8 text-primary" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold group-hover:text-primary">{p.t}</h3>
                <p className="mt-2 text-muted-foreground">{p.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Showcase />

      <section className="section" aria-labelledby="cat-title">
        <div className="container-site">
          <h2 id="cat-title" className="text-3xl font-bold">Course categories</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {COURSE_CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/courses?category=${c.slug}`} className="rounded-xl border bg-card p-5 text-center shadow-card transition-shadow hover:shadow-card-hover">
                <c.icon className="mx-auto h-7 w-7 text-primary" aria-hidden /><span className="mt-3 block text-sm font-semibold">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-secondary/50" aria-labelledby="how-title">
        <div className="container-site">
          <h2 id="how-title" className="text-3xl font-bold">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="rounded-xl border bg-card p-6">
                <span className="text-sm font-bold text-primary">Step {i + 1}</span>
                <s.icon className="mt-3 h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-3 font-semibold">{s.t}</h3><p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="container-site">
          <h2 id="why-title" className="text-3xl font-bold">Why choose College On Call</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => <div key={w.t}><w.icon className="h-7 w-7 text-primary" aria-hidden /><h3 className="mt-3 font-semibold">{w.t}</h3><p className="mt-1 text-sm text-muted-foreground">{w.d}</p></div>)}
          </div>
        </div>
      </section>

      <section id="enquiry" className="section scroll-mt-24 bg-hero-gradient" aria-labelledby="enq-title">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div className="text-navy-foreground">
            <h2 id="enq-title" className="text-3xl font-bold">Get free counselling</h2>
            <p className="mt-3 text-navy-muted">Share a few details and our team will contact you to discuss your options.</p>
            <p className="mt-6 text-sm text-navy-muted">Prefer to talk? Call <a href={SITE.phoneHref} className="font-semibold text-navy-foreground underline">{SITE.phoneDisplay}</a></p>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-card"><EnquiryForm /></div>
        </div>
      </section>

      <section className="section" aria-labelledby="trust-title">
        <div className="container-site">
          <h2 id="trust-title" className="text-3xl font-bold">Our commitments to you</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "We never publish fees for regular/campus programmes — we help you get current figures from the institution.",
              "Recognition, approvals and online fees are shown only when verified and current.",
              "Partner institutions are always labelled. Your enquiry details are used only to respond to you.",
            ].map((t) => <li key={t} className="flex gap-3 rounded-xl border p-5 text-sm"><ShieldCheck className="h-5 w-5 shrink-0 text-success" aria-hidden />{t}</li>)}
          </ul>
        </div>
      </section>

      <Faq items={GENERAL_FAQ} />
    </>
  );
}
