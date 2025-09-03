
'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { mockAdminUsers } from '@/lib/mock-data';
import type { AdminUser } from '@/lib/types';
import { useState } from 'react';

export default function AccreditationLettersPage() {
    const [users] = useState<AdminUser[]>(mockAdminUsers);

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
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.instituteName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.instituteAddress.split(',').pop()?.trim()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/admin/accreditation/print/${user.id}`} target="_blank">
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
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
