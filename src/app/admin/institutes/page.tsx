
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Building, AlertTriangle } from "lucide-react";
import type { ApiInstitute } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getInstitutes(): Promise<ApiInstitute[]> {
    try {
        const response = await fetch(`/api/institutes`);
        if (!response.ok) {
            console.error("Failed to fetch institutes:", response.statusText);
            return [];
        }
        const data = await response.json();
        // The server route already returns the data array
        return data; 
    } catch (error) {
        console.error('Failed to fetch institutes:', error);
        return [];
    }
}

export default function AdminInstitutesPage() {
    const [institutes, setInstitutes] = useState<ApiInstitute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Institute Management</h1>
                    <p className="text-muted-foreground">Manage accreditation applications and create new institutes.</p>
                </div>
                 <Button asChild>
                    <Link href="/admin/institutes/new">
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
                                {institutes.length > 0 ? (
                                    institutes.map((app) => (
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
                                            {app.accreditation_status === 'Pending' && (
                                                <div className="space-x-2">
                                                    <Button variant="outline" size="sm">View</Button>
                                                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">Approve</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Deny</Button>
                                                </div>
                                            )}
                                            {app.accreditation_status !== 'Pending' && (
                                                    <Button variant="outline" size="sm">View Details</Button>
                                            )}
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
                </CardContent>
            </Card>
        </>
    )
}
