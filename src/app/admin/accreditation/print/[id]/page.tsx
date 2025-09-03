
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer, Loader2 } from 'lucide-react';
import { mockAdminUsers } from '@/lib/mock-data';
import type { AdminUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PrintLetterPage() {
    const params = useParams();
    const { id } = params;
    const [institute, setInstitute] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Simulate fetching data
            const foundInstitute = mockAdminUsers.find(u => u.id === id);
            setTimeout(() => {
                if (foundInstitute) {
                    setInstitute(foundInstitute);
                }
                setLoading(false);
            }, 300);
        } else {
            setLoading(false);
        }
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
                <div className="w-full max-w-4xl bg-white p-8">
                    <Skeleton className="h-24 w-1/3 mb-12" />
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-8" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-8" />
                </div>
            </div>
        );
    }
    
    if (!institute) {
        notFound();
    }

    const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <>
            <div className="fixed top-4 right-4 z-50 print:hidden">
                <Button onClick={handlePrint} >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Letter
                </Button>
            </div>
            <div className="bg-gray-100 print:bg-white min-h-screen flex justify-center py-8 print:p-0">
                <div className="relative w-[210mm] h-[297mm] bg-white shadow-lg print:shadow-none p-[1in] font-serif text-black">
                     <div className="absolute inset-0 z-0">
                        <Image 
                            src="https://content-provider.payshia.com/ukcas/institutes/1/docs/ukcas-letter-head.jpg" 
                            alt="Letterhead" 
                            layout="fill" 
                            objectFit="cover"
                            quality={100}
                        />
                    </div>
                    <div className="relative z-10 pt-[150px]">
                        <p className="text-sm mb-8 text-right">{today}</p>
                        
                        <div className="space-y-1 mb-8">
                            <p className="font-bold text-base">{institute.instituteName}</p>
                            <p className="text-sm">{institute.instituteAddress}</p>
                        </div>
                        
                        <p className="mb-4 text-sm">Dear Sir/Madam,</p>
                        
                        <h1 className="text-center font-bold text-lg underline mb-6">LETTER OF ACCREDITATION</h1>

                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                We are pleased to inform you that following a comprehensive review of your institution's standards, curriculum, and quality assurance policies, the board of the United Kingdom College of Advanced Studies (UKCAS) has granted full accreditation to <span className="font-bold">{institute.instituteName}</span>.
                            </p>
                            <p>
                                This accreditation is a testament to your institution's commitment to excellence in education and its alignment with global standards. UKCAS recognizes your dedication to providing outstanding learning opportunities and upholding the highest levels of academic integrity.
                            </p>
                             <p>
                                Your UKCAS accreditation is valid until <span className="font-bold">{new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
                            </p>
                            <p>
                                We congratulate you on this significant achievement and look forward to a continued partnership in advancing educational quality.
                            </p>
                        </div>

                         <div className="mt-16 text-sm">
                            <p>Sincerely,</p>
                            <p className="mt-8 font-bold">Director of Accreditation</p>
                            <p>United Kingdom College of Advanced Studies</p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
