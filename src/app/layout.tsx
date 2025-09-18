import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { geistSans, geistMono } from '@/lib/fonts';
import { metadata as appMetadata } from '@/lib/metadata';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = appMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} app-layout`}
      >
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
