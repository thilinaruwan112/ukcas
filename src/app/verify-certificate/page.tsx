'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileSearch, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { mockCertificates, mockInstitutes } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import type { Certificate, Institute } from "@/lib/types";

interface VerificationResult {
    certificate: Certificate;
    instituteName: string;
    instituteStatus: Institute['status'];
}

export default function VerifyCertificatePage() {
    const [certificateId, setCertificateId] = useState("");
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!certificateId.trim()) {
            setError("Please enter a Certificate ID.");
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            const foundCertificate = mockCertificates.find(cert => cert.id.toLowerCase() === certificateId.trim().toLowerCase());

            if (foundCertificate) {
                const foundInstitute = mockInstitutes.find(inst => inst.id === foundCertificate.instituteId);

                if (foundInstitute) {
                    setResult({
                        certificate: foundCertificate,
                        instituteName: foundInstitute.name,
                        instituteStatus: foundInstitute.status,
                    });
                } else {
                    setError("Internal Error: Could not find the issuing institute for this certificate.");
                }
            } else {
                setError(`Certificate with ID "${certificateId}" not found. Please check the ID and try again.`);
            }

            setIsLoading(false);
        }, 1000);
    };

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
                                    placeholder="Enter Certificate ID (e.g., UKCAS-12345678)" 
                                    className="h-12 text-base" 
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
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
                        <CardHeader className="text-center items-center bg-primary/5 dark:bg-primary/10 rounded-t-lg">
                            <div className="text-primary">
                                <CheckCircle className="h-12 w-12" />
                            </div>
                            <CardTitle className="text-2xl font-headline text-primary">Certificate Verified</CardTitle>
                            <CardDescription>This certificate is authentic and valid.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 grid gap-4 text-sm">
                           <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Student Name</span>
                                <span className="font-semibold text-right">{result.certificate.studentName}</span>
                            </div>
                           <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Certificate ID</span>
                                <span className="font-semibold font-mono text-right">{result.certificate.id}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Course Name</span>
                                <span className="font-semibold text-right">{result.certificate.courseName}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Date of Issue</span>
                                <span className="font-semibold text-right">{result.certificate.issueDate}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Issuing Institute</span>
                                <span className="font-semibold text-right">{result.instituteName}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-muted-foreground">Accreditation Status</span>
                                <Badge variant="default">{result.instituteStatus}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
}