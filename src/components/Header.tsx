'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
              {t('title')}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
            >
              {t('navigation.home')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
            >
              {t('navigation.about')}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
            >
              {t('navigation.services')}
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
            >
              {t('navigation.projects')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
            >
              {t('navigation.contact')}
            </button>
          </nav>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-[var(--light-gray)] rounded-full p-1">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  locale === 'en'
                    ? 'bg-[var(--coral)] text-white'
                    : 'text-gray-600 hover:text-[var(--navy)]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage('ar')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  locale === 'ar'
                    ? 'bg-[var(--coral)] text-white'
                    : 'text-gray-600 hover:text-[var(--navy)]'
                }`}
              >
                AR
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[var(--navy)] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left py-2 text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
              >
                {t('navigation.home')}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left py-2 text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
              >
                {t('navigation.about')}
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block w-full text-left py-2 text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
              >
                {t('navigation.services')}
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="block w-full text-left py-2 text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
              >
                {t('navigation.projects')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-2 text-gray-700 hover:text-[var(--navy)] transition-colors font-medium"
              >
                {t('navigation.contact')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
