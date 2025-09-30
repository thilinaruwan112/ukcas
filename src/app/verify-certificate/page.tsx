
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyCertificatePageClient } from './VerifyCertificatePageClient';

export const metadata: Metadata = {
    title: 'Verify Certificate',
    description: 'Use the UKCAS official verification tool to instantly check the authenticity of a certificate using its unique ID.',
};

export default function VerifyCertificatePage() {
    return (
        <Suspense fallback={null}>
            <VerifyCertificatePageClient />
        </Suspense>
    );
}
