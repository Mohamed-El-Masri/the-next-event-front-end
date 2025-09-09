'use client';

import { useLocale, useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';

export default function ProjectsSection() {
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
      id="projects" 
      className="py-16 lg:py-20 bg-white"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: 'var(--navy)' }}
          >
            {t('projects.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Hayathon Project */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="p-8 lg:p-10">
              <div className="flex items-center mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4"
                  style={{ backgroundColor: 'var(--coral)' }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h3 
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: 'var(--navy)' }}
                  >
                    {t('projects.hayathon.title')}
                  </h3>
                  <p 
                    className="text-lg font-medium"
                    style={{ color: 'var(--teal)' }}
                  >
                    {t('projects.hayathon.subtitle')}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4 text-gray-600">
                <MapPin size={20} className="mr-2" />
                <span className="font-medium">{t('projects.hayathon.location')}</span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {t('projects.hayathon.description')}
              </p>

              <button
                onClick={() => scrollToSection('contact')}
                className="btn-primary px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('projects.hayathon.cta')}
              </button>
            </div>
          </div>

          {/* Herfathon Project */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="p-8 lg:p-10">
              <div className="flex items-center mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4"
                  style={{ backgroundColor: 'var(--teal)' }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M9.5 2C8.67 2 8 2.67 8 3.5V5.5C8 6.33 8.67 7 9.5 7S11 6.33 11 5.5V3.5C11 2.67 10.33 2 9.5 2ZM14.5 2C13.67 2 13 2.67 13 3.5V5.5C13 6.33 13.67 7 14.5 7S16 6.33 16 5.5V3.5C16 2.67 15.33 2 14.5 2ZM5 9C3.89 9 3 9.89 3 11V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V11C21 9.89 20.11 9 19 9H5ZM7 12H17C17.55 12 18 12.45 18 13S17.55 14 17 14H7C6.45 14 6 13.55 6 13S6.45 12 7 12Z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h3 
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: 'var(--navy)' }}
                  >
                    {t('projects.herfathon.title')}
                  </h3>
                  <p 
                    className="text-lg font-medium"
                    style={{ color: 'var(--coral)' }}
                  >
                    {t('projects.herfathon.subtitle')}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4 text-gray-600">
                <MapPin size={20} className="mr-2" />
                <span className="font-medium">{t('projects.herfathon.location')}</span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {t('projects.herfathon.description')}
              </p>

              <button
                onClick={() => scrollToSection('contact')}
                className="btn-secondary px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('projects.herfathon.cta')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
