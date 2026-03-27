import HeroSection from '@/components/home/HeroSection';
import FeaturedListings from '@/components/home/FeaturedListings';
import StatsSection from '@/components/home/StatsSection';
import RecentListings from '@/components/home/RecentListings';
import WhyUs from '@/components/home/WhyUs';
import ContactCTA from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
      <StatsSection />
      <RecentListings />
      <WhyUs />
      <ContactCTA />
    </>
  );
}
