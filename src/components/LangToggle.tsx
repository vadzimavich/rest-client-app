'use client';

import { usePathname, useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ChangeEvent, useTransition } from 'react';

export default function LangToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    const queryString = searchParams.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(newPath, { locale: newLocale });
    });
  };

  return (
    <select value={locale} onChange={handleChange} disabled={isPending}>
      <option value="en">EN</option>
      <option value="ru">RU</option>
    </select>
  );
}
