import { Award } from 'lucide-react';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <Award className="h-8 w-8 text-primary" />
      <span className="font-bold text-xl text-primary font-headline">
        UKCAS
      </span>
    </Link>
  );
}
