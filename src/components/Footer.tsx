'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer 
      className="py-12 lg:py-16"
      style={{ backgroundColor: 'var(--navy)' }}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t('title')}
            </h3>
            <p 
              className="text-lg mb-6"
              style={{ color: 'var(--teal)' }}
            >
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.aboutUs')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.services')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.projects')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Language Section */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('footer.language')}
            </h4>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  locale === 'en'
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{ 
                  backgroundColor: locale === 'en' ? 'var(--coral)' : 'transparent',
                  border: `1px solid ${locale === 'en' ? 'var(--coral)' : 'var(--teal)'}`
                }}
              >
                {t('footer.english')}
              </button>
              <button
                onClick={() => switchLanguage('ar')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  locale === 'ar'
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{ 
                  backgroundColor: locale === 'ar' ? 'var(--coral)' : 'transparent',
                  border: `1px solid ${locale === 'ar' ? 'var(--coral)' : 'var(--teal)'}`
                }}
              >
                {t('footer.arabic')}
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="border-t mt-12 pt-8"
          style={{ borderColor: 'var(--teal)' }}
        >
          <div className="text-center">
            <p className="text-gray-400">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
