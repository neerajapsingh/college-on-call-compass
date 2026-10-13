import { useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, NativeSelect } from "@/components/common";
import { submitEnquiry, type EnquiryPayload } from "@/lib/queries";
import { errorMessage } from "@/lib/api";
import { isValidIndianMobile, normalizeMobile } from "@/lib/rules";
import { whatsappLink } from "@/lib/site";

const CONSENT_TEXT = "I agree to be contacted by College On Call by phone, SMS, email or WhatsApp about my enquiry, and I have read the Privacy Policy.";

const name = z.string().trim().min(2, "Please enter your full name").max(100, "Name is too long");
const mobile = z.string().trim().refine(isValidIndianMobile, "Enter a valid 10-digit Indian mobile number");

export const TOPICS = ["Online Degrees", "Regular Admissions", "Entrance Exams", "Admission Counselling", "Other Query"] as const;
export const QUALIFICATIONS = ["10th", "12th", "Diploma", "Graduate", "Postgraduate", "Other"] as const;

function SuccessPanel({ waMessage }: { waMessage: string }) {
  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
      <h3 className="mt-3 text-xl font-bold">Thank You!</h3>
      <p className="mt-1 text-muted-foreground">Your enquiry has been submitted successfully. Our team will contact you soon.</p>
      <Button asChild variant="outline" className="mt-5 gap-2">
        <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" aria-hidden />Continue on WhatsApp</a>
      </Button>
    </div>
  );
}

function SubmitError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm sm:flex-row sm:items-center">
      <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
      <p className="flex-1"><strong>Your enquiry was not saved.</strong> {errorMessage(error)}</p>
      <Button type="button" size="sm" variant="outline" className="gap-2" onClick={onRetry}><RefreshCw className="h-4 w-4" />Retry</Button>
    </div>
  );
}

const Honeypot = ({ reg }: { reg: object }) => (
  <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden"><label>Website<input tabIndex={-1} autoComplete="off" {...reg} /></label></div>
);

/* ---------------- Homepage enquiry ---------------- */
const enquirySchema = z.object({
  full_name: name,
  mobile,
  qualification: z.string().min(1, "Select your highest qualification"),
  study_mode: z.string().min(1, "Select your preferred study mode"),
  course_interest: z.string().trim().min(2, "Tell us which course interests you").max(120),
  consent: z.boolean().refine((v) => v, "Please accept to continue"),
  website: z.string().optional(),
});
type EnquiryValues = z.infer<typeof enquirySchema>;

export function EnquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { full_name: "", mobile: "", qualification: "", study_mode: "", course_interest: "", consent: false, website: "" },
  });
  const m = useMutation({ mutationFn: (p: EnquiryPayload) => submitEnquiry(p) });

  const onSubmit = (v: EnquiryValues) =>
    m.mutate({ source: "home_enquiry", full_name: v.full_name, mobile: normalizeMobile(v.mobile), qualification: v.qualification, study_mode: v.study_mode, course_interest: v.course_interest, consent: true, consent_text: CONSENT_TEXT, page_url: window.location.href, website: v.website });

  if (m.isSuccess) {
    const v = getValues();
    return <SuccessPanel waMessage={`Hi College On Call, I'm ${v.full_name}. I just submitted an enquiry about ${v.course_interest} (${v.study_mode}).`} />;
  }
  const aria = (k: keyof EnquiryValues) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `enq-${k}-error` : undefined });

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
      <Honeypot reg={register("website")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="enq-full_name" required error={errors.full_name?.message}><Input id="enq-full_name" autoComplete="name" {...register("full_name")} {...aria("full_name")} /></Field>
        <Field label="Mobile Number" htmlFor="enq-mobile" required error={errors.mobile?.message}><Input id="enq-mobile" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" {...register("mobile")} {...aria("mobile")} /></Field>
        <Field label="Highest Qualification" htmlFor="enq-qualification" required error={errors.qualification?.message}>
          <NativeSelect id="enq-qualification" {...register("qualification")} {...aria("qualification")}><option value="">Select</option>{QUALIFICATIONS.map((q) => <option key={q}>{q}</option>)}</NativeSelect>
        </Field>
        <Field label="Preferred Study Mode" htmlFor="enq-study_mode" required error={errors.study_mode?.message}>
          <NativeSelect id="enq-study_mode" {...register("study_mode")} {...aria("study_mode")}><option value="">Select</option><option value="online">Online</option><option value="regular">Regular (campus)</option><option value="undecided">Not sure yet</option></NativeSelect>
        </Field>
      </div>
      <Field label="Interested Course" htmlFor="enq-course_interest" required error={errors.course_interest?.message}><Input id="enq-course_interest" placeholder="e.g. MBA, B.Tech, BCA" {...register("course_interest")} {...aria("course_interest")} /></Field>
      <div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-primary" {...register("consent")} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "enq-consent-error" : undefined} />
          <span>I agree to be contacted by College On Call by phone, SMS, email or WhatsApp about my enquiry, and I have read the <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link>.</span>
        </label>
        {errors.consent && <p id="enq-consent-error" role="alert" className="mt-1 text-xs font-medium text-destructive">{errors.consent.message}</p>}
      </div>
      {m.isError && <SubmitError error={m.error} onRetry={() => formRef.current?.requestSubmit()} />}
      <Button type="submit" size="lg" className="w-full" disabled={m.isPending}>{m.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</> : "Submit Enquiry"}</Button>
    </form>
  );
}

