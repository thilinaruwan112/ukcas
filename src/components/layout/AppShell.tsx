'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  if (isAppRoute) {
    // Admin and dashboard routes have their own layout with <main> tags.
    return <>{children}</>;
  }

  return (
    <div className="flex flex-1 flex-col bg-public-bg text-public-foreground">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
