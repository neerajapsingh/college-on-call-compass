import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    course: "MBA, Symbiosis",
    text: "College on Call made my MBA admission stress-free. Their counselors helped me choose the right college and handled everything!",
  },
  {
    name: "Rohit Verma",
    course: "B.Tech, VIT",
    text: "I had no idea where to start. The team guided me from application to admission. Truly grateful for their free counseling service.",
  },
  {
    name: "Anjali Patel",
    course: "BBA, Christ University",
    text: "Professional, responsive, and genuinely caring. They treated my admission like their own. Highly recommend to every student!",
  },
];

const Testimonials = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-primary">Student Stories</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
          Trusted by thousands of students
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card rounded-xl shadow-card border border-border"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
            <div>
              <p className="font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.course}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
