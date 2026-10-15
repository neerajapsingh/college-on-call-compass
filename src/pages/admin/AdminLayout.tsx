import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, BookOpen, Building2, CalendarClock, LayoutDashboard, LogOut, Settings, Users, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo, Spinner } from "@/components/common";
import { useAdminAuth } from "@/lib/admin";
import { AdminError } from "./ui";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/followups", label: "Follow-ups", icon: CalendarClock },
  { to: "/admin/universities", label: "Universities", icon: Building2 },
  { to: "/admin/colleges", label: "Colleges", icon: Building2 },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, loading, error, logout } = useAdminAuth();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) return <div className="min-h-screen grid place-items-center"><Spinner label="Checking session" /></div>;
  if (error) return <div className="min-h-screen grid place-items-center p-6"><div className="max-w-md w-full"><AdminError error={error} onRetry={() => location.reload()} /></div></div>;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} onClick={() => setOpen(false)}
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
          <Icon className="h-4 w-4" aria-hidden /> {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r bg-card p-4 gap-6">
        <Logo />
        {nav}
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card px-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}><Menu className="h-5 w-5" /></Button>
          <span className="font-semibold">CRM</span>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-muted-foreground">{user.name} · <span className="capitalize">{user.role}</span></span>
            <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4 mr-1" /> Logout</Button>
          </div>
        </header>
        {open && <div className="lg:hidden border-b bg-card p-3">{nav}</div>}
        <main className="p-4 md:p-6 max-w-7xl"><Outlet /></main>
      </div>
    </div>
  );
}
