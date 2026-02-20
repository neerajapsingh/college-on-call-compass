import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-hero-gradient-subtle pt-32 pb-20 md:pt-40 md:pb-32">
    {/* Decorative blobs */}
    <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

    <div className="container-narrow section-padding !py-0 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block mb-4 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
            India's Trusted Admission Partner
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
        >
          Get Admission in Top{" "}
          <span className="text-gradient-primary">MBA & B.Tech</span>{" "}
          Colleges in India
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Free expert counseling, college selection, and complete admission support — from application to enrollment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/apply">
            <Button size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90 transition-opacity gap-2 px-8">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a
            href="https://wa.me/917471166366?text=Hi%2C%20I%20need%20help%20with%20college%20admission"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="gap-2 border-border text-foreground hover:bg-secondary">
              <MessageCircle className="w-4 h-4" /> Talk on WhatsApp
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
