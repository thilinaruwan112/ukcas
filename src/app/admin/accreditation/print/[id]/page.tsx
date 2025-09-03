
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
                <div className="space-y-2 mb-8">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-8 w-1/2 mb-6" />
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

    const validUntilDate = new Date(institute.accreditation_valid_until).toLocaleDateString('en-GB', {
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
                <div className="letter-container relative w-[210mm] h-[297mm] bg-white shadow-lg print:shadow-none p-[1in] font-serif text-black flex flex-col">
                     <div className="absolute inset-0 z-0">
                        <Image 
                            src="https://content-provider.payshia.com/ukcas/institutes/1/docs/ukcas-letter-head.jpg" 
                            alt="Letterhead" 
                            fill
                            objectFit="cover"
                            quality={100}
                        />
                    </div>
                    <div className="relative z-10 flex flex-col flex-grow pt-[180px]">
                        
                        <div className="flex-grow flex flex-col items-start justify-start space-y-6 pt-12">
                            <h1 className="font-bold text-lg text-left">UNITED KINGDOM COLLEGE OF ADVANCED STUDIES PARTNERSHIP (UKCAS)</h1>
                            
                            <p className="font-bold text-xl text-left">{institute.name} {institute.country}</p>

                            <p className="max-w-2xl text-base leading-relaxed text-justify">
                                Has successfully fulfilled the UKCAS accreditation requirements, demonstrating compliance with internationally recognised standards. In achieving this milestone, it has been formally recognised as part of the UKCAS global network of accredited institutions.
                            </p>

                            <div className="space-y-2 pt-4 text-base text-left">
                                 <p>
                                    <span className="font-semibold">Learning Partnership Code:</span> {institute.code}
                                 </p>
                                <p>
                                    <span className="font-semibold">Valid until:</span> {validUntilDate}
                                </p>
                            </div>
                        </div>

                         <div className="pt-8">
                            <div className="relative h-28 w-80">
                                <Image 
                                    src="https://content-provider.payshia.com/ukcas/institutes/1/docs/sign.png" 
                                    alt="Signature"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                            <div className="border-t-2 border-black w-64 pt-2 mt-2">
                                <p className="font-bold">Director of Accreditation</p>
                                <p>United Kingdom College of Advanced Studies</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <style jsx global>{`
                @media print {
                    body, html {
                        visibility: hidden;
                        margin: 0;
                        padding: 0;
                    }
                    .letter-container, .letter-container * {
                        visibility: visible;
                    }
                    .letter-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100vw;
                        height: 100vh;
                        margin: 0;
                        padding: 1in;
                        border: none;
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </>
    );
}
