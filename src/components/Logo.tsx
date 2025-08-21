import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
        <Image src="https://content-provider.pharmacollege.lk/ukcas/logo-long-1.png" alt="UKCAS Logo" width={140} height={40} className="h-10 w-auto" />
    </Link>
  );
}
