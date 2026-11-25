'use client';

import { useState, useEffect } from 'react';
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
        }, 600);

        const unmountTimer = setTimeout(() => {
          setShouldRender(false);
        }, 950);

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
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-sm transition-opacity duration-300',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="animate-pulse">
        <Image
          src="https://content-provider.pharmacollege.lk/ukcas/logo-long-1.png"
          alt="UKCAS Logo"
          width={240}
          height={68}
          className="h-16 w-auto"
          priority
        />
      </div>
      <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
    </div>
  );
}
