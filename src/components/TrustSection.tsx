import { motion } from "framer-motion";
import { Users, Building2, TrendingUp, HeartHandshake } from "lucide-react";

const stats = [
  { icon: Users, value: "5,000+", label: "Students Guided" },
  { icon: Building2, value: "100+", label: "Partner Colleges" },
  { icon: TrendingUp, value: "98%", label: "Admission Success" },
  { icon: HeartHandshake, value: "Free", label: "Expert Counseling" },
];

const TrustSection = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</span>
            <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
