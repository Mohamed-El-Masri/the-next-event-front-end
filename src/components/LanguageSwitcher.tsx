'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <select
        value={locale}
        onChange={(e) => switchLanguage(e.target.value)}
        className="text-sm border border-gray-300 rounded px-2 py-1">
        <option value="en">English</option>
        <option value="ar">???????</option>
      </select>
    </div>
  );
}
