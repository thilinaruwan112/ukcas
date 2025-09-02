
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useToast } from '@/hooks/use-toast';
import { mockAdminUsers } from '@/lib/mock-data';

export function LoginPageClient() {
  const { t } = useI18n();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    // Check for institute login
    if (identifier === 'institute@test.com' && password === 'password123') {
      router.push('/dashboard');
      return;
    }

    // Check for admin login (hardcoded admin)
    if (identifier.toLowerCase() === 'admin' && password === 'admin123') {
      router.push('/admin/select-institute');
      return;
    }

    // Check for other admin users from mock data
    const user = mockAdminUsers.find(
      u => u.email.toLowerCase() === identifier.toLowerCase() && u.password === password
    );
    if (user) {
      router.push('/admin/select-institute');
      return;
    }

    // If no match is found
    toast({
      variant: 'destructive',
      title: 'Login Failed',
      description: 'Invalid credentials. Please try again.',
    });
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('Login.passwordLabel')}</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full">
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
              </Header>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}
