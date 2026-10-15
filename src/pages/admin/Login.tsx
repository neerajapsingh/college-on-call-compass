import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Logo } from "@/components/common";
import { useAdminAuth } from "@/lib/admin";
import { apiConfigured, errorMessage } from "@/lib/api";
import { useAdminTitle } from "./ui";

export default function AdminLogin() {
  useAdminTitle("Sign in");
  const { user, login } = useAdminAuth();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try { await login(email.trim(), password); nav(from, { replace: true }); }
    catch (x) { setErr(errorMessage(x)); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-sm" noValidate>
        <Logo />
        <h1 className="text-xl font-bold">Admin sign in</h1>
        {!apiConfigured && <p role="status" className="rounded-md bg-muted p-3 text-sm text-muted-foreground">The CRM server is not connected yet (VITE_API_BASE_URL is not set), so sign-in is unavailable.</p>}
        <Field label="Email" htmlFor="email" required><Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password" htmlFor="password" required><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        <Button type="submit" className="w-full" disabled={busy || !apiConfigured || !email || !password}>{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
    </div>
  );
}
