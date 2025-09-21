import { Unbounded, Martian_Mono, Manrope } from 'next/font/google';

export const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-heading',
  display: 'swap',
});

export const martianMono = Martian_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
});

export const mulish = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
});
