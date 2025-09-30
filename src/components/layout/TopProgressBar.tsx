'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// Import nprogress CSS
import 'nprogress/nprogress.css';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        try {
            const targetUrl = new URL(anchor.href);
            const currentUrl = new URL(window.location.href);

            // Ignore if it's just a hash link on the same page
            if (anchor.getAttribute('href') === '#') {
                return;
            }

            // Start progress if it's an internal navigation to a different page
            if (targetUrl.origin === currentUrl.origin && targetUrl.href !== currentUrl.href) {
                NProgress.start();
            }
        } catch (err) {
            // Handle cases where anchor.href is not a full URL (e.g., mailto:)
             if (anchor.getAttribute('href')?.startsWith('/') && anchor.getAttribute('href') !== '#') {
                 NProgress.start();
            }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      NProgress.done(); // Ensure it's cleared on component unmount
    };
  }, []);

  return null;
}
