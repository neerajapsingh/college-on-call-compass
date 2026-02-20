import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

const CTASection = () => (
  <section className="section-padding bg-hero-gradient relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
    <div className="container-narrow relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
          Ready to start your journey?
        </h2>
        <p className="mt-4 text-primary-foreground/80">
          Get free expert counseling and secure admission in India's top colleges today. No fees, no hassle.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/apply">
            <Button size="lg" className="bg-background text-foreground hover:bg-secondary gap-2 px-8">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a
            href="https://wa.me/917471166366?text=Hi%2C%20I%20need%20help%20with%20college%20admission"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
