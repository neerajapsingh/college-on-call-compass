import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common";
import { SITE, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/online-degrees", label: "Online Degrees" },
  { to: "/regular-admissions", label: "Regular Admissions" },
  { to: "/universities", label: "Universities" },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About Us" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="hidden bg-navy text-xs text-navy-muted md:block">
        <div className="container-site flex h-8 items-center justify-end gap-5">
          <a href={SITE.phoneHref} className="flex items-center gap-1.5 hover:text-navy-foreground"><Phone className="h-3 w-3" aria-hidden />{SITE.phoneDisplay}</a>
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:text-navy-foreground"><Mail className="h-3 w-3" aria-hidden />{SITE.email}</a>
        </div>
      </div>
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.to === "/"} className={({ isActive }) => cn("rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary", isActive ? "text-primary" : "text-foreground/80")}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex"><Link to="/#enquiry">Get Free Counselling</Link></Button>
          <button type="button" className="rounded-md p-2 xl:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t bg-background xl:hidden">
          <ul className="container-site grid gap-1 py-3">
            {NAV.map((n) => (
              <li key={n.to}><NavLink to={n.to} end={n.to === "/"} className={({ isActive }) => cn("block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary", isActive && "bg-secondary text-primary")}>{n.label}</NavLink></li>
            ))}
            <li className="pt-2"><Button asChild className="w-full"><Link to="/#enquiry">Get Free Counselling</Link></Button></li>
            <li><a href={SITE.phoneHref} className="flex items-center gap-2 px-3 py-2 text-sm"><Phone className="h-4 w-4" aria-hidden />{SITE.phoneDisplay}</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const cols = [
    { title: "Explore", links: [...NAV.slice(1, 5), { to: "/entrance-exams", label: "Entrance Exams" }] },
    { title: "Company", links: [{ to: "/about", label: "About" }, { to: "/blog", label: "Blog" }, { to: "/contact", label: "Contact" }] },
    { title: "Legal", links: [{ to: "/privacy-policy", label: "Privacy Policy" }, { to: "/terms-and-conditions", label: "Terms & Conditions" }, { to: "/disclaimer", label: "Disclaimer" }] },
  ];
  return (
    <footer className="bg-navy text-navy-muted">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm">Admission guidance for online degrees and regular campus programmes across India.</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li><a href={SITE.phoneHref} className="flex items-center gap-2 hover:text-navy-foreground"><Phone className="h-4 w-4" aria-hidden />{SITE.phoneDisplay}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-navy-foreground"><Mail className="h-4 w-4" aria-hidden />{SITE.email}</a></li>
          </ul>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground">{c.title}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {c.links.map((l) => <li key={l.to}><Link to={l.to} className="hover:text-navy-foreground">{l.label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-navy-light">
        <div className="container-site flex flex-col gap-2 py-5 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Information is provided for guidance; always confirm details with the institution.</p>
        </div>
      </div>
    </footer>
  );
}

export default function SiteLayout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <a href={whatsappLink("Hi College On Call, I need help with admission.")} target="_blank" rel="noopener noreferrer" aria-label="Chat with College On Call on WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105">
        <MessageCircle className="h-6 w-6" aria-hidden />
      </a>
    </>
  );
}
