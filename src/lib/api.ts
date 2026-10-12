import type { Paged, PageMeta } from "./types";

const BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "").replace(/\/$/, "");
export const apiConfigured = BASE.length > 0;

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;
  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

let csrfToken: string | null = null;
export const setCsrfToken = (t: string | null) => { csrfToken = t; };

type Query = Record<string, string | number | boolean | undefined | null>;
interface Opts { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown; query?: Query }

interface Envelope<T> { success: boolean; data: T; meta?: PageMeta; message?: string; errors?: Record<string, string> }

async function request<T>(path: string, { method = "GET", body, query }: Opts = {}): Promise<Envelope<T>> {
  if (!apiConfigured) {
    throw new ApiError("This website is not yet connected to the College On Call server (VITE_API_BASE_URL is not set).", 0);
  }
  const url = new URL(BASE + path, window.location.origin);
  Object.entries(query ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET" && csrfToken) headers["X-CSRF-Token"] = csrfToken;

  let res: Response;
  try {
    res = await fetch(url.toString(), { method, headers, credentials: "include", body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Could not reach the server. Please check your internet connection and try again.", 0);
  }
  let data: Envelope<T> | null = null;
  try { data = await res.json(); } catch { /* non-JSON response */ }

  if (!res.ok || !data || data.success !== true) {
    const fallback =
      res.status === 429 ? "Too many attempts. Please wait a minute and try again." :
      res.status === 401 ? "Your session has expired. Please sign in again." :
      res.status === 403 ? "You don't have permission to do this." :
      res.status >= 500 ? "The server ran into a problem. Please try again shortly." :
      `Request failed (${res.status}).`;
    throw new ApiError(data?.message || fallback, res.status, data?.errors);
  }
  return data;
}

export async function api<T>(path: string, opts?: Opts): Promise<T> {
  return (await request<T>(path, opts)).data;
}

export async function apiPage<T>(path: string, opts?: Opts): Promise<Paged<T>> {
  const env = await request<T[]>(path, opts);
  const items = Array.isArray(env.data) ? env.data : [];
  return { items, meta: env.meta ?? { page: 1, per_page: items.length, total: items.length, total_pages: 1 } };
}

export const apiUrl = (path: string, query?: Query) => {
  const url = new URL(BASE + path, window.location.origin);
  Object.entries(query ?? {}).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v)); });
  return url.toString();
};

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");
