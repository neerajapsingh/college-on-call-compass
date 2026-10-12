export const SITE = {
  name: "College On Call",
  tagline: "Connect. Choose. Succeed.",
  phoneDisplay: "+91 7471166366",
  phoneHref: "tel:+917471166366",
  email: "info@collegeoncall.com",
  whatsappNumber: "917471166366",
  url: ((import.meta.env.VITE_SITE_URL as string | undefined) || "https://collegeoncall.com").replace(/\/$/, ""),
};

/** Builds a wa.me link with a safely encoded, length-limited prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  if (!message) return base;
  // Strip control characters and cap length so user input can't produce an oversized/odd URL.
  const clean = message.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, 500);
  return `${base}?text=${encodeURIComponent(clean)}`;
}
