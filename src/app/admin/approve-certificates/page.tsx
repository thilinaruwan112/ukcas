

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
import { Check, X, Printer, User, BookOpen, Calendar as CalendarIcon, Building } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { usePagination, DOTS } from '@/hooks/use-pagination';


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
            // Return all certificates, not just pending, so we can see their status
            return data.data;
        }
        return [];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function updateCertificateStatus(id: string, status: 'Approved' | 'Rejected', token: string): Promise<string> {
    const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, status, isUpdate: true }),
    });

    if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: 'An unknown error occurred during status update.' }));
        throw new Error(errorResult.message);
    }
    
    const result = await response.json();
    return result.message || `Status updated to ${status} successfully.`;
}


export default function ApproveCertificatesPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchCertificates = () => {
         const token = localStorage.getItem('ukcas_token');
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
        const token = localStorage.getItem('ukcas_token');
        if (!token) {
            toast({ variant: 'destructive', title: 'Error', description: 'Authentication token not found.' });
            setUpdatingId(null);
            return;
        }

        try {
            const successMessage = await updateCertificateStatus(id, status, token);
            toast({
                title: 'Success',
                description: successMessage,
            });
            // Refresh the list to show the updated status
            fetchCertificates();
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

     const MobileSkeleton = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                 <Card key={i} className="p-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Separator className="my-3" />
                     <div className="flex justify-end gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </Card>
            ))}
        </div>
    );
    
    const pendingCertificates = certificates.filter(c => c.status === 'Pending');

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pendingCertificates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(pendingCertificates.length / itemsPerPage);

    const paginationRange = usePagination({
        currentPage,
        totalCount: pendingCertificates.length,
        pageSize: itemsPerPage,
    });

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                    <div className="hidden md:block">
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
                                    {currentItems.length > 0 ? (
                                        currentItems.map((cert) => (
                                        <TableRow key={cert.id}>
                                            <TableCell className="font-medium">{cert.studentName}</TableCell>
                                            <TableCell>{cert.courseName}</TableCell>
                                            <TableCell>{cert.instituteId}</TableCell>
                                            <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                {cert.status === 'Pending' ? (
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
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/s/print/${cert.id}`} target="_blank">
                                                                    <Printer className="mr-2 h-4 w-4" />
                                                                    Print Certificate
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
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
                    </div>

                    <div className="block md:hidden p-4 space-y-4">
                         {loading ? <MobileSkeleton /> : error ? (
                            <div className="flex flex-col items-center justify-center gap-2 p-8">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                                <p className="text-destructive font-medium">Failed to load certificates.</p>
                                <p className="text-muted-foreground text-sm text-center">{error}</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((cert) => (
                                <Card key={cert.id} className="p-4">
                                     <div className="space-y-2 text-sm">
                                        <p className="font-semibold text-base flex items-center gap-2"><User size={16} /> {cert.studentName}</p>
                                        <p className="text-muted-foreground flex items-center gap-2"><BookOpen size={16} /> {cert.courseName}</p>
                                        <p className="text-muted-foreground flex items-center gap-2"><Building size={16} /> {cert.instituteId}</p>
                                        <p className="text-muted-foreground flex items-center gap-2"><CalendarIcon size={16} /> {new Date(cert.issueDate).toLocaleDateString()}</p>
                                     </div>
                                     <Separator className="my-3" />
                                     {cert.status === 'Pending' ? (
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                                                onClick={() => handleStatusUpdate(cert.id, 'Approved')}
                                                disabled={updatingId === cert.id}
                                            >
                                                {updatingId === cert.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                Approve
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => handleStatusUpdate(cert.id, 'Rejected')}
                                                disabled={updatingId === cert.id}
                                            >
                                                {updatingId === cert.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                                Deny
                                            </Button>
                                        </div>
                                     ) : (
                                        <div className="flex justify-end">
                                            <Badge>{cert.status}</Badge>
                                        </div>
                                     )}
                                </Card>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                <p>There are no pending certificate requests.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                {totalPages > 1 && (
                    <div className="p-4 border-t">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                                </PaginationItem>
                                {paginationRange?.map((pageNumber, index) => {
                                    if (pageNumber === DOTS) {
                                        return <PaginationItem key={`dot-${index}`}><PaginationEllipsis /></PaginationItem>;
                                    }
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href="#"
                                                isActive={currentPage === pageNumber}
                                                onClick={(e) => { e.preventDefault(); handlePageChange(pageNumber as number); }}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                                <PaginationItem>
                                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </Card>
        </>
    )
}

    