import { Link } from "react-router-dom";
import { LEAD_STATUSES, useDashboard } from "@/lib/admin";
import { PageTitle, QueryView, StatusBadge, fmtDate, AdminEmpty } from "./ui";

const Stat = ({ label, value, to }: { label: string; value: number; to?: string }) => {
  const body = (<><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-3xl font-bold">{value.toLocaleString("en-IN")}</p></>);
  return to ? <Link to={to} className="rounded-lg border bg-card p-4 hover:border-primary transition-colors">{body}</Link> : <div className="rounded-lg border bg-card p-4">{body}</div>;
};

export default function Dashboard() {
  const q = useDashboard();
  return (
    <>
      <PageTitle title="Dashboard" />
      <QueryView q={q}>
        {(d) => (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Total leads" value={d.total_leads} to="/admin/leads" />
              <Stat label="New today" value={d.leads_today} />
              <Stat label="Follow-ups due today" value={d.followups_due_today} to="/admin/followups?view=today" />
              <Stat label="Overdue follow-ups" value={d.followups_overdue} to="/admin/followups?view=overdue" />
            </div>
            <div className="grid gap-3 sm:grid-cols-5">
              {LEAD_STATUSES.map((s) => (
                <Link key={s.value} to={`/admin/leads?status=${s.value}`} className="rounded-lg border bg-card p-3 hover:border-primary">
                  <StatusBadge s={s.value} /><p className="mt-2 text-2xl font-semibold">{d.by_status?.[s.value] ?? 0}</p>
                </Link>
              ))}
            </div>
            <section className="rounded-lg border bg-card">
              <h2 className="border-b p-4 font-semibold">Recent enquiries</h2>
              {d.recent_leads.length === 0 ? <div className="p-4"><AdminEmpty title="No enquiries yet" /></div> : (
                <ul className="divide-y">
                  {d.recent_leads.map((l) => (
                    <li key={l.id}><Link to={`/admin/leads/${l.id}`} className="flex flex-wrap items-center gap-3 p-4 hover:bg-muted/50">
                      <span className="font-medium">{l.full_name}</span><span className="text-sm text-muted-foreground">{l.course_interest ?? l.topic ?? "—"}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{fmtDate(l.created_at)}</span><StatusBadge s={l.status} />
                    </Link></li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </QueryView>
    </>
  );
}
