import { Link } from "react-router-dom";
import { BadgeCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Course, Institution } from "@/lib/types";
import { formatFee } from "@/lib/rules";
import { cn } from "@/lib/utils";

export const institutionPath = (i: Pick<Institution, "type" | "slug">) => `/${i.type === "college" ? "colleges" : "universities"}/${i.slug}`;
export const MODE_LABEL = { online: "Online", regular: "Regular" } as const;
export const LEVEL_LABEL: Record<Course["level"], string> = { ug: "Undergraduate", pg: "Postgraduate", diploma: "Diploma", certificate: "Certificate", doctorate: "Doctorate" };

export function InstitutionCard({ inst, compare, showPartnerStatus }: { inst: Institution; showPartnerStatus?: boolean; compare?: { checked: boolean; disabled: boolean; onToggle: () => void } }) {
  return (
    <article className="flex flex-col rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        {inst.logo_url ? (
          <img src={inst.logo_url} alt={`${inst.name} logo`} loading="lazy" width={48} height={48} className="h-12 w-12 rounded-md border object-contain" />
        ) : (
          <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-accent font-bold text-accent-foreground">{inst.name.charAt(0)}</span>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug"><Link to={institutionPath(inst)} className="hover:text-primary">{inst.name}</Link></h3>
          {(inst.city || inst.state) && <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" aria-hidden />{[inst.city, inst.state].filter(Boolean).join(", ")}</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="capitalize">{inst.type}</Badge>
        {inst.modes.map((m) => <Badge key={m} variant="outline">{MODE_LABEL[m]}</Badge>)}
        {inst.is_partner_verified && <Badge className="gap-1 bg-success text-success-foreground hover:bg-success"><BadgeCheck className="h-3 w-3" aria-hidden />Verified partner</Badge>}
        {!inst.is_partner_verified && showPartnerStatus && <Badge variant="outline" className="text-muted-foreground">Non-partner</Badge>}
      </div>
      {inst.approvals.length > 0 && <p className="mt-3 text-xs text-muted-foreground">Approvals: {inst.approvals.join(", ")}</p>}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <Link to={institutionPath(inst)} className="text-sm font-medium text-primary hover:underline">View details</Link>
        {compare && (
          <label className={cn("flex items-center gap-1.5 text-xs", compare.disabled && !compare.checked && "opacity-50")}>
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={compare.checked} disabled={compare.disabled && !compare.checked} onChange={compare.onToggle} />Compare
          </label>
        )}
      </div>
    </article>
  );
}

export function CourseCard({ course, showInstitution = true }: { course: Course; showInstitution?: boolean }) {
  const fee = formatFee(course);
  return (
    <article className="flex flex-col rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline">{MODE_LABEL[course.mode]}</Badge>
        <Badge variant="secondary">{LEVEL_LABEL[course.level]}</Badge>
      </div>
      <h3 className="mt-3 font-semibold"><Link to={`/courses/${course.slug}`} className="hover:text-primary">{course.name}</Link></h3>
      {showInstitution && <p className="mt-1 text-sm text-muted-foreground">{course.institution_name}</p>}
      <dl className="mt-3 space-y-1 text-sm">
        {course.duration && <div className="flex gap-2"><dt className="text-muted-foreground">Duration:</dt><dd>{course.duration}</dd></div>}
        {fee && <div className="flex gap-2"><dt className="text-muted-foreground">Fee (verified):</dt><dd className="font-medium">{fee}</dd></div>}
      </dl>
      <div className="mt-auto flex gap-3 pt-4 text-sm font-medium">
        <Link to={`/courses/${course.slug}`} className="text-primary hover:underline">Details</Link>
        <Link to="/#enquiry" className="text-primary hover:underline">Enquire</Link>
      </div>
    </article>
  );
}
