'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/i18n-provider';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeSwitcher } from './theme-switcher';

export default function Header() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navLinks = [
    { href: '/', label: t('Header.home') },
    { href: '/institutes', label: t('Header.institutes') },
    { href: '/blog', label: t('Header.blog') },
    { href: '/events', label: t('Header.events') },
    { href: '/verify-certificate', label: t('Header.verify') },
    { href: '/about', label: t('Header.about') },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button variant="ghost" asChild>
            <Link href="/login">{t('Header.login')}</Link>
          </Button>
          <Button asChild>
            <Link href="/registration">{t('Header.register')}</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col space-y-6 p-4">
              <Logo />
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="pt-4 mt-auto space-y-4 border-t">
                <div className="flex justify-between items-center">
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
                <div className='flex flex-col space-y-2'>
                  <Button variant="outline" asChild>
                      <Link href="/login">{t('Header.login')}</Link>
                  </Button>
                  <Button asChild>
                      <Link href="/registration">{t('Header.register')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
