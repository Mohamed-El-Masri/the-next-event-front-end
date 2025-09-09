import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Locale, locales } from '../../../i18n.config';
import "./globals.css";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
