
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, GraduationCap, Wallet, ArrowRight, Book, Calendar, User, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ApiInstitute, Certificate, Student } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

async function getStudents(instituteId: string, token: string): Promise<Student[]> {
    try {
        const response = await fetch(`/api/students?instituteId=${instituteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch students');
        }
        const data = await response.json();
        return data.status === 'success' && Array.isArray(data.data) ? data.data : [];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

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


function DashboardSkeleton() {
    return (
        <>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                 <Skeleton className="h-8 w-48" />
                 <Skeleton className="h-10 w-44" />
            </div>
             <Skeleton className="h-14 w-full" />
             <div className="grid gap-6 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                           <Skeleton className="h-8 w-8 rounded-full" />
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-8 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-80" />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {[...Array(5)].map((_,i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
                            </TableRow>
                        </TableHeader>
                         <TableBody>
                            {[...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(5)].map((_,j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}

export default function InstituteDashboardPage() {
    const router = useRouter();
    const [institute, setInstitute] = useState<ApiInstitute | null>(null);
    const [stats, setStats] = useState<{ title: string, value: string, icon: JSX.Element }[]>([]);
    const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const instituteDataString = sessionStorage.getItem('ukcas_active_institute');
        const instituteId = sessionStorage.getItem('ukcas_active_institute_id');
        const token = sessionStorage.getItem('ukcas_token');

        if (!instituteDataString || !instituteId || !token) {
            router.push('/admin/select-institute');
            return;
        }

        const activeInstitute: ApiInstitute = JSON.parse(instituteDataString);
        setInstitute(activeInstitute);

        async function fetchData() {
            try {
                // Fetch all data in parallel
                const [studentsData, certificatesData] = await Promise.all([
                    getStudents(instituteId, token),
                    getCertificates(instituteId, token)
                ]);
                
                setStats([
                    { title: "Total Students", value: studentsData.length.toLocaleString(), icon: <Users className="h-8 w-8 text-muted-foreground" /> },
                    { title: "Certificates Issued", value: certificatesData.length.toLocaleString(), icon: <GraduationCap className="h-8 w-8 text-muted-foreground" /> },
                    { title: "Account Balance", value: `$${activeInstitute.balance ? Number(activeInstitute.balance).toFixed(2) : '0.00'}`, icon: <Wallet className="h-8 w-8 text-muted-foreground" /> },
                ]);

                setRecentCertificates(certificatesData.slice(0, 5));

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [router]);

    if (loading || !institute) {
        return <DashboardSkeleton />;
    }

    return (
        <>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                 <h1 className="text-2xl font-bold">Dashboard</h1>
                 <Button asChild><Link href="/dashboard/certificates/new">Issue New Certificate</Link></Button>
            </div>

            <Card className="bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800/50">
                <CardContent className="p-4">
                    <p className="font-semibold text-green-900 dark:text-green-100">Welcome, {institute.name}!</p>
                </CardContent>
            </Card>
           
            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                            {stat.icon}
                            <p className="text-xs text-muted-foreground">{stat.title}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recently Issued Certificates</CardTitle>
                        <CardDescription>A list of the most recent certificates issued by your institute.</CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/certificates">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Responsive container: hidden on mobile, table on md+ */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Certificate ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentCertificates.length > 0 ? recentCertificates.map(cert => (
                                    <TableRow key={cert.id}>
                                        <TableCell>{cert.studentName}</TableCell>
                                        <TableCell>{cert.courseName}</TableCell>
                                        <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={cert.status === 'Pending' ? 'secondary' : cert.status === 'Approved' ? 'default' : 'destructive'}>
                                                {cert.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono">{cert.id}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">No recent certificates found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    
                    {/* Mobile card view: block on mobile, hidden on md+ */}
                    <div className="block md:hidden">
                        {recentCertificates.length > 0 ? (
                             <div className="space-y-4">
                                {recentCertificates.map((cert) => (
                                    <div key={cert.id} className="rounded-lg border p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold flex items-center gap-2"><User />{cert.studentName}</h3>
                                                <p className="text-sm text-muted-foreground font-mono flex items-center gap-2"><FileCheck2 size={16} />{cert.id}</p>
                                            </div>
                                             <Badge variant={cert.status === 'Pending' ? 'secondary' : cert.status === 'Approved' ? 'default' : 'destructive'}>
                                                {cert.status}
                                            </Badge>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2 text-sm">
                                            <p className="flex items-center gap-2"><Book size={16} className="text-muted-foreground"/> {cert.courseName}</p>
                                            <p className="flex items-center gap-2"><Calendar size={16} className="text-muted-foreground"/> {new Date(cert.issueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                           <div className="text-center text-muted-foreground py-12">
                                <p>No recent certificates found.</p>
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </>
    )
}
