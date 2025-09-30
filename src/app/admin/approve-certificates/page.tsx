
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2 } from "lucide-react";
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

async function updateCertificateStatus(id: string, status: 'Approved' | 'Rejected', token: string): Promise<string> {
    const response = await fetch('/api/certificates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, status }),
    });

    const responseText = await response.text();
    if (!response.ok) {
        try {
            const result = JSON.parse(responseText);
             throw new Error(result.message || `Failed to update status to ${status}`);
        } catch (e) {
             throw new Error(responseText || `Failed to update status to ${status}`);
        }
    }

    try {
        // Handle multi-part JSON response
        const jsonObjects = responseText.replace(/}{/g, '}\n{').split('\n');
        const messages = jsonObjects.map(objStr => {
            if (objStr.trim() === '') return null;
            const parsed = JSON.parse(objStr);
            return parsed.message;
        }).filter(Boolean);

        return messages.join(' ');

    } catch (error) {
        console.error("Failed to parse multi-part JSON response:", error);
        // Fallback for single JSON object
        try {
            const result = JSON.parse(responseText);
            return result.message || 'Status updated successfully.';
        } catch (e) {
            return 'Status updated successfully, but response was unclear.';
        }
    }
}


export default function ApproveCertificatesPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchCertificates = () => {
         const token = sessionStorage.getItem('ukcas_token');
        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);
        getPendingCertificates(token)
            .then(data => setCertificates(data))
            .catch(err => {
                 const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(msg);
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
       fetchCertificates();
    }, [router]);
    
    const handleStatusUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
        setUpdatingId(id);
        const token = sessionStorage.getItem('ukcas_token');
        if (!token) {
            toast({ variant: 'destructive', title: 'Error', description: 'Authentication token not found.' });
            setUpdatingId(null);
            return;
        }

        try {
            const successMessage = await updateCertificateStatus(id, status, token);
            toast({
                title: 'Success',
                description: successMessage || `Certificate has been ${status.toLowerCase()}.`,
            });
            // Refresh the list
            setCertificates(prevCerts => prevCerts.filter(cert => cert.id !== id));
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ variant: 'destructive', title: 'Update Failed', description: msg });
        } finally {
            setUpdatingId(null);
        }
    };


    const CertificatesSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-20" /></div></TableCell>
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
                                                 <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() => handleStatusUpdate(cert.id, 'Approved')}
                                                    disabled={updatingId === cert.id}
                                                >
                                                    {updatingId === cert.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                                    Approve
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => handleStatusUpdate(cert.id, 'Rejected')}
                                                    disabled={updatingId === cert.id}
                                                >
                                                    {updatingId === cert.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                                                    Deny
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
