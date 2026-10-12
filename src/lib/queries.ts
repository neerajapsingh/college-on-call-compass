import { useQuery } from "@tanstack/react-query";
import { api, apiPage, ApiError } from "./api";
import type { Article, Course, Institution } from "./types";

type Params = Record<string, string | number | undefined>;

export const useInstitutions = (params: Params, enabled = true) =>
  useQuery({ queryKey: ["institutions", params], queryFn: () => apiPage<Institution>("/api/universities/", { query: params }), enabled });

export const useInstitution = (slug: string | undefined) =>
  useQuery({ queryKey: ["institution", slug], queryFn: () => api<Institution>(`/api/universities/${encodeURIComponent(slug!)}`), enabled: !!slug });

export const useCourses = (params: Params, enabled = true) =>
  useQuery({ queryKey: ["courses", params], queryFn: () => apiPage<Course>("/api/courses/", { query: params }), enabled });

export const useCourse = (slug: string | undefined) =>
  useQuery({ queryKey: ["course", slug], queryFn: () => api<Course>(`/api/courses/${encodeURIComponent(slug!)}`), enabled: !!slug });

export const useArticles = (params: Params) =>
  useQuery({ queryKey: ["articles", params], queryFn: () => apiPage<Article>("/api/blog/", { query: params }) });

export const useArticle = (slug: string | undefined) =>
  useQuery({ queryKey: ["article", slug], queryFn: () => api<Article>(`/api/blog/${encodeURIComponent(slug!)}`), enabled: !!slug });

export interface EnquiryPayload {
  source: "home_enquiry" | "contact";
  full_name: string;
  mobile: string;
  email?: string;
  topic?: string;
  qualification?: string;
  study_mode?: string;
  course_interest?: string;
  message?: string;
  consent: boolean;
  consent_text: string;
  page_url: string;
  website?: string; // honeypot
}

/** Resolves only when the API confirms the enquiry was stored (returns its id). */
export async function submitEnquiry(payload: EnquiryPayload): Promise<{ id: number; duplicate?: boolean }> {
  const res = await api<{ id: number; duplicate?: boolean }>("/api/enquiries/", { method: "POST", body: payload });
  if (!res || typeof res.id !== "number") {
    throw new ApiError("The server did not confirm that your enquiry was saved. Please try again.", 0);
  }
  return res;
}
