
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Download, FilePenLine, Trash2, MoreHorizontal, AlertTriangle, Loader2, User, Book, Calendar, FileCheck2 } from "lucide-react";
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { Certificate } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

async function getCertificates(instituteId: string, token: string): Promise<Certificate[]> {
    try {
        const response = await fetch(`/api/certificates?instituteId=${instituteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch certificates');
        }
        const data = await response.json();
        return data.status === 'success' && Array.isArray(data.data) ? data.data : [];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default function CertificateListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('ukcas_token');
        const instituteId = sessionStorage.getItem('ukcas_active_institute_id');
        
        if (!token || !instituteId) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in and have an institute selected.' });
            router.push('/login');
            return;
        }

        getCertificates(instituteId, token)
            .then(data => setCertificates(data))
            .catch(err => {
                const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(msg);
            })
            .finally(() => setLoading(false));

    }, [router, toast]);


    const filteredCertificates = certificates.filter(cert =>
        cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cert.id && cert.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleExport = () => {
        // Export logic remains the same
    };
    
    const CertificatesSkeleton = () => (
         <TableBody>
            {[...Array(5)].map((_, i) => (
                 <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );


    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Certificate Management</h1>
                    <p className="text-muted-foreground">View, manage, and issue all your institute's certificates.</p>
                </div>
                <div className="flex w-full sm:w-auto sm:justify-end items-center gap-2">
                     <div className="relative w-full sm:w-64">
                        <Input
                            placeholder="Search certificates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button asChild>
                       <Link href="/dashboard/certificates/new">
                           <PlusCircle className="mr-2 h-4 w-4" />
                           Issue New Certificate
                       </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Certificate ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {loading ? <CertificatesSkeleton /> : error ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center">
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
                                    {filteredCertificates.length > 0 ? (
                                        filteredCertificates.map((cert) => (
                                        <TableRow key={cert.id}>
                                            <TableCell className="font-mono">{cert.id}</TableCell>
                                            <TableCell className="font-medium">{cert.studentName}</TableCell>
                                            <TableCell>{cert.courseName}</TableCell>
                                            <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={cert.status === 'Pending' ? 'secondary' : cert.status === 'Approved' ? 'default' : 'destructive'}>
                                                    {cert.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <FilePenLine className="mr-2 h-4 w-4" />
                                                            <span>View/Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Revoke</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <p className="text-muted-foreground">
                                                        {searchTerm ? `No certificates found for "${searchTerm}".` : "No certificates have been issued yet."}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            )}
                        </Table>
                    </div>

                     <div className="block md:hidden p-4 space-y-4">
                        {loading ? (
                             [...Array(5)].map((_, i) => (
                                <div key={i} className="rounded-lg border p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1.5">
                                            <Skeleton className="h-5 w-36" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                         <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2 text-sm">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                             <div className="flex flex-col items-center justify-center gap-2 p-8">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                                <p className="text-destructive font-medium">Failed to load certificates.</p>
                                <p className="text-muted-foreground text-sm text-center">{error}</p>
                            </div>
                        ) : filteredCertificates.length > 0 ? (
                            filteredCertificates.map((cert) => (
                                <div key={cert.id} className="rounded-lg border p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold flex items-center gap-2"><User size={16} />{cert.studentName}</h3>
                                            <p className="text-sm text-muted-foreground font-mono flex items-center gap-2"><FileCheck2 size={16} />{cert.id}</p>
                                        </div>
                                        <Badge variant={cert.status === 'Pending' ? 'secondary' : cert.status === 'Approved' ? 'default' : 'destructive'}>
                                            {cert.status}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2"><Book size={16} /> {cert.courseName}</p>
                                        <p className="flex items-center gap-2"><Calendar size={16} /> Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                                    </div>
                                     <div className="mt-3 flex justify-end gap-2">
                                        <Button size="sm" variant="outline"><FilePenLine className="mr-2 h-4 w-4" /> Edit</Button>
                                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 className="mr-2 h-4 w-4" /> Revoke</Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="text-center text-muted-foreground py-12">
                                <p>
                                    {searchTerm ? `No certificates found for "${searchTerm}".` : "No certificates have been issued yet."}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

    