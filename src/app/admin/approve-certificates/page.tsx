
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { Certificate } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';

async function getPendingCertificates(token: string): Promise<Certificate[]> {
    try {
        const response = await fetch(`/api/certificates?all=true`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch certificates');
        }
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
            return data.data.filter((cert: Certificate) => cert.status === 'Pending');
        }
        return [];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default function ApproveCertificatesPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('ukcas_token');
        if (!token) {
            router.push('/login');
            return;
        }

        getPendingCertificates(token)
            .then(data => setCertificates(data))
            .catch(err => {
                 const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [router]);

    const CertificatesSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-16" /><Skeleton className="h-8 w-16" /></div></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Approve Certificates</h1>
                    <p className="text-muted-foreground">Review and approve or deny pending certificate requests.</p>
                </div>
            </div>
            <Card>
                 <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>The following certificates are awaiting administrative approval.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Institute</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {loading ? <CertificatesSkeleton /> : error ? (
                             <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertTriangle className="h-8 w-8 text-destructive" />
                                            <p className="text-destructive font-medium">Failed to load certificates.</p>
                                            <p className="text-muted-foreground text-sm">{error}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody>
                                {certificates.length > 0 ? (
                                    certificates.map((cert) => (
                                    <TableRow key={cert.id}>
                                        <TableCell className="font-medium">{cert.studentName}</TableCell>
                                        <TableCell>{cert.courseName}</TableCell>
                                        <TableCell>{cert.instituteId}</TableCell>
                                        <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                                                    <Check className="mr-2 h-4 w-4" /> Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                                                    <X className="mr-2 h-4 w-4" /> Deny
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <p className="text-muted-foreground">There are no pending certificate requests.</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
