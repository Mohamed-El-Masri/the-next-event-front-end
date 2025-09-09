'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import MarketplaceSection from '@/components/MarketplaceSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  const locale = useLocale();

  return (
    <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <MarketplaceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
