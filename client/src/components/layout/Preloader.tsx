
'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const preloaderShown = localStorage.getItem('ukcas_preloader_shown');
      if (!preloaderShown) {
        setShouldRender(true);
        const fadeOutTimer = setTimeout(() => {
          setIsFadingOut(true);
          localStorage.setItem('ukcas_preloader_shown', 'true');
        }, 1500); // Time logo is visible

        const unmountTimer = setTimeout(() => {
          setShouldRender(false);
        }, 2000); // Visible time + fade-out duration

        return () => {
          clearTimeout(fadeOutTimer);
          clearTimeout(unmountTimer);
        };
      }
    }
  }, [isMounted]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="animate-pulse">
         <Image src="https://content-provider.pharmacollege.lk/ukcas/logo-long-1.png" alt="UKCAS Logo" width={280} height={80} className="h-20 w-auto" />
      </div>
    </div>
  );
}
