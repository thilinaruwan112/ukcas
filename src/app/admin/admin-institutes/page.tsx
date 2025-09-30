

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Building, AlertTriangle, Printer, Calendar, Flag } from "lucide-react";
import type { ApiInstitute } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';

async function getInstitutes(): Promise<ApiInstitute[]> {
    try {
        const response = await fetch(`/api/institutes`);
        if (!response.ok) {
            console.error("Failed to fetch institutes:", response.statusText);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch institutes:', error);
        return [];
    }
}

export default function AdminInstitutesPage() {
    const [institutes, setInstitutes] = useState<ApiInstitute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        getInstitutes()
            .then(data => {
                setInstitutes(data);
            })
            .catch(err => {
                 const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(errorMessage);
            })
            .finally(() => {
                 setLoading(false);
            });
    }, []);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = institutes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(institutes.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const InstitutesSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-36 ml-auto" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    const MobileSkeleton = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                 <Card key={i} className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-end gap-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </Card>
            ))}
        </div>
    )

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Institute Management</h1>
                    <p className="text-muted-foreground">Manage accreditation applications and create new institutes.</p>
                </div>
                 <Button asChild>
                    <Link href="/admin/admin-institutes/new">
                        <Building className="mr-2 h-4 w-4" />
                        Create Institute
                    </Link>
                 </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Accreditation Applications</CardTitle>
                    <CardDescription>Review, approve, or deny applications from institutes.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Institute Name</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Application Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {loading ? <InstitutesSkeleton /> : error ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <AlertTriangle className="h-8 w-8 text-destructive" />
                                                <p className="text-destructive font-medium">Failed to load institutes.</p>
                                                <p className="text-muted-foreground text-sm">{error}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">{app.name}</TableCell>
                                            <TableCell>{app.country}</TableCell>
                                            <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={app.accreditation_status === 'Pending' ? 'secondary' : app.accreditation_status === 'Accredited' ? 'default' : 'destructive'}>
                                                    {app.accreditation_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="space-x-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/institutes/${app.slug}`} target="_blank">View</Link>
                                                    </Button>
                                                    <Button asChild variant="default" size="sm">
                                                        <Link href={`/admin/admin-institutes/edit/${app.id}`}>
                                                            Approve/Edit
                                                        </Link>
                                                    </Button>
                                                    {app.accreditation_status === 'Accredited' && (
                                                        <Button asChild variant="secondary" size="sm">
                                                            <Link href={`/accreditation-letter/${app.id}`} target="_blank">
                                                                <Printer className="mr-2 h-4 w-4" />
                                                                Print Letter
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Deny</Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-48 text-center">
                                                <p className="text-muted-foreground">No institutes found.</p>
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
                                <p className="text-destructive font-medium">Failed to load institutes.</p>
                                <p className="text-muted-foreground text-sm text-center">{error}</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((app) => (
                                <Card key={app.id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{app.name}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Flag size={14} />{app.country}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Calendar size={14} />{new Date(app.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <Badge variant={app.accreditation_status === 'Pending' ? 'secondary' : app.accreditation_status === 'Accredited' ? 'default' : 'destructive'}>
                                            {app.accreditation_status}
                                        </Badge>
                                    </div>
                                    <Separator className="my-3" />
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/institutes/${app.slug}`} target="_blank">View</Link>
                                        </Button>
                                        <Button asChild variant="default" size="sm">
                                            <Link href={`/admin/admin-institutes/edit/${app.id}`}>Approve/Edit</Link>
                                        </Button>
                                        {app.accreditation_status === 'Accredited' && (
                                            <Button asChild variant="secondary" size="sm">
                                                <Link href={`/accreditation-letter/${app.id}`} target="_blank"><Printer className="h-4 w-4" /> Letter</Link>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Deny</Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                <p>No institutes found.</p>
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
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
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
