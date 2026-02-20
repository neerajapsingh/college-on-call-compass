import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy text-secondary py-16">
    <div className="container-narrow section-padding !py-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CC</span>
            </div>
            <span className="font-bold text-lg">
              College<span className="text-primary">on</span>Call
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            India's trusted admission consultancy helping students get into top colleges with free expert guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["Home", "Courses", "About", "Partner", "Contact"].map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Top Courses</h4>
          <div className="flex flex-col gap-2">
            {["MBA", "B.Tech", "BBA", "BCA", "MCA", "M.Tech"].map((course) => (
              <Link
                key={course}
                to="/courses"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {course}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <div className="flex flex-col gap-3">
            <a href="tel:+917471166366" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> +91 7471166366
            </a>
            <a href="tel:+919516366067" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> +91 9516366067
            </a>
            <a href="mailto:info@collegeoncall.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4" /> info@collegeoncall.com
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-navy-light text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} College on Call. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
