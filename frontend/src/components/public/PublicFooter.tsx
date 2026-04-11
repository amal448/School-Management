import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary rounded-xl text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                EduCore
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Empowering students with knowledge, character, and skills to navigate the 
              challenges of tomorrow. Excellence in education since 1995.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary" /> Academics
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary" /> Admissions
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary" /> News & Events
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary" /> Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">
                  123 Education Boulevard, <br />
                  Knowledge City, ED 45678
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-slate-400">info@educore.edu</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to our newsletter to receive the latest updates, event announcements, and news.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                required
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 gap-4">
          <p>© {currentYear} EduCore School Management. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
