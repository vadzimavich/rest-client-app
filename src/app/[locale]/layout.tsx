import '../globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Layout from '@/components/mainLayout/MainLayout';
import { unbounded, martianMono, mulish } from '@/lib/fonts';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ToastProvider from '@/components/toastProvider/ToastProvider';
import { metadata } from '@/lib/metadata';

export { metadata };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${unbounded.variable} ${martianMono.variable} ${mulish.variable} app-layout`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Layout>{children}</Layout>
            <ToastProvider />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
