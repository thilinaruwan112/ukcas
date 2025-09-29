
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, MoreHorizontal, FilePenLine, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import type { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getCourses(instituteId: string, token: string): Promise<Course[]> {
    try {
        const response = await fetch(`/api/courses?instituteId=${instituteId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch courses');
        }
        const data = await response.json();
        return data.status === 'success' && Array.isArray(data.data) ? data.data : [];
    } catch (error) {
        console.error(error);
        throw error; // Re-throw to be caught by the caller
    }
}

export default function CoursesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('ukcas_token');
        const instituteId = sessionStorage.getItem('ukcas_active_institute_id');
        
        if (!token || !instituteId) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in and have an institute selected.' });
            router.push('/login');
            return;
        }

        getCourses(instituteId, token)
            .then(data => setCourses(data))
            .catch(err => {
                const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [router, toast]);

    const handleDeleteClick = (course: Course) => {
        setCourseToDelete(course);
    };

    const handleDeleteConfirm = async () => {
        if (!courseToDelete) return;
        const token = sessionStorage.getItem('ukcas_token');
        if (!token) return;

        try {
            const response = await fetch(`/api/courses`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id: courseToDelete.id }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete course');
            }
            setCourses(courses.filter(c => c.id !== courseToDelete.id));
            toast({
                title: "Course Deleted",
                description: `The course "${courseToDelete.course_name}" has been removed.`,
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred';
            toast({ variant: 'destructive', title: "Deletion Failed", description: msg });
        } finally {
            setCourseToDelete(null);
        }
    };
    
    const CoursesSkeleton = () => (
         <TableBody>
            {[...Array(3)].map((_, i) => (
                 <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-1/4" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-1/4" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Course Management</h1>
                    <p className="text-muted-foreground">View, add, edit, and manage your offered courses.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/courses/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Course
                    </Link>
                </Button>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course Name</TableHead>
                                <TableHead>Course Code</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {loading ? <CoursesSkeleton /> : error ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertTriangle className="h-8 w-8 text-destructive" />
                                            <p className="text-destructive font-medium">Failed to load courses.</p>
                                            <p className="text-muted-foreground text-sm">{error}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody>
                                {courses.length > 0 ? (
                                    courses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell className="font-medium">{course.course_name}</TableCell>
                                            <TableCell>{course.course_code}</TableCell>
                                            <TableCell>{course.duration}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/courses/edit/${course.id}`}>
                                                                <FilePenLine className="mr-2 h-4 w-4" />
                                                                <span>Edit</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-500 focus:text-red-500"
                                                            onClick={() => handleDeleteClick(course)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-muted-foreground">No courses have been added yet.</p>
                                                <Button asChild size="sm">
                                                    <Link href="/dashboard/courses/new">
                                                        <PlusCircle className="mr-2 h-4 w-4" />
                                                        Add Your First Course
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the course <span className="font-semibold">"{courseToDelete?.course_name}"</span>. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Yes, delete course
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
