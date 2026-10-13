import { Link, useParams, useSearchParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EmptyState, ErrorState, LoadingGrid, PageHeader, Pager, Spinner } from "@/components/common";
import { useArticle, useArticles } from "@/lib/queries";
import type { Article, ArticleCategory } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export const BLOG_CATEGORIES: { slug: ArticleCategory; label: string }[] = [
  { slug: "online-degree-guides", label: "Online Degree Guides" },
  { slug: "university-comparisons", label: "University Comparisons" },
  { slug: "admission-updates", label: "Admission Updates" },
  { slug: "career-guides", label: "Career & Education Guides" },
];

/** Exam names only. All dates/details come from verified articles with official source links. */
export const EXAMS = [
  { slug: "cat", name: "CAT" }, { slug: "xat", name: "XAT" }, { slug: "cmat", name: "CMAT" }, { slug: "mat", name: "MAT" },
  { slug: "nmat", name: "NMAT" }, { slug: "snap", name: "SNAP" }, { slug: "atma", name: "ATMA" }, { slug: "mah-mba-cet", name: "MAH MBA CET" },
  { slug: "jee-main", name: "JEE Main" }, { slug: "bitsat", name: "BITSAT" }, { slug: "met", name: "MET" }, { slug: "viteee", name: "VITEEE" },
  { slug: "srmjeee", name: "SRMJEEE" }, { slug: "mht-cet", name: "MHT CET" },
];

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
const articlePath = (a: Article) => (a.category === "entrance-exams" ? `/entrance-exams/article/${a.slug}` : `/blog/${a.slug}`);

function ArticleList({ params }: { params: Record<string, string | number | undefined> }) {
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || 1);
  const q = useArticles({ ...params, page, per_page: 9 });
  if (q.isLoading) return <LoadingGrid />;
  if (q.isError) return <ErrorState error={q.error} onRetry={() => q.refetch()} />;
  if (!q.data?.items.length) return <EmptyState title="No articles published yet" text="Articles will appear here once our team publishes them." />;
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {q.data.items.map((a) => (
          <article key={a.id} className="flex flex-col rounded-xl border bg-card p-5 shadow-card">
            <h3 className="font-semibold"><Link to={articlePath(a)} className="hover:text-primary">{a.title}</Link></h3>
            {a.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>}
            <p className="mt-auto pt-4 text-xs text-muted-foreground"><time dateTime={a.updated_at ?? a.published_at}>Updated {fmt(a.updated_at ?? a.published_at)}</time></p>
          </article>
        ))}
      </div>
      <Pager page={page} totalPages={q.data.meta.total_pages} onChange={(p) => { const n = new URLSearchParams(sp); n.set("page", String(p)); setSp(n); }} />
    </>
  );
}

