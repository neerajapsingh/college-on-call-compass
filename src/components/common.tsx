import * as React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronRight, Inbox, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE } from "@/lib/site";
import { errorMessage, apiConfigured } from "@/lib/api";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${SITE.name} home`}>
      <span aria-hidden className={cn("grid h-9 w-9 place-items-center rounded-lg font-extrabold", light ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground")}>C</span>
      <span className="leading-tight">
        <span className={cn("block text-base font-bold", light ? "text-navy-foreground" : "text-navy")}>College On Call</span>
        <span className={cn("block text-[11px] font-medium tracking-wide", light ? "text-navy-muted" : "text-muted-foreground")}>{SITE.tagline}</span>
      </span>
    </Link>
  );
}

export const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...p }, ref) => (
    <select ref={ref} className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", className)} {...p} />
  ),
);
NativeSelect.displayName = "NativeSelect";

export function Field({ label, htmlFor, error, required, hint, children }: { label: string; htmlFor: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label} {required ? <span className="text-destructive" aria-hidden>*</span> : <span className="font-normal text-muted-foreground">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="bg-hero-gradient text-navy-foreground">
      <div className="container-site py-12 md:py-16">
        {children}
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-navy-muted">{intro}</p>}
      </div>
    </div>
  );
}

export interface Crumb { label: string; to?: string }
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", to: "/" }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.to ? { item: SITE.url + c.to } : {}) })),
  };
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-navy-muted">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
            {c.to && i < all.length - 1 ? <Link to={c.to} className="hover:text-navy-foreground hover:underline">{c.label}</Link> : <span aria-current="page" className="text-navy-foreground">{c.label}</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
    </nav>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
    </div>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return <div role="status" className="flex items-center justify-center gap-2 py-12 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" aria-hidden />{label}…</div>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <Inbox className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
      <p className="mt-3 font-semibold">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry, title = "We couldn't load this information" }: { error: unknown; onRetry?: () => void; title?: string }) {
  return (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="mx-auto h-7 w-7 text-destructive" aria-hidden />
      <p className="mt-2 font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{errorMessage(error)}</p>
      {!apiConfigured && <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">You can still reach us on {SITE.phoneDisplay} or {SITE.email}.</p>}
      {onRetry && apiConfigured && <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={onRetry}><RefreshCw className="h-4 w-4" />Try again</Button>}
    </div>
  );
}

export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3 text-sm">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
      <span>Page {page} of {totalPages}</span>
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button>
    </nav>
  );
}
