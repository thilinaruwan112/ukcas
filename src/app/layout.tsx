import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { I18nProvider } from '@/context/i18n-provider';
import CountrySelectorModal from '@/components/CountrySelectorModal';
import { ThemeProvider } from '@/components/layout/theme-provider';
import TopProgressBar from '@/components/layout/TopProgressBar';
import Preloader from '@/components/layout/Preloader';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'UKCAS Accreditation Platform',
  description: 'Official platform for the United Kingdom College of Advanced Studies accreditation.',
  icons: {
    icon: [
        { url: 'https://content-provider.pharmacollege.lk/ukcas/favicon.ico', type: 'image/x-icon' },
        { url: 'https://content-provider.pharmacollege.lk/ukcas/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: 'https://content-provider.pharmacollege.lk/ukcas/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: 'https://content-provider.pharmacollege.lk/ukcas/apple-touch-icon.png',
    other: [
        {
            rel: 'icon',
            url: 'https://content-provider.pharmacollege.lk/ukcas/android-chrome-192x192.png',
            sizes: '192x192'
        },
        {
            rel: 'icon',
            url: 'https://content-provider.pharmacollege.lk/ukcas/android-chrome-512x512.png',
            sizes: '512x512'
        }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <Preloader />
            <Suspense fallback={null}>
              <TopProgressBar />
            </Suspense>
            <div className="flex flex-col flex-1">
              <CountrySelectorModal />
              <AppShell>{children}</AppShell>
              <Toaster />
            </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
