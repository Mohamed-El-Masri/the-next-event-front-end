'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';

export default function MarketplaceSection() {
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
      id="marketplace" 
      className="py-16 lg:py-20"
      style={{ backgroundColor: 'var(--light-gray)' }}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-12 lg:p-16 text-center">
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: 'var(--teal)' }}
            >
              <Globe size={48} className="text-white" />
            </div>

            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              style={{ color: 'var(--navy)' }}
            >
              {t('marketplace.title')}
            </h2>

            <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
              {t('marketplace.description')}
            </p>

            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              style={{ 
                backgroundColor: 'var(--navy)', 
                color: 'white' 
              }}
            >
              {t('marketplace.cta')}
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                className={`${locale === 'ar' ? 'mr-2' : 'ml-2'}`}
              >
                <path 
                  d="M7 17L17 7M17 7H7M17 7V17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
