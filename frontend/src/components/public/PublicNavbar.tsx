import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/config/routes.config';

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change and temporarily disable transitions 
  // to prevent white transition flashes when changing pages.
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Academics', path: '/academics' },
    { name: 'Events', path: '/events' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isDarkBg = location.pathname === '/' && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b ${isNavigating ? 'transition-none' : 'transition-all duration-300'} ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-slate-200/50 shadow-sm py-3'
          : `bg-transparent py-5 ${location.pathname === '/' ? 'border-transparent' : 'border-slate-200'}`
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-colors ${
              isDarkBg ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              isDarkBg ? 'text-white' : 'text-slate-900'
            }`}>
              EduCore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`text-sm font-medium transition-colors ${
                        isActive 
                          ? isDarkBg ? 'text-white font-semibold' : 'text-primary font-semibold' 
                          : isDarkBg ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-3 ml-2 border-l pl-5 border-slate-300/30">
              <Button asChild variant={isDarkBg ? 'secondary' : 'outline'} className={isDarkBg ? 'bg-white/10 hover:bg-white/20 text-white border-transparent backdrop-blur-sm' : ''}>
                <Link to={ROUTES.AUTH.ADMIN_MANAGER_LOGIN}>Current User Login</Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isDarkBg ? 'text-white' : 'text-slate-900'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isDarkBg ? 'text-white' : 'text-slate-900'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-b border-slate-200 shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
              <ul className="flex flex-col space-y-2 mt-4">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between py-3 px-4 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {link.name}
                        {isActive && <ChevronRight className="w-4 h-4 ml-2" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="h-px bg-slate-100 my-2" />
              <div className="flex flex-col gap-2 px-4">
                <Button asChild className="w-full justify-center">
                  <Link to={ROUTES.AUTH.ADMIN_MANAGER_LOGIN}>Current User Login</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
