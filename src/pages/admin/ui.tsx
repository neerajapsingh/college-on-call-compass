import { useEffect, type ReactNode } from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiConfigured, errorMessage } from "@/lib/api";
import { Spinner } from "@/components/common";
import type { LeadStatus } from "@/lib/types";
import { statusLabel } from "@/lib/admin";

export function useAdminTitle(t: string) {
  useEffect(() => {
    document.title = `${t} · Admin · College On Call`;
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "robots"); document.head.appendChild(m); }
    m.setAttribute("content", "noindex,nofollow");
  }, [t]);
}

export function AdminError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="mx-auto h-6 w-6 text-destructive" aria-hidden />
      <p className="mt-2 font-semibold">{apiConfigured ? "Couldn't load from the server" : "CRM server not connected"}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {apiConfigured ? errorMessage(error) : "Set VITE_API_BASE_URL to your PHP API (e.g. http://localhost/collegeoncall-api) and rebuild. No data is shown until the server responds."}
      </p>
      {onRetry && apiConfigured && <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={onRetry}><RefreshCw className="h-4 w-4" />Try again</Button>}
    </div>
  );
}

export function AdminEmpty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <Inbox className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
      <p className="mt-2 font-medium">{title}</p>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

/** Renders loading / error / empty / content for a react-query result. */
export function QueryView<T>({ q, empty, children }: { q: { isLoading: boolean; error: unknown; data: T | undefined; refetch: () => unknown }; empty?: (d: T) => boolean; children: (d: T) => ReactNode }) {
  if (q.isLoading) return <Spinner />;
  if (q.error || q.data === undefined) return <AdminError error={q.error} onRetry={() => q.refetch()} />;
  if (empty?.(q.data)) return <AdminEmpty title="Nothing here yet" text="Records will appear once they exist in the database." />;
  return <>{children(q.data)}</>;
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  useAdminTitle(title);
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <div className="ml-auto flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const TONE: Record<LeadStatus, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-accent text-accent-foreground",
  counselling_done: "bg-secondary text-secondary-foreground",
  converted: "bg-success/15 text-success",
  not_interested: "bg-muted text-muted-foreground",
};
export const StatusBadge = ({ s }: { s: LeadStatus }) => <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TONE[s]}`}>{statusLabel(s)}</span>;

export const fmtDate = (iso: string | null | undefined, time = true) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", ...(time ? { timeStyle: "short" } : {}) }) : "—";
