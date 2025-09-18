import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Layout from '@/components/mainLayout/MainLayout';
import { geistSans, geistMono } from '@/lib/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} app-layout`}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