export function BlogPage() {
  const [sp, setSp] = useSearchParams();
  const cat = sp.get("category") ?? "";
  return (
    <>
      <Seo title="Blog — Admission Guides & Updates" description="Guides on online degrees, university comparisons, admission updates and careers from College On Call." path="/blog" />
      <PageHeader title="Blog" intro="Guides and updates to help you choose well."><Breadcrumbs items={[{ label: "Blog" }]} /></PageHeader>
      <div className="container-site section">
        <nav aria-label="Blog categories" className="mb-6 flex flex-wrap gap-2">
          {[{ slug: "", label: "All" }, ...BLOG_CATEGORIES].map((c) => (
            <button key={c.slug} onClick={() => setSp(c.slug ? { category: c.slug } : {})} aria-pressed={cat === c.slug} className={cn("rounded-full border px-4 py-1.5 text-sm", cat === c.slug ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary")}>{c.label}</button>
          ))}
          <Link to="/entrance-exams" className="rounded-full border px-4 py-1.5 text-sm hover:border-primary">Entrance Exams</Link>
        </nav>
        <ArticleList params={{ category: cat || "online-degree-guides,university-comparisons,admission-updates,career-guides" }} />
      </div>
    </>
  );
}

export function EntranceExamsPage() {
  return (
    <>
      <Seo title="Entrance Exams Hub — CAT, XAT, JEE Main & more" description="Entrance exam guides for management and engineering admissions, with links to official sources." path="/entrance-exams" />
      <PageHeader title="Entrance Exams" intro="Exam guides with official source links and last-verified dates. Always confirm dates on the official website."><Breadcrumbs items={[{ label: "Entrance Exams" }]} /></PageHeader>
      <div className="container-site section">
        <h2 className="text-xl font-bold">Browse by exam</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {EXAMS.map((e) => <Link key={e.slug} to={`/entrance-exams/${e.slug}`} className="rounded-lg border bg-card p-3 text-center text-sm font-semibold hover:border-primary hover:text-primary">{e.name}</Link>)}
        </div>
        <h2 className="mt-12 text-xl font-bold">Latest exam articles</h2>
        <div className="mt-4"><ArticleList params={{ category: "entrance-exams" }} /></div>
      </div>
    </>
  );
}

export function ExamPage() {
  const { exam } = useParams();
  const e = EXAMS.find((x) => x.slug === exam);
  if (!e) return <div className="container-site section"><EmptyState title="Exam not found" action={<Link to="/entrance-exams" className="text-primary">All exams</Link>} /></div>;
  return (
    <>
      <Seo title={`${e.name} — Exam Guide`} description={`${e.name} articles and updates with official source links.`} path={`/entrance-exams/${e.slug}`} />
      <PageHeader title={e.name} intro="Information below comes from published articles linked to official sources."><Breadcrumbs items={[{ label: "Entrance Exams", to: "/entrance-exams" }, { label: e.name }]} /></PageHeader>
      <div className="container-site section"><ArticleList params={{ category: "entrance-exams", exam: e.slug }} /></div>
    </>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const q = useArticle(slug);
  if (q.isLoading) return <Spinner />;
  if (q.isError || !q.data) return <div className="container-site section">{q.error instanceof ApiError && q.error.status === 404 ? <EmptyState title="Article not found" /> : <ErrorState error={q.error} onRetry={() => q.refetch()} />}</div>;
  const a = q.data;
  const isExam = a.category === "entrance-exams";
  const crumbs = isExam ? [{ label: "Entrance Exams", to: "/entrance-exams" }, { label: a.title }] : [{ label: "Blog", to: "/blog" }, { label: a.title }];
  return (
    <>
      <Seo title={a.title} description={(a.excerpt ?? a.title).slice(0, 155)} path={articlePath(a)} type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, datePublished: a.published_at, ...(a.updated_at ? { dateModified: a.updated_at } : {}), ...(a.author ? { author: { "@type": "Person", name: a.author } } : { author: { "@type": "Organization", name: "College On Call" } }) }} />
      <PageHeader title={a.title}><Breadcrumbs items={crumbs} /></PageHeader>
      <article className="container-site section max-w-3xl">
        <p className="text-sm text-muted-foreground">
          {a.author && <>By {a.author} · </>}Published <time dateTime={a.published_at}>{fmt(a.published_at)}</time>
          {a.updated_at && <> · Updated <time dateTime={a.updated_at}>{fmt(a.updated_at)}</time></>}
        </p>
        {(a.source_url || a.last_verified_at) && (
          <div className="mt-4 rounded-lg border border-primary/20 bg-accent/50 p-4 text-sm">
            {a.last_verified_at && <p>Last verified against official sources: {fmt(a.last_verified_at)}</p>}
            {a.source_url && <a href={a.source_url} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-flex items-center gap-1 font-medium text-primary hover:underline">Official source<ExternalLink className="h-3 w-3" aria-hidden /></a>}
          </div>
        )}
        {isExam && !a.source_url && <p className="mt-4 rounded-lg border border-destructive/30 p-4 text-sm">Official source not linked. Confirm all exam details on the conducting body's official website.</p>}
        <div className="mt-8 space-y-4 leading-relaxed">
          {a.content.split(/\n{2,}/).map((blk, i) =>
            blk.startsWith("## ") ? <h2 key={i} className="pt-4 text-xl font-bold">{blk.slice(3)}</h2> :
            blk.startsWith("### ") ? <h3 key={i} className="pt-2 text-lg font-semibold">{blk.slice(4)}</h3> :
            <p key={i} className="whitespace-pre-line">{blk}</p>)}
        </div>
      </article>
    </>
  );
}
