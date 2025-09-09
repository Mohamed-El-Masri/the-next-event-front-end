'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Calendar, Users, Lightbulb, Palette } from 'lucide-react';

export default function ServicesSection() {
  const locale = useLocale();
  const t = useTranslations();

  const services = [
    {
      icon: Calendar,
      title: t('services.eventManagement.title'),
      description: t('services.eventManagement.description'),
      color: 'var(--coral)'
    },
    {
      icon: Users,
      title: t('services.corporateEvents.title'),
      description: t('services.corporateEvents.description'),
      color: 'var(--teal)'
    },
    {
      icon: Lightbulb,
      title: t('services.innovationPrograms.title'),
      description: t('services.innovationPrograms.description'),
      color: 'var(--navy)'
    },
    {
      icon: Palette,
      title: t('services.culturalExperiences.title'),
      description: t('services.culturalExperiences.description'),
      color: 'var(--coral)'
    }
  ];

  return (
    <section 
      id="services" 
      className="py-16 lg:py-20"
      style={{ backgroundColor: 'var(--light-gray)' }}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: 'var(--navy)' }}
          >
            {t('services.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: service.color }}
                  >
                    <IconComponent size={36} className="text-white" />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-4"
                    style={{ color: 'var(--navy)' }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
