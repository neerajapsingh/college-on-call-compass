import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "@/lib/admin";
import SiteLayout from "@/components/layout/SiteLayout";
import { Spinner } from "@/components/common";

const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const L = <K extends string>(f: () => Promise<Record<K, React.ComponentType>>, k: K) => lazy(() => f().then((m) => ({ default: m[k] })));
const dir = () => import("./pages/DirectoryPages");
const det = () => import("./pages/DetailPages");
const con = () => import("./pages/ContentPages");
const sta = () => import("./pages/StaticPages");
const Universities = L(dir, "UniversitiesPage"), Online = L(dir, "OnlineDegreesPage"), Regular = L(dir, "RegularAdmissionsPage");
const InstDetail = L(det, "InstitutionDetailPage"), CourseDetail = L(det, "CourseDetailPage");
const Blog = L(con, "BlogPage"), Exams = L(con, "EntranceExamsPage"), Exam = L(con, "ExamPage"), ArticleP = L(con, "ArticlePage");
const About = L(sta, "AboutPage"), Privacy = L(sta, "PrivacyPage"), Terms = L(sta, "TermsPage"), Disclaimer = L(sta, "DisclaimerPage");
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminLead = lazy(() => import("./pages/admin/LeadDetail"));
const AdminFollowups = lazy(() => import("./pages/admin/Followups"));
const cat = () => import("./pages/admin/Catalogue");
const rs = () => import("./pages/admin/ReportsSettings");
const InstAdmin = lazy(() => cat().then((m) => ({ default: m.InstitutionsAdmin })));
const CoursesAdmin = L(cat, "CoursesAdmin"), Reports = L(rs, "Reports"), SettingsP = L(rs, "Settings");

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: (n, e) => (e as { status?: number })?.status !== 0 && n < 1, staleTime: 60_000 } } });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route element={<AdminAuthProvider><Outlet /></AdminAuthProvider>}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="leads/:id" element={<AdminLead />} />
              <Route path="followups" element={<AdminFollowups />} />
              <Route path="universities" element={<InstAdmin type="university" />} />
              <Route path="colleges" element={<InstAdmin type="college" />} />
              <Route path="courses" element={<CoursesAdmin />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<SettingsP />} />
            </Route>
            </Route>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/online-degrees" element={<Online />} />
              <Route path="/regular-admissions" element={<Regular />} />
              <Route path="/universities" element={<Universities />} />
              <Route path="/universities/:slug" element={<InstDetail />} />
              <Route path="/colleges/:slug" element={<InstDetail />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<ArticleP />} />
              <Route path="/entrance-exams" element={<Exams />} />
              <Route path="/entrance-exams/article/:slug" element={<ArticleP />} />
              <Route path="/entrance-exams/:exam" element={<Exam />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/apply" element={<Navigate to="/#enquiry" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
