import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Locale, locales } from '../../../i18n.config';
import "./globals.css";
import { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps): Promise<ReactNode> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Validate that locale is a valid Locale type
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Type cast to Locale after validation
  const validLocale = locale as Locale;
  const messages = await getMessages({ locale: validLocale });

  return (
    <NextIntlClientProvider messages={messages} locale={validLocale}>
      {children}
    </NextIntlClientProvider>
  );
}
