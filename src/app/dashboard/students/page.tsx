
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, UserCog, Trash2, FileDown, AlertTriangle, Loader2, Mail, Phone, Calendar } from "lucide-react";
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
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

export default function StudentListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('ukcas_token');
        const instituteId = sessionStorage.getItem('ukcas_active_institute_id');

        if (!token || !instituteId) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in and have an institute selected.' });
            router.push('/login');
            return;
        }

        getStudents(instituteId, token)
            .then(data => {
                setStudents(data);
            })
            .catch(err => {
                const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(msg);
            })
            .finally(() => setLoading(false));

    }, [router, toast]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email_address && student.email_address.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student);
    };

    const handleDeleteConfirm = () => {
        if (studentToDelete) {
            // TODO: Implement API call for deletion
            setStudents(students.filter(student => student.id !== studentToDelete.id));
            toast({
                title: "Student Removed",
                description: `${studentToDelete.name} has been successfully removed from the student list.`,
            });
            setStudentToDelete(null);
        }
    };

    const handleExport = () => {
        // ... (existing export logic)
    };

    const StudentsSkeleton = () => (
         <TableBody>
            {[...Array(5)].map((_, i) => (
                 <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Student Management</h1>
                    <p className="text-muted-foreground">Add, edit, and manage all registered students.</p>
                </div>
                <div className="flex w-full sm:w-auto sm:justify-end items-center gap-2">
                     <div className="relative w-full sm:w-64">
                        <Input
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Button variant="outline" onClick={handleExport}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button asChild>
                       <Link href="/dashboard/students/new">
                           <UserPlus className="mr-2 h-4 w-4" />
                           Add New Student
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
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Registered Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        
                            {loading ? <StudentsSkeleton /> : error ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <AlertTriangle className="h-8 w-8 text-destructive" />
                                                <p className="text-destructive font-medium">Failed to load students.</p>
                                                <p className="text-muted-foreground text-sm">{error}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.email_address}</TableCell>
                                            <TableCell>{student.phone_number}</TableCell>
                                            <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
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
                                                            <UserCog className="mr-2 h-4 w-4" />
                                                            <span>Edit Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-500 focus:text-red-500"
                                                            onClick={() => handleDeleteClick(student)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Remove Student</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <p className="text-muted-foreground">
                                                        {searchTerm ? `No students found for "${searchTerm}".` : "No students have been registered yet."}
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
                                        <Skeleton className="h-5 w-3/5" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2 text-sm">
                                        <Skeleton className="h-4 w-4/5" />
                                        <Skeleton className="h-4 w-3/5" />
                                        <Skeleton className="h-4 w-2/5" />
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                             <div className="flex flex-col items-center justify-center gap-2 p-8">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                                <p className="text-destructive font-medium">Failed to load students.</p>
                                <p className="text-muted-foreground text-sm text-center">{error}</p>
                            </div>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <div key={student.id} className="rounded-lg border p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold pr-2">{student.name}</h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <UserCog className="mr-2 h-4 w-4" />
                                                    <span>Edit Details</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:text-red-500"
                                                    onClick={() => handleDeleteClick(student)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Remove Student</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        {student.email_address && <p className="flex items-center gap-2"><Mail size={14} /> {student.email_address}</p>}
                                        {student.phone_number && <p className="flex items-center gap-2"><Phone size={14} /> {student.phone_number}</p>}
                                        <p className="flex items-center gap-2"><Calendar size={14} /> Registered: {new Date(student.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="text-center text-muted-foreground py-12">
                                <p>
                                    {searchTerm ? `No students found for "${searchTerm}".` : "No students have been registered yet."}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to remove this student?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove <span className="font-semibold">{studentToDelete?.name}</span> from your institute. This action does not delete any issued certificates.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setStudentToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Yes, remove student
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

    