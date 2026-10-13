import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState, ErrorState, LoadingGrid, NativeSelect, Pager } from "@/components/common";
import { InstitutionCard, MODE_LABEL } from "@/components/cards";
import { useInstitutions } from "@/lib/queries";
import { regularAdmissionsListing } from "@/lib/rules";
import type { Institution, InstitutionCategory } from "@/lib/types";

export const CATEGORY_LABEL: Record<InstitutionCategory, string> = {
  university: "University",
  b_school: "Private B-School",
  engineering: "Private Engineering College",
  other: "Other Institution",
};

interface Props {
  /** "online" = online-only directory, "regular" = private B-schools/engineering, no government. */
  variant?: "all" | "online" | "regular";
}

const MAX_COMPARE = 3;

export function Directory({ variant = "all" }: Props) {
  const [sp, setSp] = useSearchParams();
  const [compare, setCompare] = useState<Institution[]>([]);
  const [open, setOpen] = useState(false);
  const page = Number(sp.get("page") || 1);

  const categories: InstitutionCategory[] = variant === "regular" ? ["b_school", "engineering"] : ["university", "b_school", "engineering", "other"];
  const f = {
    q: sp.get("q") ?? "",
    category: sp.get("category") ?? "",
    course: sp.get("course") ?? "",
    mode: variant === "online" ? "online" : variant === "regular" ? "regular" : sp.get("mode") ?? "",
    location: sp.get("location") ?? "",
    partner: sp.get("partner") ?? "",
  };

  const query = useInstitutions({
    ...f,
    category: f.category || (variant === "regular" ? "b_school,engineering" : ""),
    exclude_government: variant === "regular" ? 1 : undefined,
    page,
    per_page: 12,
  });

  const items = useMemo(() => {
    const list = query.data?.items ?? [];
    // Defence in depth: enforce listing rules client-side even if the API mis-filters.
    if (variant === "regular") return regularAdmissionsListing(list).filter((i) => i.category === "b_school" || i.category === "engineering");
    if (variant === "online") return list.filter((i) => i.modes.includes("online"));
    return list;
  }, [query.data, variant]);

  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v); else n.delete(k);
    n.delete("page");
    setSp(n, { replace: true });
  };
  const toggle = (i: Institution) =>
    setCompare((c) => (c.some((x) => x.id === i.id) ? c.filter((x) => x.id !== i.id) : c.length < MAX_COMPARE ? [...c, i] : c));

  return (
    <div>
      <form role="search" aria-label="Filter institutions" onSubmit={(e) => e.preventDefault()} className="grid gap-3 rounded-xl border bg-secondary/60 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label htmlFor="dir-q" className="sr-only">Search by name</label>
          <Input id="dir-q" placeholder="Search institution name" defaultValue={f.q} onChange={(e) => set("q", e.target.value.trim())} />
        </div>
        <div>
          <label htmlFor="dir-cat" className="sr-only">Category</label>
          <NativeSelect id="dir-cat" value={f.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
          </NativeSelect>
        </div>
        <div>
          <label htmlFor="dir-course" className="sr-only">Course</label>
          <Input id="dir-course" placeholder="Course (e.g. MBA)" defaultValue={f.course} onChange={(e) => set("course", e.target.value.trim())} />
        </div>
        {variant === "all" ? (
          <div>
            <label htmlFor="dir-mode" className="sr-only">Mode</label>
            <NativeSelect id="dir-mode" value={f.mode} onChange={(e) => set("mode", e.target.value)}>
              <option value="">Online & Regular</option><option value="online">Online</option><option value="regular">Regular</option>
            </NativeSelect>
          </div>
        ) : (
          <div>
            <label htmlFor="dir-partner" className="sr-only">Partnership</label>
            <NativeSelect id="dir-partner" value={f.partner} onChange={(e) => set("partner", e.target.value)}>
              <option value="">Partners & non-partners</option><option value="1">Verified partners</option><option value="0">Non-partners</option>
            </NativeSelect>
          </div>
        )}
        <div>
          <label htmlFor="dir-loc" className="sr-only">Location</label>
          <Input id="dir-loc" placeholder="City or state" defaultValue={f.location} onChange={(e) => set("location", e.target.value.trim())} />
        </div>
        {variant === "all" && (
          <div>
            <label htmlFor="dir-partner2" className="sr-only">Partnership</label>
            <NativeSelect id="dir-partner2" value={f.partner} onChange={(e) => set("partner", e.target.value)}>
              <option value="">Partners & non-partners</option><option value="1">Verified partners</option><option value="0">Non-partners</option>
            </NativeSelect>
          </div>
        )}
      </form>

      <div className="mt-6" aria-live="polite">
        {query.isLoading ? <LoadingGrid /> :
          query.isError ? <ErrorState error={query.error} onRetry={() => query.refetch()} /> :
          items.length === 0 ? <EmptyState title="No institutions found" text="Try changing the filters, or ask our counsellors for help finding the right option." /> : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">{query.data?.meta.total ?? items.length} result(s)</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((i) => (
                  <InstitutionCard key={i.id} inst={i} showPartnerStatus={variant !== "all"}
                    compare={{ checked: compare.some((c) => c.id === i.id), disabled: compare.length >= MAX_COMPARE, onToggle: () => toggle(i) }} />
                ))}
              </div>
              <Pager page={page} totalPages={query.data?.meta.total_pages ?? 1} onChange={(p) => { const n = new URLSearchParams(sp); n.set("page", String(p)); setSp(n); }} />
            </>
          )}
      </div>

      {compare.length > 0 && (
        <div className="sticky bottom-4 z-30 mx-auto mt-6 flex max-w-3xl flex-wrap items-center gap-2 rounded-xl border bg-card p-3 shadow-card-hover">
          <span className="text-sm font-medium">Compare ({compare.length}/{MAX_COMPARE}):</span>
          {compare.map((c) => (
            <button key={c.id} type="button" onClick={() => toggle(c)} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs" aria-label={`Remove ${c.name} from comparison`}>{c.name}<X className="h-3 w-3" /></button>
          ))}
          <Button size="sm" className="ml-auto" disabled={compare.length < 2} onClick={() => setOpen(true)}>Compare now</Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Compare institutions</DialogTitle></DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr><th className="p-2" scope="col">Detail</th>{compare.map((c) => <th key={c.id} scope="col" className="p-2">{c.name}</th>)}</tr></thead>
              <tbody className="divide-y">
                {([
                  ["Category", (c: Institution) => CATEGORY_LABEL[c.category] ?? c.category],
                  ["Location", (c: Institution) => [c.city, c.state].filter(Boolean).join(", ") || "—"],
                  ["Modes", (c: Institution) => c.modes.map((m) => MODE_LABEL[m]).join(", ")],
                  ["Verified approvals", (c: Institution) => c.approvals.join(", ") || "Not yet verified"],
                  ["Partnership", (c: Institution) => (c.is_partner_verified ? "Verified partner" : "Non-partner")],
                  ["Eligibility", (c: Institution) => c.eligibility_summary || "Ask a counsellor"],
                ] as const).map(([label, fn]) => (
                  <tr key={label}><th scope="row" className="p-2 font-medium text-muted-foreground">{label}</th>{compare.map((c) => <td key={c.id} className="p-2">{fn(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">Fees for regular/campus programmes are not displayed. Please confirm all details with the institution.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
