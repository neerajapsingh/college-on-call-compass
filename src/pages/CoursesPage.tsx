import { useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EmptyState, ErrorState, LoadingGrid, NativeSelect, PageHeader, Pager } from "@/components/common";
import { CourseCard } from "@/components/cards";
import { Input } from "@/components/ui/input";
import { useCourses } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { COURSE_CATEGORIES } from "./Home";

export default function CoursesPage() {
  const [sp, setSp] = useSearchParams();
  const mode = sp.get("mode") ?? "";
  const page = Number(sp.get("page") || 1);
  const params = { q: sp.get("q") ?? "", category: sp.get("category") ?? "", mode, level: sp.get("level") ?? "", page, per_page: 12 };
  const q = useCourses(params);
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); n.delete("page"); setSp(n, { replace: true }); };

  return (
    <>
      <Seo title="Courses — Online & Regular Programmes" description="Browse online and regular programmes: MBA/PGDM, B.Tech, MCA/BCA, BBA/B.Com, data & analytics and more." path="/courses" />
      <PageHeader title="Explore Courses" intro="Choose between online programmes and regular campus programmes. Fees are shown only for verified online programmes."><Breadcrumbs items={[{ label: "Courses" }]} /></PageHeader>
      <div className="container-site section">
        <div role="tablist" aria-label="Study mode" className="inline-flex rounded-lg border p-1">
          {[["", "All"], ["online", "Online"], ["regular", "Regular (campus)"]].map(([v, l]) => (
            <button key={v} role="tab" aria-selected={mode === v} onClick={() => set("mode", v)} className={cn("rounded-md px-4 py-2 text-sm font-medium", mode === v ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>{l}</button>
          ))}
        </div>
        <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-4 grid gap-3 sm:grid-cols-3">
          <div><label htmlFor="c-q" className="sr-only">Search courses</label><Input id="c-q" placeholder="Search courses" defaultValue={params.q} onChange={(e) => set("q", e.target.value.trim())} /></div>
          <div><label htmlFor="c-cat" className="sr-only">Category</label>
            <NativeSelect id="c-cat" value={params.category} onChange={(e) => set("category", e.target.value)}><option value="">All categories</option>{COURSE_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}</NativeSelect></div>
          <div><label htmlFor="c-lvl" className="sr-only">Level</label>
            <NativeSelect id="c-lvl" value={params.level} onChange={(e) => set("level", e.target.value)}><option value="">All levels</option><option value="ug">Undergraduate</option><option value="pg">Postgraduate</option><option value="diploma">Diploma</option><option value="certificate">Certificate</option></NativeSelect></div>
        </form>
        {mode === "regular" && <p className="mt-4 text-sm text-muted-foreground">Fees for regular/campus programmes are not published. Ask a counsellor for current details.</p>}
        <div className="mt-6" aria-live="polite">
          {q.isLoading ? <LoadingGrid /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> :
            !q.data?.items.length ? <EmptyState title="No courses found" text="Try different filters, or ask our counsellors." /> : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{q.data.items.map((c) => <CourseCard key={c.id} course={c} />)}</div>
                <Pager page={page} totalPages={q.data.meta.total_pages} onChange={(p) => { const n = new URLSearchParams(sp); n.set("page", String(p)); setSp(n); }} />
              </>
            )}
        </div>
      </div>
    </>
  );
}
