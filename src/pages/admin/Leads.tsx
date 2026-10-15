import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { NativeSelect, Pager } from "@/components/common";
import { LEAD_STATUSES, useLeads } from "@/lib/admin";
import { PageTitle, QueryView, StatusBadge, fmtDate } from "./ui";

export default function Leads() {
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== "page") n.delete("page"); setSp(n); };
  const params = { q: sp.get("q") ?? undefined, status: sp.get("status") ?? undefined, source: sp.get("source") ?? undefined, mode: sp.get("mode") ?? undefined, from: sp.get("from") ?? undefined, to: sp.get("to") ?? undefined, page: Number(sp.get("page") ?? 1), per_page: 25 };
  const res = useLeads(params);

  return (
    <>
      <PageTitle title="Leads" />
      <div className="mb-4 grid gap-2 md:grid-cols-6">
        <form className="md:col-span-2" onSubmit={(e) => { e.preventDefault(); set("q", q.trim()); }}>
          <Input aria-label="Search leads" placeholder="Search name, mobile, email…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <NativeSelect aria-label="Status" value={params.status ?? ""} onChange={(e) => set("status", e.target.value)}>
          <option value="">All statuses</option>{LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </NativeSelect>
        <NativeSelect aria-label="Source" value={params.source ?? ""} onChange={(e) => set("source", e.target.value)}>
          <option value="">All sources</option><option value="home_enquiry">Home enquiry</option><option value="contact">Contact page</option>
        </NativeSelect>
        <Input aria-label="From date" type="date" value={params.from ?? ""} onChange={(e) => set("from", e.target.value)} />
        <Input aria-label="To date" type="date" value={params.to ?? ""} onChange={(e) => set("to", e.target.value)} />
      </div>
      <QueryView q={res} empty={(d) => d.items.length === 0}>
        {(d) => (
          <>
            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left"><tr>{["Name", "Mobile", "Interest", "Source", "Status", "Next follow-up", "Received"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                <tbody className="divide-y">
                  {d.items.map((l) => (
                    <tr key={l.id} className="hover:bg-muted/40">
                      <td className="p-3"><Link className="font-medium text-primary hover:underline" to={`/admin/leads/${l.id}`}>{l.full_name}</Link></td>
                      <td className="p-3 whitespace-nowrap">{l.mobile}</td>
                      <td className="p-3">{l.course_interest ?? l.topic ?? "—"}</td>
                      <td className="p-3">{l.source === "contact" ? "Contact" : "Home"}</td>
                      <td className="p-3"><StatusBadge s={l.status} /></td>
                      <td className="p-3 whitespace-nowrap">{fmtDate(l.next_followup_at)}</td>
                      <td className="p-3 whitespace-nowrap">{fmtDate(l.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{d.meta.total} leads</p>
            <Pager page={d.meta.page} totalPages={d.meta.total_pages} onChange={(p) => set("page", String(p))} />
          </>
        )}
      </QueryView>
    </>
  );
}
