
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileSearch, CheckCircle, XCircle, Loader2, User, BookOpen as BookIcon, Calendar, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ApiInstitute, Course, CertificateVerificationData } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";


interface VerificationResult {
    certificate: CertificateVerificationData;
    institute: ApiInstitute;
    course: Course;
}

export function VerifyCertificatePageClient() {
    const searchParams = useSearchParams();
    const initialCertId = searchParams.get('id');

    const [certificateId, setCertificateId] = useState(initialCertId || "");
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!certificateId.trim()) {
            setError("Please enter a Certificate ID.");
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch(`/api/verify-certificate/${certificateId.trim()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed.');
            }

            if (data.status === 'success') {
                setResult(data.data);
            } else {
                throw new Error(data.message || `Certificate with ID "${certificateId}" not found.`);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
     useEffect(() => {
        if (initialCertId) {
            handleVerify();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialCertId]);


    return (
        <div className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 flex flex-col items-center gap-8">
                <Card className="w-full max-w-lg shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <FileSearch className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-2xl font-headline">Verify a Certificate</CardTitle>
                        <CardDescription>
                            Enter the unique certificate ID to verify its authenticity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div>
                                <label htmlFor="certificateId" className="sr-only">Certificate ID</label>
                                <Input 
                                    id="certificateId" 
                                    placeholder="Enter Certificate ID" 
                                    className="h-12 text-base text-center font-mono tracking-wider" 
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    autoFocus
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading || !certificateId}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {error && !isLoading && (
                    <Card className="w-full max-w-lg bg-destructive/10 border-destructive/50 shadow-lg animate-in fade-in-50">
                        <CardHeader className="text-center items-center">
                            <div className="text-destructive">
                                <XCircle className="h-12 w-12" />
                            </div>
                            <CardTitle className="text-2xl font-headline">Verification Failed</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-sm font-medium">
                            <p>{error}</p>
                        </CardContent>
                    </Card>
                )}

                {result && !isLoading && (
                    <Card className="w-full max-w-lg border-primary/30 shadow-lg animate-in fade-in-50">
                        <CardHeader className="text-center items-center bg-primary/5 dark:bg-primary/10 rounded-t-lg p-6">
                            <div className="text-primary">
                                <CheckCircle className="h-12 w-12" />
                            </div>
                            <CardTitle className="text-2xl font-headline text-primary">Certificate Verified</CardTitle>
                            <CardDescription>This certificate is authentic and valid.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 grid gap-4 text-sm">
                           <div className="flex flex-col space-y-2 text-center border-b pb-4">
                                <span className="font-semibold text-xl text-foreground">{result.certificate.name}</span>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                               <InfoItem icon={<FileSearch size={16}/>} label="Certificate ID" value={result.certificate.certificate_id.toString()} mono />
                               <InfoItem icon={<Calendar size={16}/>} label="Issue Date" value={new Date(result.certificate.created_at).toLocaleDateString()} />
                           </div>
                            <InfoItem icon={<BookIcon size={16}/>} label="Qualification/Course" value={result.course.course_name} />
                           
                           <Separator />

                           <div className="flex flex-col space-y-2 text-center">
                                <span className="text-muted-foreground text-xs">Issuing Institute</span>
                                <span className="font-semibold text-lg">{result.institute.name}</span>
                           </div>

                            <div className="flex justify-between items-center bg-secondary/50 p-3 rounded-md">
                                <span className="text-muted-foreground font-medium flex items-center gap-2"><Building size={16}/> Accreditation Status</span>
                                <Badge variant={result.institute.accreditation_status === 'Accredited' ? 'default' : 'secondary'}>{result.institute.accreditation_status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
}


function InfoItem({ label, value, icon, mono = false }: { label: string, value: string, icon: React.ReactNode, mono?: boolean }) {
    return (
        <div className="space-y-1">
            <p className="text-muted-foreground text-xs flex items-center gap-1">{icon} {label}</p>
            <p className={`font-semibold ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    )
}
