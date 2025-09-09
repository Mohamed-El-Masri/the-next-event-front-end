'use client';

import { useLocale, useTranslations } from 'next-intl';

export default function AboutSection() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <section 
      id="about" 
      className="py-16 lg:py-20 bg-white"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: 'var(--navy)' }}
          >
            {t('about.title')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              {t('about.description')}
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {t('about.vision')}
            </p>
          </div>
        </div>

        {/* Heart Icon */}
        <div className="flex justify-center mb-12">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'var(--coral)' }}
          >
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none"
              className="text-white"
            >
              <path 
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Stats or Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'var(--teal)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--navy)' }}>
              Event Planning
            </h3>
            <p className="text-gray-600">
              Comprehensive event management from concept to execution
            </p>
          </div>

          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'var(--coral)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--navy)' }}>
              Innovation Hub
            </h3>
            <p className="text-gray-600">
              Connecting innovators and creators across the Kingdom
            </p>
          </div>

          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7V10C2 16 6 20.88 12 22C18 20.88 22 16 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--navy)' }}>
              Vision 2030
            </h3>
            <p className="text-gray-600">
              Aligned with Saudi Arabia&apos;s transformational vision
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
