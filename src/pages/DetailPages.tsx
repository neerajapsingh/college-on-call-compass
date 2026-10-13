import { Link, useParams } from "react-router-dom";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EmptyState, ErrorState, PageHeader, Spinner } from "@/components/common";
import { CourseCard, LEVEL_LABEL, MODE_LABEL, institutionPath } from "@/components/cards";
import { CATEGORY_LABEL } from "@/components/Directory";
import { Button } from "@/components/ui/button";
import { useCourse, useCourses, useInstitution } from "@/lib/queries";
import { formatFee } from "@/lib/rules";
import { ApiError } from "@/lib/api";

const isNotFound = (e: unknown) => e instanceof ApiError && e.status === 404;

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-10"><h2 className="text-xl font-bold">{title}</h2><div className="mt-3 text-muted-foreground">{children}</div></section>;
}
const Paras = ({ text }: { text: string }) => <>{text.split(/\n{2,}/).map((p, i) => <p key={i} className="mt-2 whitespace-pre-line">{p}</p>)}</>;

function Sidebar() {
  return (
    <aside className="h-fit rounded-xl border bg-secondary/60 p-6 lg:sticky lg:top-28">
      <h2 className="font-bold">Need guidance?</h2>
      <p className="mt-2 text-sm text-muted-foreground">Our counsellors can help with eligibility, documents and next steps.</p>
      <Button asChild className="mt-4 w-full"><Link to="/#enquiry">Get Free Counselling</Link></Button>
    </aside>
  );
}

export function InstitutionDetailPage() {
  const { slug } = useParams();
  const inst = useInstitution(slug);
  const courses = useCourses({ institution: slug, per_page: 50 }, !!inst.data);
  if (inst.isLoading) return <Spinner />;
  if (inst.isError || !inst.data) return <div className="container-site section">{isNotFound(inst.error) ? <EmptyState title="Institution not found" action={<Link className="text-primary" to="/universities">Back to directory</Link>} /> : <ErrorState error={inst.error} onRetry={() => inst.refetch()} />}</div>;
  const i = inst.data;
  const listPath = i.type === "college" ? "/regular-admissions" : "/universities";
  return (
    <>
      <Seo title={i.name} description={(i.description ?? `${i.name} — programmes, eligibility and admission guidance.`).slice(0, 155)} path={institutionPath(i)}
        jsonLd={{ "@context": "https://schema.org", "@type": "CollegeOrUniversity", name: i.name, ...(i.website ? { url: i.website } : {}), ...(i.city || i.state ? { address: { "@type": "PostalAddress", addressLocality: i.city ?? undefined, addressRegion: i.state ?? undefined, addressCountry: "IN" } } : {}) }} />
      <PageHeader title={i.name} intro={[CATEGORY_LABEL[i.category], [i.city, i.state].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}>
        <Breadcrumbs items={[{ label: i.type === "college" ? "Regular Admissions" : "Universities", to: listPath }, { label: i.name }]} />
      </PageHeader>
      <div className="container-site section grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap gap-2 text-sm">
            {i.modes.map((m) => <span key={m} className="rounded-full border px-3 py-1">{MODE_LABEL[m]}</span>)}
            {i.is_partner_verified ? <span className="flex items-center gap-1 rounded-full bg-success px-3 py-1 text-success-foreground"><BadgeCheck className="h-4 w-4" aria-hidden />Verified partner</span> : <span className="rounded-full border px-3 py-1 text-muted-foreground">Non-partner</span>}
          </div>
          <Block title="Overview">{i.description ? <Paras text={i.description} /> : <p>Overview not yet available.</p>}</Block>
          <Block title="Programmes">
            {courses.isLoading ? <Spinner /> : courses.isError ? <ErrorState error={courses.error} onRetry={() => courses.refetch()} /> :
              !courses.data?.items.length ? <p>No programmes listed yet.</p> :
              <div className="grid gap-4 sm:grid-cols-2">{courses.data.items.map((c) => <CourseCard key={c.id} course={c} showInstitution={false} />)}</div>}
          </Block>
          <Block title="Eligibility">{i.eligibility_summary ? <Paras text={i.eligibility_summary} /> : <p>Eligibility varies by programme. Ask a counsellor or check the institution's official website.</p>}</Block>
          <Block title="Admission process">{i.admission_process ? <Paras text={i.admission_process} /> : <p>Contact our counsellors for the current admission process.</p>}</Block>
          <Block title="Recognition & approvals">{i.approvals.length ? <ul className="list-disc pl-5">{i.approvals.map((a) => <li key={a}>{a}</li>)}</ul> : <p>Recognition details have not yet been verified by our team.</p>}</Block>
          <Block title="Partnership">{i.is_partner_verified ? <p>{i.name} is a verified College On Call partner.</p> : <p>{i.name} is listed for information and is not a College On Call partner.</p>}</Block>
          {i.website && <p className="mt-8"><a href={i.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-primary hover:underline">Official website<ExternalLink className="h-4 w-4" aria-hidden /></a></p>}
        </div>
        <Sidebar />
      </div>
    </>
  );
}

export function CourseDetailPage() {
  const { slug } = useParams();
  const q = useCourse(slug);
  if (q.isLoading) return <Spinner />;
  if (q.isError || !q.data) return <div className="container-site section">{isNotFound(q.error) ? <EmptyState title="Course not found" action={<Link className="text-primary" to="/courses">Back to courses</Link>} /> : <ErrorState error={q.error} onRetry={() => q.refetch()} />}</div>;
  const c = q.data;
  const fee = formatFee(c);
  return (
    <>
      <Seo title={`${c.name} — ${c.institution_name}`} description={(c.description ?? `${c.name} (${MODE_LABEL[c.mode]}) at ${c.institution_name}.`).slice(0, 155)} path={`/courses/${c.slug}`}
        jsonLd={{ "@context": "https://schema.org", "@type": "Course", name: c.name, provider: { "@type": "CollegeOrUniversity", name: c.institution_name } }} />
      <PageHeader title={c.name} intro={`${MODE_LABEL[c.mode]} · ${LEVEL_LABEL[c.level]} · ${c.institution_name}`}><Breadcrumbs items={[{ label: "Courses", to: "/courses" }, { label: c.name }]} /></PageHeader>
      <div className="container-site section grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <dl className="grid gap-4 rounded-xl border p-5 sm:grid-cols-3">
            <div><dt className="text-xs text-muted-foreground">Mode</dt><dd className="font-medium">{MODE_LABEL[c.mode]}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Duration</dt><dd className="font-medium">{c.duration ?? "—"}</dd></div>
            {c.mode === "online" && <div><dt className="text-xs text-muted-foreground">Fee</dt><dd className="font-medium">{fee ?? "Ask a counsellor"}</dd></div>}
          </dl>
          {fee && c.fee?.valid_until && <p className="mt-2 text-xs text-muted-foreground">Fee verified and valid until {new Date(c.fee.valid_until).toLocaleDateString("en-IN")}. Confirm with the university before paying.</p>}
          <Block title="About this course">{c.description ? <Paras text={c.description} /> : <p>Details not yet available.</p>}</Block>
          <Block title="Eligibility">{c.eligibility ? <Paras text={c.eligibility} /> : <p>Ask a counsellor for current eligibility criteria.</p>}</Block>
          <Block title="Offered by"><Link className="text-primary hover:underline" to={institutionPath({ type: c.institution_type, slug: c.institution_slug })}>{c.institution_name}</Link></Block>
        </div>
        <Sidebar />
      </div>
    </>
  );
}
