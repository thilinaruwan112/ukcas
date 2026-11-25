'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShieldCheck } from 'lucide-react';
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
    { href: '/services', label: t('Header.services') },
    { href: '/institutes', label: 'Institutes' },
    { href: '/verify-certificate', label: t('Header.verify') },
    { href: '/blog', label: t('Header.blog') },
    { href: '/events', label: t('Header.events') },
    { href: '/about', label: t('Header.about') },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="hidden lg:block bg-slate-950 text-slate-300 text-xs border-b border-white/10">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              UK Register of Learning Providers (UKPRN): <span className="font-mono text-white">10099298</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>Company Reg. No: <span className="font-mono text-slate-200">16348189</span></span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="mailto:info@ukcas.co.uk" className="hover:text-white transition-colors">
              info@ukcas.co.uk
            </a>
            <span className="text-slate-600">|</span>
            <span>London, United Kingdom</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1 rounded-full bg-muted/60 p-1 border border-border/50">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" asChild className="font-medium">
            <Link href="/login">{t('Header.login')}</Link>
          </Button>
          <Button size="sm" asChild className="rounded-full px-5 shadow-sm">
            <Link href="/registration">{t('Header.register')}</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[340px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Mobile Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="flex h-full flex-col justify-between py-2">
              <div className="space-y-6">
                <Logo />
                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="pt-4 space-y-4 border-t">
                <div className="flex justify-between items-center">
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
                <div className="flex flex-col space-y-2">
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
