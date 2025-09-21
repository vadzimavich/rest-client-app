'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LangToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const newPath = pathname.startsWith(`/${locale}`)
      ? pathname.substring(3)
      : pathname;
    router.replace(`/${newLocale}${newPath}`);
  };

  return (
    <select value={locale} onChange={handleChange}>
      <option value="en">EN</option>
      <option value="ru">RU</option>
    </select>
  );
}
