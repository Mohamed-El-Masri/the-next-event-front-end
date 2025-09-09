import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !['en', 'ar'].includes(locale)) {
    locale = 'en';
  }

  try {
    const messages = (await import(`../../messages/${locale}/common.json`)).default;
    
    return {
      locale,
      messages
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to English if Arabic fails to load
    const fallbackMessages = (await import(`../../messages/en/common.json`)).default;
    return {
      locale: 'en',
      messages: fallbackMessages
    };
  }
});
