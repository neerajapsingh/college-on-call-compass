import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, apiPage, setCsrfToken, ApiError } from "./api";
import type { AdminUser, Course, Followup, Institution, Lead, LeadDetail, LeadStatus } from "./types";

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "counselling_done", label: "Counselling Done" },
  { value: "converted", label: "Converted" },
  { value: "not_interested", label: "Not Interested" },
];
export const statusLabel = (s: LeadStatus) => LEAD_STATUSES.find((x) => x.value === s)?.label ?? s;

interface Session { user: AdminUser; csrf_token: string }
interface AuthCtx {
  user: AdminUser | null;
  loading: boolean;
  error: unknown;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
const Ctx = createContext<AuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    api<Session>("/api/auth/me")
      .then((s) => { setCsrfToken(s.csrf_token); setUser(s.user); })
      .catch((e) => { if (!(e instanceof ApiError && e.status === 401)) setError(e); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const s = await api<Session>("/api/auth/login", { method: "POST", body: { email, password } });
    setCsrfToken(s.csrf_token);
    setUser(s.user);
    setError(null);
  };
  const logout = async () => {
    try { await api("/api/auth/logout", { method: "POST" }); } finally { setCsrfToken(null); setUser(null); }
  };
  return <Ctx.Provider value={{ user, loading, error, login, logout }}>{children}</Ctx.Provider>;
}
export const useAdminAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdminAuth outside provider");
  return c;
};

type Params = Record<string, string | number | undefined>;

export interface DashboardStats {
  total_leads: number;
  by_status: Record<LeadStatus, number>;
  leads_today: number;
  followups_due_today: number;
  followups_overdue: number;
  recent_leads: Lead[];
}
export interface ReportData {
  by_source: { label: string; count: number }[];
  by_course: { label: string; count: number }[];
  by_mode: { label: string; count: number }[];
  funnel: { status: LeadStatus; count: number }[];
  daily: { date: string; count: number }[];
}
export interface SiteSettings { whatsapp_number: string; contact_phone: string; contact_email: string; enquiry_duplicate_window_hours: number }

export const useDashboard = () => useQuery({ queryKey: ["admin", "dashboard"], queryFn: () => api<DashboardStats>("/api/admin/reports/dashboard") });
export const useReports = (p: Params) => useQuery({ queryKey: ["admin", "reports", p], queryFn: () => api<ReportData>("/api/admin/reports/", { query: p }) });
export const useLeads = (p: Params) => useQuery({ queryKey: ["admin", "leads", p], queryFn: () => apiPage<Lead>("/api/admin/leads/", { query: p }) });
export const useLead = (id: string | undefined) => useQuery({ queryKey: ["admin", "lead", id], queryFn: () => api<LeadDetail>(`/api/admin/leads/${id}`), enabled: !!id });
export const useFollowups = (p: Params) => useQuery({ queryKey: ["admin", "followups", p], queryFn: () => apiPage<Followup>("/api/admin/followups/", { query: p }) });
export const useAdminInstitutions = (p: Params) => useQuery({ queryKey: ["admin", "institutions", p], queryFn: () => apiPage<Institution>("/api/admin/universities/", { query: p }) });
export const useAdminCourses = (p: Params) => useQuery({ queryKey: ["admin", "courses", p], queryFn: () => apiPage<Course>("/api/admin/courses/", { query: p }) });
export const useSettings = () => useQuery({ queryKey: ["admin", "settings"], queryFn: () => api<SiteSettings>("/api/admin/settings/") });

/** Mutation helper: invalidates all admin queries after the server confirms. */
export function useAdminMutation<V>(fn: (v: V) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }) });
}
