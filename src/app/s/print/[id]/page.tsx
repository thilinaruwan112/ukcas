
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import QRCode from 'qrcode';

import type { ApiInstitute, Course, CertificateVerificationData } from '@/lib/types';

interface VerificationResult {
    certificate: CertificateVerificationData;
    institute: ApiInstitute;
    course: Course;
}


async function getCertificateDetails(id: string): Promise<VerificationResult | null> {
    try {
        const response = await fetch(`/api/verify-certificate/${id}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.status === 'success' ? data.data : null;
    } catch (error) {
        console.error('Failed to fetch certificate details:', error);
        return null;
    }
}

function PrintCertificateSkeleton() {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-4xl bg-white p-12 shadow-lg">
                <Skeleton className="h-[150px] w-full mb-12" />
                <div className="space-y-4 mb-8 text-center">
                    <Skeleton className="h-6 w-1/3 mx-auto" />
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                </div>
                <div className="grid grid-cols-2 gap-x-16 gap-y-4 mt-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
                 <div className="flex justify-between mt-16">
                     <div className="mt-16 space-y-2">
                        <Skeleton className="h-16 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                     <div className="mt-16">
                        <Skeleton className="h-24 w-24" />
                     </div>
                 </div>
            </div>
        </div>
    )
}


export default function PrintCertificatePage() {
    const params = useParams();
    const { id } = params;
    const [certificateData, setCertificateData] = useState<VerificationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');


    useEffect(() => {
        if (typeof id === 'string') {
            getCertificateDetails(id).then(data => {
                if (data) {
                    setCertificateData(data);
                    const verificationUrl = `${window.location.origin}/verify-certificate?id=${data.certificate.certificate_id}`;
                     QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'H' })
                        .then(url => {
                            setQrCodeUrl(url);
                        })
                        .catch(err => {
                            console.error('QR code generation failed:', err);
                        });
                } else {
                    setError("Could not find a certificate with this ID.");
                }
                setLoading(false);
            }).catch(() => {
                setError("An error occurred while fetching the certificate data.");
                setLoading(false);
            })
        } else {
            setError("Invalid certificate ID provided.");
            setLoading(false);
        }
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <PrintCertificateSkeleton />;
    }
    
    if (error || !certificateData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                 <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                        <h1 className="text-2xl font-bold">Error Loading Certificate</h1>
                        <p className="text-muted-foreground">{error || "The certificate data could not be loaded."}</p>
                        <Button onClick={() => window.history.back()}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const { certificate, course, institute } = certificateData;

    return (
        <>
            <div className="fixed top-4 right-4 z-50 print:hidden">
                <Button onClick={handlePrint} >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Certificate
                </Button>
            </div>
            <div id="print-area" className="bg-gray-100 print:bg-white min-h-screen flex justify-center py-8 print:p-0">
                <div className="letter-container print-container relative w-[210mm] h-[297mm] bg-white shadow-lg print:shadow-none p-[1in] font-serif text-black flex flex-col">
                     <div className="absolute inset-0 z-0 opacity-100">
                        <Image 
                            src="https://content-provider.payshia.com/ukcas/institutes/1/docs/ukcas-letter-head.jpg" 
                            alt="Letterhead" 
                            fill
                            objectFit="cover"
                            quality={100}
                        />
                    </div>
                    <div className="relative z-10 flex flex-col pt-4">

                        <div className="text-center mt-[150px] space-y-4">
                             <p className="text-lg">This is to certify that</p>
                             <h1 className="text-4xl font-bold tracking-wide">{certificate.name}</h1>
                             <p className="text-base max-w-xl mx-auto">has completed the United Kingdom College of Advanced Studies endorsed course of learning</p>
                             <h2 className="text-3xl font-semibold">{course.course_name}</h2>
                             <p className="text-base max-w-xl mx-auto">and completed the final examination in accordance with the standards of United Kingdom College of Advanced Studies.</p>
                        </div>
                        
                        <div className="max-w-md mx-auto grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-lg mt-8 font-sans">
                            <span className="font-semibold">Course Duration</span><span>: {course.duration}</span>
                            <span className="font-semibold">Awarded On</span><span>: {new Date(certificate.created_at).toLocaleDateString('en-GB')}</span>
                            <span className="font-semibold">Certificate Number</span><span>: {certificate.certificate_id}</span>
                            <span className="font-semibold">Training Partner</span><span>: {institute.name}</span>
                            <span className="font-semibold">LPC</span><span>: {institute.code}</span>
                        </div>

                         <div className="mt-auto pt-16 flex justify-between items-end">
                            <div className="space-y-2">
                                <div className="relative h-14 w-48">
                                    <Image 
                                        src="https://content-provider.payshia.com/ukcas/institutes/1/docs/sign-updated.png" 
                                        alt="Signature"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                                <div className="border-t-2 border-black w-52 pt-2 text-sm">
                                    <p className="font-bold">Director of Accreditation</p>
                                    <p>United Kingdom College of Advanced Studies</p>
                                </div>
                            </div>
                            {qrCodeUrl && (
                                <div className="relative h-28 w-28">
                                    <Image src={qrCodeUrl} alt="QR Code for verification" layout="fill" />
                                </div>
                            )}
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
