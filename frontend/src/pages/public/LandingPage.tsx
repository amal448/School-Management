import HeroSection from '@/components/public/LandingPage.tsx/HeroSection';
import AcademicSection from '@/components/public/LandingPage.tsx/AcademicSection';
import CampusLifeSection from '@/components/public/LandingPage.tsx/CampusLifeSection';
import SportsSection from '@/components/public/LandingPage.tsx/SportsSection';
import EventsSection from '@/components/public/LandingPage.tsx/EventsSection';
import CTASection from '@/components/public/LandingPage.tsx/CTASection';

export default function LandingPage() {

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AcademicSection />
      <CampusLifeSection />
      <SportsSection />
      <EventsSection />
      <CTASection />
    </div>
  );
}