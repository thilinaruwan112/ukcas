
'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import type { ApiInstitute } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getInstitutes(): Promise<ApiInstitute[]> {
    try {
        const response = await fetch(`https://ukcas-server.payshia.com/institutes`);
        if (!response.ok) {
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch institutes:', error);
        return [];
    }
}


export default function AccreditationLettersPage() {
    const [institutes, setInstitutes] = useState<ApiInstitute[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getInstitutes().then(data => {
            setInstitutes(data);
            setLoading(false);
        });
    }, []);

    const InstitutesSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                 <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-36 ml-auto" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Accreditation Letters</h1>
                    <p className="text-muted-foreground">Generate and print official accreditation letters for institutes.</p>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Institute Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                       
                        {loading ? <InstitutesSkeleton /> : (
                             <TableBody>
                                {institutes.length > 0 ? (
                                    institutes.map((institute) => (
                                    <TableRow key={institute.id}>
                                        <TableCell className="font-medium">{institute.name}</TableCell>
                                        <TableCell>{institute.email}</TableCell>
                                        <TableCell>{institute.country}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/admin/accreditation/print/${institute.id}`} target="_blank">
                                                    <Printer className="mr-2 h-4 w-4" />
                                                    Generate Letter
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-48 text-center">
                                            <p className="text-muted-foreground">No institutes available.</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
