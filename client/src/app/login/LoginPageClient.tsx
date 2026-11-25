'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function LoginPageClient() {
  const { t } = useI18n();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('ukcas_token');
    const userDataString = localStorage.getItem('ukcas_user');

    if (userToken && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.acc_type === 'admin') {
          router.replace('/admin/admin-institutes');
        } else {
          router.replace('/admin/select-institute');
        }
      } catch {
        localStorage.clear();
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ email: identifier, pass: password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        localStorage.setItem('ukcas_token', data.token);
        localStorage.setItem('ukcas_user', JSON.stringify(data.data));

        toast({
          title: 'Login Successful',
          description: 'Redirecting to your dashboard...',
        });

        if (data.data.acc_type === 'admin') {
          router.push('/admin/admin-institutes');
        } else {
          router.push('/admin/select-institute');
        }
      } else {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(125,28,38,0.08),_transparent_60%)]" />
      <div className="container relative mx-auto px-4 md:px-6 flex justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <LogIn className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">{t('Login.portalLogin')}</h1>
            <p className="text-sm text-muted-foreground">{t('Login.accessDashboard')}</p>
          </div>

          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>

          <Card className="shadow-xl border-border/70">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your institute or admin portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="identifier">Username or Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="identifier"
                      name="identifier"
                      type="text"
                      placeholder="Enter your username or email"
                      className="h-11 pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('Login.passwordLabel')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-11 pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 text-base font-medium shadow-sm" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In to Portal
                </Button>
              </form>

              <div className="border-t pt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  JWT Protected Session
                </span>
                <Link href="/registration" className="font-medium text-primary hover:underline">
                  Register an institute
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
