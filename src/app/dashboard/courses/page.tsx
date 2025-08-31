
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, MoreHorizontal, FilePenLine, Trash2 } from "lucide-react";
import { mockInstitutes } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

// In a real app, this would come from a user session or context.
const instituteId = '1';

export default function CoursesPage() {
    const { toast } = useToast();
    const [institute, setInstitute] = useState(() => mockInstitutes.find(i => i.id === instituteId));
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

    const handleDeleteClick = (courseName: string) => {
        setCourseToDelete(courseName);
    };

    const handleDeleteConfirm = () => {
        if (courseToDelete && institute) {
            const updatedCourses = institute.courses.filter(course => course !== courseToDelete);
            setInstitute({ ...institute, courses: updatedCourses });
            
            toast({
                title: "Course Deleted",
                description: `The course "${courseToDelete}" has been successfully removed.`,
            });
            setCourseToDelete(null);
        }
    };

    if (!institute) {
        return (
            <div className="text-center text-muted-foreground">
                <p>Institute data could not be loaded.</p>
            </div>
        );
    }

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
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {institute.courses.length > 0 ? (
                                institute.courses.map((course, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{course}</TableCell>
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
                                                        <span>Edit</span>
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
                                    <TableCell colSpan={2} className="h-48 text-center">
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
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the course <span className="font-semibold">"{courseToDelete}"</span> from your list. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCourseToDelete(null)}>Cancel</AlertDialogCancel>
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
