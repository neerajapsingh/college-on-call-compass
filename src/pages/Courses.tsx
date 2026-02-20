import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";

const allCourses = [
  { name: "MBA", duration: "2 Years", category: "Management", desc: "Master of Business Administration — lead organizations with strategic thinking." },
  { name: "BBA", duration: "3 Years", category: "Management", desc: "Bachelor of Business Administration — build your business acumen from day one." },
  { name: "B.Tech", duration: "4 Years", category: "Engineering", desc: "Bachelor of Technology — innovate and engineer solutions for the future." },
  { name: "M.Tech", duration: "2 Years", category: "Engineering", desc: "Master of Technology — deepen your engineering expertise." },
  { name: "BCA", duration: "3 Years", category: "Computer Science", desc: "Bachelor of Computer Applications — start your journey in tech." },
  { name: "MCA", duration: "2 Years", category: "Computer Science", desc: "Master of Computer Applications — master software and systems." },
  { name: "B.Com", duration: "3 Years", category: "Commerce", desc: "Bachelor of Commerce — build a strong foundation in commerce and finance." },
  { name: "B.Sc", duration: "3 Years", category: "Science", desc: "Bachelor of Science — explore and research the world of science." },
  { name: "PGDM", duration: "2 Years", category: "Management", desc: "Post Graduate Diploma in Management — industry-ready management education." },
];

const categories = ["All", "Management", "Engineering", "Computer Science", "Commerce", "Science"];

const Courses = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = allCourses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-padding bg-hero-gradient-subtle">
          <div className="container-narrow text-center max-w-3xl mx-auto">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-foreground">
              Explore <span className="text-gradient-primary">Courses</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-muted-foreground text-lg">
              Browse popular courses and apply with free expert guidance.
            </motion.p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-narrow">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      category === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground">{c.name}</h3>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{c.duration}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mb-2">{c.category}</span>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{c.desc}</p>
                  <Link to="/apply">
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors gap-1">
                      Apply Now <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No courses found. Try a different search.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Courses;
