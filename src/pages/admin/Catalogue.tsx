import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pager } from "@/components/common";
import { api, errorMessage } from "@/lib/api";
import { useAdminCourses, useAdminInstitutions, useAdminMutation } from "@/lib/admin";
import { PageTitle, QueryView } from "./ui";

/** Institutions list. type=university for /admin/universities, type=college for /admin/colleges. */
export function InstitutionsAdmin({ type }: { type: "university" | "college" }) {
  const [q, setQ] = useState(""); const [search, setSearch] = useState(""); const [page, setPage] = useState(1);
  const res = useAdminInstitutions({ type, q: search || undefined, page, per_page: 25 });
  const toggle = useAdminMutation((v: { id: number; field: string; value: boolean }) => api(`/api/admin/universities/${v.id}`, { method: "PATCH", body: { [v.field]: v.value } }));
  const flip = (id: number, field: string, value: boolean) => toggle.mutate({ id, field, value }, { onSuccess: () => toast.success("Saved"), onError: (e) => toast.error(errorMessage(e)) });

  return (
    <>
      <PageTitle title={type === "university" ? "Universities" : "Colleges"} />
      <p className="mb-3 text-sm text-muted-foreground">Mark partnership, approvals and visibility only after verification. Government institutions are excluded from Regular Admissions automatically.</p>
      <form className="mb-4 max-w-sm" onSubmit={(e) => { e.preventDefault(); setSearch(q.trim()); setPage(1); }}><Input aria-label="Search" placeholder="Search by name or city…" value={q} onChange={(e) => setQ(e.target.value)} /></form>
      <QueryView q={res} empty={(d) => d.items.length === 0}>
        {(d) => (
          <>
            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left"><tr>{["Name", "Category", "Location", "Ownership", "Modes", "Verified partner"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                <tbody className="divide-y">
                  {d.items.map((i) => (
                    <tr key={i.id}>
                      <td className="p-3 font-medium">{i.name}</td>
                      <td className="p-3 capitalize">{i.category.replace("_", "-")}</td>
                      <td className="p-3">{[i.city, i.state].filter(Boolean).join(", ") || "—"}</td>
                      <td className="p-3 capitalize">{i.ownership}</td>
                      <td className="p-3 capitalize">{i.modes.join(", ")}</td>
                      <td className="p-3"><input type="checkbox" aria-label={`Verified partner: ${i.name}`} checked={i.is_partner_verified} disabled={toggle.isPending} onChange={(e) => flip(i.id, "is_partner_verified", e.target.checked)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={d.meta.page} totalPages={d.meta.total_pages} onChange={setPage} />
          </>
        )}
      </QueryView>
    </>
  );
}

export function CoursesAdmin() {
  const [q, setQ] = useState(""); const [search, setSearch] = useState(""); const [page, setPage] = useState(1);
  const res = useAdminCourses({ q: search || undefined, page, per_page: 25 });
  return (
    <>
      <PageTitle title="Courses" />
      <p className="mb-3 text-sm text-muted-foreground">Fees are shown publicly only for verified, current online programmes. Regular/campus fees are never published.</p>
      <form className="mb-4 max-w-sm" onSubmit={(e) => { e.preventDefault(); setSearch(q.trim()); setPage(1); }}><Input aria-label="Search" placeholder="Search courses…" value={q} onChange={(e) => setQ(e.target.value)} /></form>
      <QueryView q={res} empty={(d) => d.items.length === 0}>
        {(d) => (
          <>
            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left"><tr>{["Course", "Institution", "Mode", "Level", "Fee status"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                <tbody className="divide-y">
                  {d.items.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-medium">{c.name}</td><td className="p-3">{c.institution_name}</td>
                      <td className="p-3 capitalize">{c.mode}</td><td className="p-3 uppercase">{c.level}</td>
                      <td className="p-3">{c.mode === "regular" ? "Never public" : c.fee?.verified ? `Verified until ${c.fee.valid_until ?? "—"}` : "Not verified"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={d.meta.page} totalPages={d.meta.total_pages} onChange={setPage} />
          </>
        )}
      </QueryView>
    </>
  );
}
