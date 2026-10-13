export type StudyMode = "online" | "regular";
export type InstitutionType = "university" | "college";
export type InstitutionCategory = "university" | "b_school" | "engineering" | "other";

export interface Institution {
  id: number;
  slug: string;
  name: string;
  type: InstitutionType;
  /** Directory category used for filters. */
  category: InstitutionCategory;
  ownership: "private" | "government" | "deemed" | "autonomous" | "other";
  is_government: boolean;
  city: string | null;
  state: string | null;
  modes: StudyMode[];
  /** Only approvals/recognitions that have been verified by the CRM team. */
  approvals: string[];
  is_partner_verified: boolean;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  eligibility_summary: string | null;
  admission_process: string | null;
  updated_at?: string;
}

export interface CourseFee {
  amount: number;
  currency: string;
  period: "total" | "year" | "semester";
  verified: boolean;
  /** ISO date until which the fee is confirmed current. */
  valid_until: string | null;
}

export interface Course {
  id: number;
  slug: string;
  name: string;
  category: string;
  level: "ug" | "pg" | "diploma" | "certificate" | "doctorate";
  mode: StudyMode;
  duration: string | null;
  eligibility: string | null;
  description: string | null;
  institution_id: number;
  institution_name: string;
  institution_slug: string;
  institution_type: InstitutionType;
  fee: CourseFee | null;
}

export type ArticleCategory = "online-degree-guides" | "university-comparisons" | "admission-updates" | "career-guides" | "entrance-exams";

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: ArticleCategory;
  /** Exam code for entrance-exam articles, e.g. "cat". */
  exam: string | null;
  /** Official source for exam information. Required for exam facts. */
  source_url: string | null;
  last_verified_at: string | null;
  author: string | null;
  published_at: string;
  updated_at: string | null;
}

export type LeadStatus = "new" | "contacted" | "counselling_done" | "converted" | "not_interested";

export interface Lead {
  id: number;
  full_name: string;
  mobile: string;
  email: string | null;
  source: "home_enquiry" | "contact";
  topic: string | null;
  qualification: string | null;
  study_mode: string | null;
  course_interest: string | null;
  message: string | null;
  status: LeadStatus;
  assigned_to_name: string | null;
  next_followup_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadNote { id: number; body: string; author_name: string | null; created_at: string }

export interface Followup {
  id: number;
  lead_id: number;
  lead_name: string;
  lead_mobile: string;
  due_at: string;
  note: string | null;
  status: "pending" | "done" | "cancelled";
  created_at: string;
}

export interface PageMeta { page: number; per_page: number; total: number; total_pages: number }
export interface Paged<T> { items: T[]; meta: PageMeta }

export interface AdminUser { id: number; name: string; email: string; role: "admin" | "counsellor" }

export interface LeadInteraction { id: number; type: "status_change" | "note" | "followup" | "call" | "system"; summary: string; actor_name: string | null; created_at: string }
export interface LeadDetail { lead: Lead; notes: LeadNote[]; interactions: LeadInteraction[]; followups: Followup[] }
