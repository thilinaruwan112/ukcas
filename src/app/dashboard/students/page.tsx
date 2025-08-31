
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, UserCog, Trash2, FileDown } from "lucide-react";
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { mockStudents } from '@/lib/mock-data';
import type { Student } from '@/lib/types';

export default function StudentListPage() {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [searchTerm, setSearchTerm] = useState('');
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student);
    };

    const handleDeleteConfirm = () => {
        if (studentToDelete) {
            setStudents(students.filter(student => student.id !== studentToDelete.id));
            toast({
                title: "Student Removed",
                description: `${studentToDelete.name} has been successfully removed from the student list.`,
            });
            setStudentToDelete(null);
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Name", "Course", "Joined Date"];
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + filteredStudents.map(s => `${s.id},"${s.name}","${s.course}",${s.joinedDate}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "student_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful",
            description: "The student list has been exported as a CSV file.",
        })
    };


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
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Course Enrolled</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.course}</TableCell>
                                    <TableCell>{new Date(student.joinedDate).toLocaleDateString()}</TableCell>
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
                                    <TableCell colSpan={4} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <p className="text-muted-foreground">
                                                {searchTerm ? `No students found for "${searchTerm}".` : "No students have been registered yet."}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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

