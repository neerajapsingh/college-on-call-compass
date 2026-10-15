import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/common";
import { api, errorMessage } from "@/lib/api";
import { statusLabel, useAdminMutation, useReports, useSettings, type SiteSettings } from "@/lib/admin";
import { PageTitle, QueryView } from "./ui";

function Bars({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">No data for this period.</p> : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex justify-between"><span>{r.label}</span><span className="font-medium">{r.count}</span></div>
              <div className="mt-1 h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${(r.count / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Reports() {
  const today = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const [from, setFrom] = useState(monthAgo); const [to, setTo] = useState(today);
  const q = useReports({ from, to });
  return (
    <>
      <PageTitle title="Reports">
        <Input aria-label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
        <Input aria-label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
      </PageTitle>
      <QueryView q={q}>
        {(d) => (
          <div className="grid gap-4 md:grid-cols-2">
            <Bars title="Conversion funnel" rows={d.funnel.map((f) => ({ label: statusLabel(f.status), count: f.count }))} />
            <Bars title="By source" rows={d.by_source} />
            <Bars title="By course interest" rows={d.by_course} />
            <Bars title="By study mode" rows={d.by_mode} />
          </div>
        )}
      </QueryView>
    </>
  );
}

export function Settings() {
  const q = useSettings();
  const [f, setF] = useState<SiteSettings | null>(null);
  useEffect(() => { if (q.data) setF(q.data); }, [q.data]);
  const save = useAdminMutation((v: SiteSettings) => api("/api/admin/settings/", { method: "PUT", body: v }));
  return (
    <>
      <PageTitle title="Settings" />
      <QueryView q={q}>
        {() => f && (
          <form className="max-w-md space-y-4 rounded-lg border bg-card p-4" onSubmit={(e) => { e.preventDefault(); save.mutate(f, { onSuccess: () => toast.success("Settings saved"), onError: (x) => toast.error(errorMessage(x)) }); }}>
            <Field label="WhatsApp number" htmlFor="wa"><Input id="wa" value={f.whatsapp_number} onChange={(e) => setF({ ...f, whatsapp_number: e.target.value })} /></Field>
            <Field label="Contact phone" htmlFor="ph"><Input id="ph" value={f.contact_phone} onChange={(e) => setF({ ...f, contact_phone: e.target.value })} /></Field>
            <Field label="Contact email" htmlFor="em"><Input id="em" type="email" value={f.contact_email} onChange={(e) => setF({ ...f, contact_email: e.target.value })} /></Field>
            <Field label="Duplicate enquiry window (hours)" htmlFor="dw"><Input id="dw" type="number" min={1} max={720} value={f.enquiry_duplicate_window_hours} onChange={(e) => setF({ ...f, enquiry_duplicate_window_hours: Number(e.target.value) })} /></Field>
            <Button disabled={save.isPending}>{save.isPending ? "Saving…" : "Save settings"}</Button>
          </form>
        )}
      </QueryView>
    </>
  );
}
