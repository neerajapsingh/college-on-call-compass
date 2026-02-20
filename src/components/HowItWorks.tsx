import { motion } from "framer-motion";
import { ClipboardList, Headphones, CheckCircle } from "lucide-react";

const steps = [
  { icon: ClipboardList, step: "01", title: "Apply Online", desc: "Fill a simple form with your details and preferences." },
  { icon: Headphones, step: "02", title: "Get Free Counseling", desc: "Our experts call you to understand your goals and shortlist colleges." },
  { icon: CheckCircle, step: "03", title: "Secure Admission", desc: "We handle applications and follow-ups until you're enrolled." },
];

const HowItWorks = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-primary">How It Works</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
          Three simple steps to your dream college
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-hero-gradient flex items-center justify-center mb-5">
              <s.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-5xl font-black text-primary/10 absolute top-0 right-1/4">{s.step}</span>
            <h3 className="font-semibold text-lg text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
