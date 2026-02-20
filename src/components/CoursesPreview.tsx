import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const courses = [
  { name: "MBA", duration: "2 Years", desc: "Master of Business Administration" },
  { name: "B.Tech", duration: "4 Years", desc: "Bachelor of Technology" },
  { name: "BBA", duration: "3 Years", desc: "Bachelor of Business Administration" },
  { name: "BCA", duration: "3 Years", desc: "Bachelor of Computer Applications" },
  { name: "MCA", duration: "2 Years", desc: "Master of Computer Applications" },
  { name: "M.Tech", duration: "2 Years", desc: "Master of Technology" },
];

const CoursesPreview = () => (
  <section className="section-padding bg-secondary/50">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-primary">Popular Courses</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
          Find the right course for you
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group p-6 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-foreground">{c.name}</h3>
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{c.duration}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 flex-1">{c.desc}</p>
            <Link to="/apply">
              <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors gap-1">
                Apply Now <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CoursesPreview;
