
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import type { ApiInstitute } from '@/lib/types';


async function getInstituteDetails(id: string): Promise<ApiInstitute | null> {
    try {
        const response = await fetch(`/api/institutes?id=${id}`);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch institute details:', error);
        return null;
    }
}

function PrintLetterSkeleton() {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-4xl bg-white p-12 shadow-lg">
                <Skeleton className="h-[150px] w-full mb-12" />
                <div className="space-y-4 mb-8">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
                 <div className="space-y-8 mt-16">
                     <Skeleton className="h-6 w-1/3" />
                     <Skeleton className="h-24 w-full" />
                     <Skeleton className="h-20 w-full" />
                 </div>
                 <div className="mt-16">
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-4 w-24 mt-4" />
                    <Skeleton className="h-4 w-48 mt-2" />
                 </div>
            </div>
        </div>
    )
}

export default function PrintAccreditationLetterPage() {
    const params = useParams();
    const { id } = params;
    const [institute, setInstitute] = useState<ApiInstitute | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (typeof id === 'string') {
            getInstituteDetails(id).then(data => {
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
    
    const fullAddress = [institute.address_line1, institute.address_line2, institute.city, institute.state, institute.postal_code, institute.country]
        .filter(Boolean).join(', ');

    return (
        <>
             <div className="fixed top-4 right-4 z-50 print:hidden">
                <Button onClick={handlePrint} >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Letter
                </Button>
            </div>
            <div id="print-area" className="bg-gray-100 print:bg-white min-h-screen flex justify-center py-8 print:p-0">
                <div className="letter-container print-container relative w-[210mm] h-[297mm] bg-white shadow-lg print:shadow-none p-[50px] font-body text-black flex flex-col">
                    <div className="absolute inset-0 z-0 opacity-80">
                        <Image 
                            src="https://content-provider.payshia.com/ukcas/institutes/1/docs/ukcas-letter-head.jpg" 
                            alt="Letterhead" 
                            fill
                            objectFit="cover"
                            quality={100}
                        />
                    </div>
                    <div className="relative z-10 flex flex-col flex-grow pt-[160px]">
                        <div className="text-sm">
                            <p>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <br/>
                            <p className="font-bold">{institute.name}</p>
                            <p>{fullAddress}</p>
                        </div>

                        <div className="mt-8 space-y-6 text-base leading-relaxed">
                            <h1 className="text-xl font-bold underline">Confirmation of UKCAS Accreditation</h1>

                            <p>Dear Sir/Madam,</p>
                            
                            <p>We are pleased to confirm that <span className="font-bold">{institute.name}</span>, holding the UKCAS Provider Code <span className="font-bold">{institute.code}</span>, is a fully accredited institution by the United Kingdom College of Advanced Studies (UKCAS).</p>

                            <p>This accreditation signifies that {institute.name} has successfully met our rigorous standards for educational quality, institutional integrity, and student support. The accreditation is valid until <span className="font-bold">{new Date(institute.accreditation_valid_until).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>, subject to annual review.</p>
                            
                            <p>UKCAS is a prestigious international body dedicated to advancing academic and professional standards worldwide. Our accreditation provides assurance to students, parents, and employers that an institution offers high-quality education that is globally recognized.</p>
                            
                            <p>We congratulate {institute.name} on its commitment to excellence in education.</p>
                        </div>

                        <div className="pt-10">
                            <p>Yours faithfully,</p>
                            <div className="relative h-16 w-48 mt-2">
                                <Image 
                                    src="https://content-provider.payshia.com/ukcas/institutes/1/docs/sign-updated.png" 
                                    alt="Signature"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                            <div className="border-t-2 border-black w-52 pt-2 mt-2 text-sm">
                                <p className="font-bold">Director of Accreditation</p>
                                <p>United Kingdom College of Advanced Studies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                @media print {
                    body, #__next {
                        visibility: hidden !important;
                    }
                    #print-area, #print-area * {
                        visibility: visible !important;
                    }
                    #print-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                }
                 @page {
                    size: A4;
                    margin: 0;
                }
            `}</style>
        </>
    );
}
