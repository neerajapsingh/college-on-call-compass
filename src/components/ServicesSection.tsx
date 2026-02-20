import { motion } from "framer-motion";
import { GraduationCap, Search, FileText, Compass } from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "Admission Counseling",
    description: "Get personalized guidance from experts who understand the admission landscape across India's top institutions.",
  },
  {
    icon: Search,
    title: "College Selection",
    description: "Find the perfect college based on your profile, budget, and career goals with our data-driven matching.",
  },
  {
    icon: FileText,
    title: "Application Assistance",
    description: "End-to-end support with applications, documentation, and deadlines so you never miss an opportunity.",
  },
  {
    icon: Compass,
    title: "Career Guidance",
    description: "Make informed decisions about your future with expert career counseling and industry insights.",
  },
];

const ServicesSection = () => (
  <section className="section-padding bg-secondary/50">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-primary">Our Services</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
          Everything you need to get admitted
        </h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          From first inquiry to final enrollment, we're with you every step of the way.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group p-6 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
