import '../globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Layout from '@/components/mainLayout/MainLayout';
import { geistSans, geistMono } from '@/lib/fonts';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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
        className={`${geistSans.variable} ${geistMono.variable} app-layout`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
