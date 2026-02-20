import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Target, Eye, ShieldCheck, Users, Award, Clock } from "lucide-react";

const reasons = [
  { icon: ShieldCheck, title: "Trusted by 5000+ Students", desc: "Proven track record of successful admissions across India." },
  { icon: Users, title: "Expert Counselors", desc: "Experienced team dedicated to your academic success." },
  { icon: Award, title: "100+ Partner Colleges", desc: "Wide network of top institutions for maximum options." },
  { icon: Clock, title: "Free & Fast Process", desc: "No hidden fees. Quick turnaround on every application." },
];

const About = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <section className="section-padding bg-hero-gradient-subtle">
        <div className="container-narrow text-center max-w-3xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-foreground">
            About <span className="text-gradient-primary">College on Call</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-muted-foreground text-lg">
            We're on a mission to make quality higher education accessible to every student in India through free expert guidance and a seamless admission process.
          </motion.p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To bridge the gap between students and top colleges by providing free, personalized admission counseling. We believe every student deserves access to the right guidance regardless of their background.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To become India's most trusted admission consultancy, empowering millions of students to make informed decisions about their education and career paths.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container-narrow">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose Us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 bg-card rounded-xl shadow-card text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <r.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default About;
