
import type { Metadata } from 'next';
import { LoginPageClient } from './LoginPageClient';

export const metadata: Metadata = {
    title: 'Portal Login',
    description: 'Access your UKCAS dashboard. Login for institutes to manage certificates and for administrators to manage the platform.',
};

export default function LoginPage() {
  return <LoginPageClient />;
}
