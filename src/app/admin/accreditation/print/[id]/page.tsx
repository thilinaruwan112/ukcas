
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer, AlertTriangle } from 'lucide-react';
import type { ApiInstitute } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

async function getInstituteById(id: string): Promise<ApiInstitute | null> {
    try {
        const response = await fetch(`https://ukcas-server.payshia.com/institutes/${id}`);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch institute:', error);
        return null;
    }
}

function PrintLetterSkeleton() {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-4xl bg-white p-12 shadow-lg">
                <Skeleton className="h-[150px] w-full mb-12" />
                <div className="flex justify-end mb-8">
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2 mb-8">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-8 w-1/2 mx-auto mb-6" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="mt-16 space-y-2">
                    <Skeleton className="h-4 w-1/5" />
                    <Skeleton className="h-4 w-1/4 mt-8" />
                     <Skeleton className="h-4 w-1/3" />
                </div>
            </div>
        </div>
    )
}

export default function PrintLetterPage() {
    const params = useParams();
    const { id } = params;
    const [institute, setInstitute] = useState<ApiInstitute | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof id === 'string') {
            getInstituteById(id).then(data => {
                if (data) {
                    setInstitute(data);
                } else {
                    setError("Could not find an institute with this ID.");
                }
                setLoading(false);
            }).catch(() => {
                setError("An error occurred while fetching the institute data.");
                setLoading(false);
            })
        } else {
            setError("Invalid institute ID provided.");
            setLoading(false);
        }
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <PrintLetterSkeleton />;
    }
    
    if (error || !institute) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                 <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                        <h1 className="text-2xl font-bold">Error Loading Letter</h1>
                        <p className="text-muted-foreground">{error || "The institute data could not be loaded."}</p>
                        <Button onClick={() => window.history.back()}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const fullAddress = [institute.address_line1, institute.address_line2, institute.city, institute.state, institute.country]
    .filter(Boolean)
    .join(', ');

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
                            fill
                            objectFit="cover"
                            quality={100}
                        />
                    </div>
                    <div className="relative z-10 pt-[150px]">
                        <p className="text-sm mb-8 text-right">{today}</p>
                        
                        <div className="space-y-1 mb-8">
                            <p className="font-bold text-base">{institute.name}</p>
                            <p className="text-sm">{fullAddress}</p>
                        </div>
                        
                        <p className="mb-4 text-sm">Dear Sir/Madam,</p>
                        
                        <h1 className="text-center font-bold text-lg underline mb-6">LETTER OF ACCREDITATION</h1>

                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                We are pleased to inform you that following a comprehensive review of your institution's standards, curriculum, and quality assurance policies, the board of the United Kingdom College of Advanced Studies (UKCAS) has granted full accreditation to <span className="font-bold">{institute.name}</span>.
                            </p>
                            <p>
                                This accreditation is a testament to your institution's commitment to excellence in education and its alignment with global standards. UKCAS recognizes your dedication to providing outstanding learning opportunities and upholding the highest levels of academic integrity.
                            </p>
                             <p>
                                Your UKCAS accreditation is valid until <span className="font-bold">{new Date(institute.accreditation_valid_until).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
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
