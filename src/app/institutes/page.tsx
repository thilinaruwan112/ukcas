
import type { Metadata } from 'next';
import InstituteSearch from '@/components/institutes/InstituteSearch';

export const metadata: Metadata = {
    title: 'Accredited Institutes Directory',
    description: 'Explore our global network of trusted and accredited institutions. Search our directory to find detailed information about UKCAS-accredited colleges and universities.',
};

export default function InstitutesPage() {
    return <InstituteSearch />;
}
