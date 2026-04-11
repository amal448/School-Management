import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

const PublicLayout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change automatically
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />
      <main className="flex-grow flex flex-col w-full">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;