import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/common";
import { api, errorMessage } from "@/lib/api";
import { LEAD_STATUSES, useAdminMutation, useLead } from "@/lib/admin";
import type { LeadStatus } from "@/lib/types";
import { PageTitle, QueryView, StatusBadge, fmtDate } from "./ui";

export default function LeadDetailPage() {
  const { id } = useParams();
  const q = useLead(id);
  const [note, setNote] = useState("");
  const [due, setDue] = useState("");
  const [fNote, setFNote] = useState("");

  const onErr = (e: unknown) => toast.error(errorMessage(e));
  const status = useAdminMutation((s: LeadStatus) => api(`/api/admin/leads/${id}/status`, { method: "PATCH", body: { status: s } }));
  const addNote = useAdminMutation((body: string) => api(`/api/admin/leads/${id}/notes`, { method: "POST", body: { body } }));
  const addFollowup = useAdminMutation((v: { due_at: string; note: string }) => api("/api/admin/followups/", { method: "POST", body: { lead_id: Number(id), ...v } }));

  return (
    <>
      <Link to="/admin/leads" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All leads</Link>
      <QueryView q={q}>
        {({ lead, notes, interactions, followups }) => (
          <>
            <PageTitle title={lead.full_name}>
              <Button asChild variant="outline" size="sm"><a href={`tel:${lead.mobile}`}><Phone className="h-4 w-4 mr-1" />Call</a></Button>
              <Button asChild variant="outline" size="sm"><a href={`https://wa.me/91${lead.mobile.slice(-10)}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 mr-1" />WhatsApp</a></Button>
            </PageTitle>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <section className="rounded-lg border bg-card p-4">
                  <h2 className="mb-3 font-semibold">Enquiry</h2>
                  <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {([["Mobile", lead.mobile], ["Email", lead.email], ["Source", lead.source === "contact" ? "Contact page" : "Home enquiry"], ["Topic", lead.topic], ["Qualification", lead.qualification], ["Study mode", lead.study_mode], ["Course interest", lead.course_interest], ["Received", fmtDate(lead.created_at)]] as const).map(([k, v]) => (
                      <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v || "—"}</dd></div>
                    ))}
                  </dl>
                  {lead.message && <p className="mt-3 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{lead.message}</p>}
                </section>
                <section className="rounded-lg border bg-card p-4">
                  <h2 className="mb-3 font-semibold">Notes</h2>
                  <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); if (note.trim()) addNote.mutate(note.trim(), { onSuccess: () => { setNote(""); toast.success("Note saved"); }, onError: onErr }); }}>
                    <Textarea aria-label="New note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} placeholder="Add a note about this lead…" />
                    <Button size="sm" disabled={!note.trim() || addNote.isPending}>{addNote.isPending ? "Saving…" : "Add note"}</Button>
                  </form>
                  <ul className="mt-4 space-y-3">
                    {notes.length === 0 && <li className="text-sm text-muted-foreground">No notes yet.</li>}
                    {notes.map((n) => <li key={n.id} className="rounded-md border p-3 text-sm"><p className="whitespace-pre-wrap">{n.body}</p><p className="mt-1 text-xs text-muted-foreground">{n.author_name ?? "—"} · {fmtDate(n.created_at)}</p></li>)}
                  </ul>
                </section>
                <section className="rounded-lg border bg-card p-4">
                  <h2 className="mb-3 font-semibold">Interaction history</h2>
                  {interactions.length === 0 ? <p className="text-sm text-muted-foreground">No interactions recorded.</p> : (
                    <ol className="space-y-2 border-l pl-4">
                      {interactions.map((i) => <li key={i.id} className="text-sm"><span className="font-medium">{i.summary}</span><span className="block text-xs text-muted-foreground">{i.actor_name ?? "System"} · {fmtDate(i.created_at)}</span></li>)}
                    </ol>
                  )}
                </section>
              </div>
              <aside className="space-y-6">
                <section className="rounded-lg border bg-card p-4">
                  <h2 className="mb-2 font-semibold">Status</h2>
                  <StatusBadge s={lead.status} />
                  <NativeSelect className="mt-3" aria-label="Change status" value={lead.status} disabled={status.isPending}
                    onChange={(e) => status.mutate(e.target.value as LeadStatus, { onSuccess: () => toast.success("Status updated"), onError: onErr })}>
                    {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </NativeSelect>
                </section>
                <section className="rounded-lg border bg-card p-4">
                  <h2 className="mb-3 font-semibold">Schedule follow-up</h2>
                  <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); addFollowup.mutate({ due_at: new Date(due).toISOString(), note: fNote.trim() }, { onSuccess: () => { setDue(""); setFNote(""); toast.success("Follow-up scheduled"); }, onError: onErr }); }}>
                    <Input aria-label="Due date and time" type="datetime-local" required value={due} onChange={(e) => setDue(e.target.value)} />
                    <Input aria-label="Follow-up note" placeholder="Note (optional)" maxLength={500} value={fNote} onChange={(e) => setFNote(e.target.value)} />
                    <Button size="sm" disabled={!due || addFollowup.isPending}>{addFollowup.isPending ? "Saving…" : "Schedule"}</Button>
                  </form>
                  <ul className="mt-4 space-y-2 text-sm">
                    {followups.map((f) => <li key={f.id} className="flex justify-between gap-2"><span>{fmtDate(f.due_at)}{f.note ? ` — ${f.note}` : ""}</span><span className="capitalize text-muted-foreground">{f.status}</span></li>)}
                  </ul>
                </section>
              </aside>
            </div>
          </>
        )}
      </QueryView>
    </>
  );
}
