
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Download, FilePenLine, Trash2, MoreHorizontal } from "lucide-react";
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { mockCertificates } from '@/lib/mock-data';
import type { Certificate } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function CertificateListPage() {
    const { toast } = useToast();
    const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates.filter(c => c.instituteId === '1'));
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCertificates = certificates.filter(cert =>
        cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        const headers = ["ID", "Student Name", "Course", "Issue Date", "Status"];
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + filteredCertificates.map(c => `${c.id},"${c.studentName}","${c.courseName}",${c.issueDate},${c.status}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "certificate_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful",
            description: "The certificate list has been exported as a CSV file.",
        })
    };


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
                        <TableBody>
                            {filteredCertificates.length > 0 ? (
                                filteredCertificates.map((cert) => (
                                <TableRow key={cert.id}>
                                    <TableCell className="font-mono">{cert.id}</TableCell>
                                    <TableCell className="font-medium">{cert.studentName}</TableCell>
                                    <TableCell>{cert.courseName}</TableCell>
                                    <TableCell>{cert.issueDate}</TableCell>
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
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
