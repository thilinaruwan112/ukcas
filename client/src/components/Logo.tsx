import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, variant }: { className?: string, variant?: 'default' | 'white' }) {
  const isWhite = variant === 'white';
  return (
    <Link href="/" className={cn('flex items-center space-x-2', className)}>
        <Image 
            src="https://content-provider.pharmacollege.lk/ukcas/logo-long-1.png" 
            alt="UKCAS Logo" 
            width={140} 
            height={40} 
            className={cn(
                "h-10 w-auto",
                isWhite && "brightness-0 invert sepia-100 hue-rotate-180 saturate-0"
            )}
        />
    </Link>
  );
}
