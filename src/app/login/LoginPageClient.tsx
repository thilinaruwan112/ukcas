
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useToast } from '@/hooks/use-toast';

export function LoginPageClient() {
  const { t } = useI18n();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
          'Api-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('ukcas_token', data.token);
        localStorage.setItem('ukcas_user', JSON.stringify(data.data));

        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });

        if (data.data.acc_type === 'admin') {
          router.push('/admin/institutes');
        } else {
          router.push('/dashboard');
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

  const LoginForm = () => (
    <form className="space-y-4" onSubmit={handleLogin}>
      <div className="space-y-2">
        <Label htmlFor="identifier">
          Username or Email
        </Label>
        <Input
          id="identifier"
          name="identifier"
          type="text"
          placeholder="Enter your username or email"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('Login.passwordLabel')}</Label>
        <Input id="password" name="password" type="password" required disabled={isLoading} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Login
      </Button>
    </form>
  );

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline">{t('Login.portalLogin')}</h1>
            <p className="text-muted-foreground">{t('Login.accessDashboard')}</p>
          </div>

          <div className="flex justify-center mb-4">
            <LanguageSwitcher />
          </div>

          <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your portal.</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}