/* ---------------- Contact form ---------------- */
const contactSchema = z.object({
  full_name: name,
  mobile,
  email: z.string().trim().max(255).refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address"),
  topic: z.string().refine((v) => (TOPICS as readonly string[]).includes(v), "Select a topic"),
  message: z.string().trim().min(5, "Please write a short message").max(1000, "Message must be under 1000 characters"),
  website: z.string().optional(),
});
type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { full_name: "", mobile: "", email: "", topic: "Admission Counselling", message: "", website: "" },
  });
  const m = useMutation({ mutationFn: (p: EnquiryPayload) => submitEnquiry(p) });
  const onSubmit = (v: ContactValues) =>
    m.mutate({ source: "contact", full_name: v.full_name, mobile: normalizeMobile(v.mobile), email: v.email || undefined, topic: v.topic, message: v.message, consent: true, consent_text: "Submitted via contact form; user requested a response.", page_url: window.location.href, website: v.website });

  if (m.isSuccess) {
    const v = getValues();
    return <SuccessPanel waMessage={`Hi College On Call, I'm ${v.full_name}. I just sent a message about: ${v.topic}.`} />;
  }
  const aria = (k: keyof ContactValues) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `ct-${k}-error` : undefined });

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
      <Honeypot reg={register("website")} />
      <Field label="Full Name" htmlFor="ct-full_name" required error={errors.full_name?.message}><Input id="ct-full_name" autoComplete="name" {...register("full_name")} {...aria("full_name")} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile Number" htmlFor="ct-mobile" required error={errors.mobile?.message}><Input id="ct-mobile" type="tel" inputMode="numeric" autoComplete="tel" {...register("mobile")} {...aria("mobile")} /></Field>
        <Field label="Email" htmlFor="ct-email" error={errors.email?.message}><Input id="ct-email" type="email" autoComplete="email" {...register("email")} {...aria("email")} /></Field>
      </div>
      <Field label="Topic" htmlFor="ct-topic" required error={errors.topic?.message}>
        <NativeSelect id="ct-topic" {...register("topic")} {...aria("topic")}><option value="">Select a topic</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</NativeSelect>
      </Field>
      <Field label="Message" htmlFor="ct-message" required error={errors.message?.message}><Textarea id="ct-message" rows={5} {...register("message")} {...aria("message")} /></Field>
      <p className="text-xs text-muted-foreground">By submitting, you agree that we may contact you about this query. See our <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link>.</p>
      {m.isError && <SubmitError error={m.error} onRetry={() => formRef.current?.requestSubmit()} />}
      <Button type="submit" size="lg" className="w-full" disabled={m.isPending}>{m.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : "Send Message"}</Button>
    </form>
  );
}
