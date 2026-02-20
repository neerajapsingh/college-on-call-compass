import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Handshake, Users } from "lucide-react";

const Partner = () => {
  const [tab, setTab] = useState<"ambassador" | "partner">("ambassador");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-padding bg-hero-gradient-subtle">
          <div className="container-narrow text-center max-w-3xl mx-auto">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-foreground">
              Partner <span className="text-gradient-primary">With Us</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-muted-foreground text-lg">
              Join our growing network as a campus ambassador or institutional partner.
            </motion.p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-narrow max-w-xl mx-auto">
            {/* Tab Toggle */}
            <div className="flex gap-2 mb-8 bg-secondary rounded-lg p-1">
              <button
                onClick={() => { setTab("ambassador"); setSubmitted(false); }}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  tab === "ambassador" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                }`}
              >
                <Users className="w-4 h-4" /> Campus Ambassador
              </button>
              <button
                onClick={() => { setTab("partner"); setSubmitted(false); }}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  tab === "partner" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                }`}
              >
                <Handshake className="w-4 h-4" /> Institutional Partner
              </button>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-card rounded-xl shadow-card-lg text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground">We'll review your application and get back to you soon.</p>
              </motion.div>
            ) : (
              <motion.form
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="p-8 bg-card rounded-xl shadow-card-lg space-y-5"
              >
                <h3 className="text-xl font-bold text-foreground">
                  {tab === "ambassador" ? "Apply as Campus Ambassador" : "Register as Partner Institution"}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{tab === "ambassador" ? "Full Name" : "Institution Name"} *</label>
                  <input required type="text" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                  <input required type="email" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                  <input required type="tel" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                {tab === "ambassador" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">College / University</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                )}
                {tab === "partner" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">City / Location</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message (Optional)</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>
                <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90">
                  Submit Application
                </Button>
              </motion.form>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Partner;
