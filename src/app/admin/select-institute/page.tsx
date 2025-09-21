
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { Building, ArrowRight, AlertTriangle } from "lucide-react";
import type { UserInstituteAssignment } from '@/lib/types';

async function getAssignedInstitutes(userId: string, token: string): Promise<UserInstituteAssignment[]> {
    if (!userId || !token) return [];
    try {
        const response = await fetch(`/api/user-institutes?userId=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return (data.status === 'success' && Array.isArray(data.data)) ? data.data : [];
    } catch (error) {
        console.error('Failed to fetch assignments:', error);
        return [];
    }
}

export default function SelectInstitutePage() {
    const router = useRouter();
    const [assignments, setAssignments] = useState<UserInstituteAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userStr = sessionStorage.getItem('ukcas_user');
        const token = sessionStorage.getItem('ukcas_token');
        if (!userStr || !token) {
            router.push('/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (user.acc_type === 'admin') {
            // Admins should not be on this page
            router.push('/admin/admin-institutes');
            return;
        }
        
        getAssignedInstitutes(user.id, token)
            .then(data => {
                setAssignments(data);
            })
            .catch(() => {
                setError('Failed to load your assigned institutes.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [router]);

    const handleSelectInstitute = (instituteId: string) => {
        sessionStorage.setItem('ukcas_active_institute_id', instituteId);
        router.push('/dashboard');
    };

    const PageSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <Skeleton className="w-20 h-20 rounded-full mb-4" />
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Building className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Select an Institute</CardTitle>
                    <CardDescription>
                        Choose which of your assigned institutes you would like to manage.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? <PageSkeleton /> : error ? (
                         <div className="text-center text-destructive p-8">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2"/>
                            <p>{error}</p>
                        </div>
                    ) : assignments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {assignments.map((assignment) => (
                                assignment.institute && (
                                    <Card key={assignment.institute.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6 flex flex-col items-center text-center">
                                            <div className="relative w-20 h-20 mb-4">
                                                {assignment.institute.logo_path ? (
                                                    <Image src={assignment.institute.logo_path} alt={`${assignment.institute.name} logo`} layout="fill" className="rounded-full object-contain" />
                                                ) : (
                                                     <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border">
                                                        <Building className="w-10 h-10 text-muted-foreground" />
                                                     </div>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold">{assignment.institute.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-4">{assignment.institute.country}</p>
                                            <Button className="w-full" onClick={() => handleSelectInstitute(assignment.institute.id)}>
                                                Manage
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-8">
                            <p>You have not been assigned to any institutes yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
