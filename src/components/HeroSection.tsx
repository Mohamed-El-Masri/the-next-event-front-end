'use client';

import { useLocale, useTranslations } from 'next-intl';

export default function HeroSection() {
  const locale = useLocale();
  const t = useTranslations();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="pt-20 lg:pt-24 pb-16 lg:pb-20 bg-gradient-to-br from-[var(--light-gray)] to-white"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: 'var(--navy)' }}
          >
            {t('hero.title')}
          </h1>
          <p 
            className="text-lg md:text-xl mb-4 max-w-4xl mx-auto"
            style={{ color: 'var(--navy)' }}
          >
            {t('hero.description')}
          </p>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto mb-12">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-primary px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('hero.cta.planEvent')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-secondary px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('hero.cta.partnerWithUs')}
            </button>
            <button
              onClick={() => scrollToSection('marketplace')}
              className="px-8 py-4 rounded-full text-lg font-semibold border-2 transition-all duration-300 hover:shadow-lg"
              style={{ 
                borderColor: 'var(--navy)', 
                color: 'var(--navy)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--navy)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--navy)';
              }}
            >
              {t('hero.cta.joinMarketplace')}
            </button>
          </div>
        </div>

        {/* Visual Elements */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div 
              className="w-96 h-96 rounded-full"
              style={{ backgroundColor: 'var(--teal)' }}
            ></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-lg">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--coral)' }}
              >
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 32 32" 
                  fill="none"
                  className="text-white"
                >
                  <path 
                    d="M16 4L28 16L16 28L4 16L16 4Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
