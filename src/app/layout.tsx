import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Layout from '@/components/mainLayout/MainLayout';
import { geistSans, geistMono } from '@/lib/fonts';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      {' '}
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
