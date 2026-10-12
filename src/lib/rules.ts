import type { Course, Institution } from "./types";

/**
 * Fees may only be shown for ONLINE courses whose fee is verified and still current.
 * Fees are never shown for regular/campus courses.
 */
export function canShowFee(course: Pick<Course, "mode" | "fee">, today: Date = new Date()): boolean {
  if (course.mode !== "online") return false;
  const fee = course.fee;
  if (!fee || fee.verified !== true || !(fee.amount > 0) || !fee.valid_until) return false;
  const until = new Date(fee.valid_until + (fee.valid_until.length === 10 ? "T23:59:59" : ""));
  return !Number.isNaN(until.getTime()) && until >= today;
}

export function formatFee(course: Course): string | null {
  if (!canShowFee(course) || !course.fee) return null;
  const amt = new Intl.NumberFormat("en-IN", { style: "currency", currency: course.fee.currency || "INR", maximumFractionDigits: 0 }).format(course.fee.amount);
  const per = course.fee.period === "total" ? "total" : `per ${course.fee.period}`;
  return `${amt} ${per}`;
}

/** Regular-admissions listings: never government institutions, and only those offering regular mode. */
export function regularAdmissionsListing<T extends Pick<Institution, "is_government" | "ownership" | "modes">>(list: T[]): T[] {
  return list.filter((i) => !i.is_government && i.ownership !== "government" && i.modes.includes("regular"));
}

/** Normalises Indian mobile input like "+91 98765-43210" to "9876543210". */
export function normalizeMobile(v: string): string {
  const digits = v.replace(/[^\d]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export const isValidIndianMobile = (v: string) => /^[6-9]\d{9}$/.test(normalizeMobile(v));
