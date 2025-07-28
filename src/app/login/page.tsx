'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/context/i18n-provider";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useToast } from '@/hooks/use-toast';
import { mockAdminUsers } from '@/lib/mock-data';

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>, userType: 'Admin' | 'Institute') => {
    e.preventDefault();

    if (userType === 'Institute') {
      // For now, institute login just redirects
      router.push('/dashboard');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    // Hardcoded admin user
    if (identifier.toLowerCase() === 'admin' && password === 'admin123') {
      router.push('/admin');
      return;
    }

    // Check mock users by email
    const user = mockAdminUsers.find(
      u => u.email.toLowerCase() === identifier.toLowerCase() && u.password === password
    );

    if (user) {
      router.push('/admin');
      return;
    }

    toast({
      variant: 'destructive',
      title: 'Login Failed',
      description: 'Invalid credentials. Please try again.',
    });
  };

  const LoginForm = ({ userType }: { userType: 'Admin' | 'Institute' }) => (
    <form className="space-y-4" onSubmit={(e) => handleLogin(e, userType)}>
      <div className="space-y-2">
        <Label htmlFor={`${userType}-identifier`}>
          {userType === 'Admin' ? 'Username or Email' : t('Login.emailLabel')}
        </Label>
        <Input
          id={`${userType}-identifier`}
          name="identifier"
          type={userType === 'Admin' ? 'text' : 'email'}
          placeholder={userType === 'Admin' ? 'admin' : 'you@example.com'}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${userType}-password`}>{t('Login.passwordLabel')}</Label>
        <Input id={`${userType}-password`} name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full">
        {userType === 'Admin' ? t('Login.loginButtonAdmin') : t('Login.loginButtonInstitute')}
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

          <Tabs defaultValue="institute" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="institute">{t('Login.institute')}</TabsTrigger>
              <TabsTrigger value="admin">{t('Login.admin')}</TabsTrigger>
            </TabsList>
            <TabsContent value="institute">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Login.instituteLogin')}</CardTitle>
                  <CardDescription>{t('Login.instituteDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm userType="Institute" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Login.adminLogin')}</CardTitle>
                  <CardDescription>{t('Login.adminDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm userType="Admin" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
