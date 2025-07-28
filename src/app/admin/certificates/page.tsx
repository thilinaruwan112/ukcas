'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCertificates, mockInstitutes } from "@/lib/mock-data";
import type { Certificate, Institute } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const CERTIFICATE_COST = 10;

export default function AdminCertificatesPage() {
    const { toast } = useToast();
    const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
    const [institutes, setInstitutes] = useState<Institute[]>(mockInstitutes);

    const getInstituteName = (instituteId: string) => {
        return institutes.find(i => i.id === instituteId)?.name || 'Unknown Institute';
    };

    const handleApproval = (certificateId: string, newStatus: 'Approved' | 'Denied') => {
        const updatedCertificates = certificates.map(cert => {
            if (cert.id === certificateId && cert.status === 'Pending') {
                // If denying, refund the institute
                if (newStatus === 'Denied') {
                    const updatedInstitutes = institutes.map(inst => {
                        if (inst.id === cert.instituteId) {
                             toast({
                                title: 'Certificate Denied',
                                description: `The certificate for ${cert.studentName} has been denied. $${CERTIFICATE_COST.toFixed(2)} refunded to ${inst.name}.`,
                            });
                            return { ...inst, balance: inst.balance + CERTIFICATE_COST };
                        }
                        return inst;
                    });
                    setInstitutes(updatedInstitutes);
                } else {
                     toast({
                        title: 'Certificate Approved!',
                        description: `The certificate for ${cert.studentName} has been approved.`,
                    });
                }
                return { ...cert, status: newStatus };
            }
            return cert;
        });
        setCertificates(updatedCertificates);
    };

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Certificate Issuance Requests</h1>
                <p className="text-muted-foreground">Review, approve, or deny pending certificate requests from institutes.</p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Institute</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.map((cert) => (
                                <TableRow key={cert.id}>
                                    <TableCell className="font-medium">{cert.studentName}</TableCell>
                                    <TableCell>{getInstituteName(cert.instituteId)}</TableCell>
                                    <TableCell>{cert.courseName}</TableCell>
                                    <TableCell>
                                        <Badge variant={cert.status === 'Pending' ? 'secondary' : cert.status === 'Approved' ? 'default' : 'destructive'}>
                                            {cert.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {cert.status === 'Pending' && (
                                            <div className="space-x-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-green-600 hover:text-green-700"
                                                    onClick={() => handleApproval(cert.id, 'Approved')}
                                                >
                                                    Approve
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleApproval(cert.id, 'Denied')}
                                                >
                                                    Deny
                                                </Button>
                                            </div>
                                        )}
                                        {cert.status !== 'Pending' && (
                                                <span className="text-xs text-muted-foreground">No actions</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
