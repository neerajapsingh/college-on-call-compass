import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorks from "@/components/HowItWorks";
import CoursesPreview from "@/components/CoursesPreview";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <HowItWorks />
      <CoursesPreview />
      <Testimonials />
      <CTASection />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Index;
