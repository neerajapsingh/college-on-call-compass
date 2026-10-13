import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EmptyState, ErrorState, LoadingGrid, PageHeader } from "@/components/common";
import { Directory } from "@/components/Directory";
import { Faq } from "@/components/Faq";
import { CourseCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/lib/queries";
import { COURSE_CATEGORIES } from "./Home";

function CounsellingCta() {
  return (
    <section className="section bg-secondary/60">
      <div className="container-site flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Not sure which option suits you?</h2>
        <p className="max-w-xl text-muted-foreground">Talk to a College On Call counsellor about your goals and eligibility.</p>
        <Button asChild size="lg"><Link to="/#enquiry">Get Free Counselling</Link></Button>
      </div>
    </section>
  );
}

export function UniversitiesPage() {
  return (
    <>
      <Seo title="Universities & Colleges Directory" description="Search and compare universities and colleges by category, course, mode, location and partnership." path="/universities" />
      <PageHeader title="Universities & Colleges" intro="Search, filter and compare institutions. Partner status is always shown."><Breadcrumbs items={[{ label: "Universities" }]} /></PageHeader>
      <div className="container-site section"><Directory /></div>
      <CounsellingCta />
    </>
  );
}

function OnlineCourses() {
  const q = useCourses({ mode: "online", per_page: 6 });
  return q.isLoading ? <LoadingGrid count={3} /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> :
    !q.data?.items.length ? <EmptyState title="No online programmes listed yet" text="Verified programmes will appear here once added." /> :
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{q.data.items.map((c) => <CourseCard key={c.id} course={c} />)}</div>;
}

export function OnlineDegreesPage() {
  return (
    <>
      <Seo title="Online Degrees in India" description="Explore verified online degree programmes. Compare universities and get counselling from College On Call." path="/online-degrees" />
      <PageHeader title="Your Degree. Your Future. Your Way." intro="Explore online degree programmes. We show recognition and fees only when verified and current."><Breadcrumbs items={[{ label: "Online Degrees" }]} /></PageHeader>
      <section className="container-site section">
        <h2 className="text-2xl font-bold">Online course categories</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {COURSE_CATEGORIES.map((c) => <Link key={c.slug} to={`/courses?mode=online&category=${c.slug}`} className="rounded-full border px-4 py-2 text-sm hover:border-primary hover:text-primary">{c.label}</Link>)}
        </div>
        <h2 className="mt-12 text-2xl font-bold">Online programmes</h2>
        <div className="mt-5"><OnlineCourses /></div>
        <h2 className="mt-12 text-2xl font-bold">Universities offering online degrees</h2>
        <div className="mt-5"><Directory variant="online" /></div>
      </section>
      <CounsellingCta />
      <Faq items={[
        { q: "Are online degrees valid?", a: "Validity depends on the university's recognition for online programmes. We show recognition details only after verifying them; always confirm with the university and regulator before enrolling." },
        { q: "Can I study online while working?", a: "Many online programmes are designed for working learners. Schedules and assessment formats differ, so check programme details or ask a counsellor." },
        { q: "Are fees shown here final?", a: "Only verified fees with a validity date are shown. Fees can change — please confirm with the university before paying." },
      ]} />
    </>
  );
}

export function RegularAdmissionsPage() {
  return (
    <>
      <Seo title="Regular Admissions — Private B-Schools & Engineering Colleges" description="Find private B-schools and private engineering colleges for full-time campus admission. Filter by category, course and location." path="/regular-admissions" />
      <PageHeader title="Find the Right College for Your Future." intro="Private B-schools and private engineering colleges for full-time campus programmes. Fees are not displayed — speak to a counsellor for current details."><Breadcrumbs items={[{ label: "Regular Admissions" }]} /></PageHeader>
      <div className="container-site section">
        <p className="mb-6 rounded-lg border border-primary/20 bg-accent/50 p-4 text-sm">Listings are labelled as <strong>Verified partner</strong> or <strong>Non-partner</strong>. Government institutions are not included in this section.</p>
        <Directory variant="regular" />
      </div>
      <CounsellingCta />
    </>
  );
}
