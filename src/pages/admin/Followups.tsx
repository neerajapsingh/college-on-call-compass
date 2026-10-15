import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pager } from "@/components/common";
import { api, errorMessage } from "@/lib/api";
import { useAdminMutation, useFollowups } from "@/lib/admin";
import { PageTitle, QueryView, fmtDate } from "./ui";

const VIEWS = [{ v: "overdue", l: "Overdue" }, { v: "today", l: "Today" }, { v: "upcoming", l: "Upcoming" }, { v: "completed", l: "Completed" }];

export default function Followups() {
  const [sp, setSp] = useSearchParams();
  const view = sp.get("view") ?? "overdue";
  const page = Number(sp.get("page") ?? 1);
  const q = useFollowups({ view, page, per_page: 25 });
  const done = useAdminMutation((id: number) => api(`/api/admin/followups/${id}`, { method: "PATCH", body: { status: "done" } }));

  return (
    <>
      <PageTitle title="Follow-ups" />
      <div role="tablist" className="mb-4 flex flex-wrap gap-2">
        {VIEWS.map((x) => <Button key={x.v} role="tab" aria-selected={view === x.v} size="sm" variant={view === x.v ? "default" : "outline"} onClick={() => setSp({ view: x.v })}>{x.l}</Button>)}
      </div>
      <QueryView q={q} empty={(d) => d.items.length === 0}>
        {(d) => (
          <>
            <ul className="divide-y rounded-lg border bg-card">
              {d.items.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div>
                    <Link to={`/admin/leads/${f.lead_id}`} className="font-medium text-primary hover:underline">{f.lead_name}</Link>
                    <p className="text-sm text-muted-foreground">{f.lead_mobile}{f.note ? ` · ${f.note}` : ""}</p>
                  </div>
                  <span className="ml-auto text-sm">{fmtDate(f.due_at)}</span>
                  {f.status === "pending" && <Button size="sm" variant="outline" disabled={done.isPending} onClick={() => done.mutate(f.id, { onSuccess: () => toast.success("Marked complete"), onError: (e) => toast.error(errorMessage(e)) })}>Mark done</Button>}
                </li>
              ))}
            </ul>
            <Pager page={d.meta.page} totalPages={d.meta.total_pages} onChange={(p) => setSp({ view, page: String(p) })} />
          </>
        )}
      </QueryView>
    </>
  );
}
