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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ukcas.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'UKCAS - Global Accreditation & Certificate Verification',
    template: '%s | UKCAS',
  },
  description: 'The United Kingdom College of Advanced Studies (UKCAS) provides prestigious accreditation for educational institutions and a secure platform for certificate verification worldwide.',
  keywords: ['UKCAS', 'accreditation', 'higher education', 'certificate verification', 'institutional accreditation', 'global education standards'],
  openGraph: {
    title: 'UKCAS - Global Accreditation & Certificate Verification',
    description: 'The United Kingdom College of Advanced Studies (UKCAS) provides prestigious accreditation for educational institutions and a secure platform for certificate verification worldwide.',
    images: [
      {
        url: 'https://content-provider.pharmacollege.lk/ukcas/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UKCAS Logo',
      },
    ],
    siteName: 'UKCAS',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UKCAS - Global Accreditation & Certificate Verification',
    description: 'The United Kingdom College of Advanced Studies (UKCAS) provides prestigious accreditation for educational institutions and a secure platform for certificate verification worldwide.',
    images: ['https://content-provider.pharmacollege.lk/ukcas/og-image.png'],
  },
  icons: {
    icon: [
        { url: 'https://content-provider.pharmacollege.lk/ukcas/favicon.ico', type: 'image/x-icon', sizes: 'any' },
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
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
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
