
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ArrowLeft, GraduationCap } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Student, Course, ApiInstitute } from "@/lib/types";

const CERTIFICATE_COST = 10;

const formSchema = z.object({
  student_id: z.string({ required_error: "Please select a student." }),
  course_id: z.string({
    required_error: "Please select a course.",
  }),
  issueDate: z.date({
    required_error: "An issue date is required.",
  }),
  from_date: z.date({
    required_error: "A 'from' date is required.",
  }),
    to_date: z.date({
    required_error: "A 'to' date is required.",
  }),
});

async function getStudents(instituteId: string, token: string): Promise<Student[]> {
    try {
        const response = await fetch(`/api/students?instituteId=${instituteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.status === 'success' ? data.data : [];
    } catch {
        return [];
    }
}

async function getCourses(instituteId: string, token: string): Promise<Course[]> {
    try {
        const response = await fetch(`/api/courses?instituteId=${instituteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.status === 'success' ? data.data : [];
    } catch {
        return [];
    }
}

export default function IssueCertificatePage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [institute, setInstitute] = useState<ApiInstitute | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [user, setUser] = useState<any>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    useEffect(() => {
        const instituteId = sessionStorage.getItem('ukcas_active_institute_id');
        const token = sessionStorage.getItem('ukcas_token');
        const instituteDataStr = sessionStorage.getItem('ukcas_active_institute');
        const userDataStr = sessionStorage.getItem('ukcas_user');

        if (!instituteId || !token || !instituteDataStr || !userDataStr) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in and have an institute selected." });
            router.push('/admin/select-institute');
            return;
        }

        setInstitute(JSON.parse(instituteDataStr));
        setUser(JSON.parse(userDataStr));

        async function fetchData() {
            setIsLoading(true);
            const [studentsData, coursesData] = await Promise.all([
                getStudents(instituteId, token),
                getCourses(instituteId, token),
            ]);
            setStudents(studentsData);
            setCourses(coursesData);
            setIsLoading(false);
        }

        fetchData();
    }, [router, toast]);


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        const token = sessionStorage.getItem('ukcas_token');
        if (!token || !institute || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'Authentication details are missing.' });
            setIsSubmitting(false);
            return;
        }

        const payload = {
            ...values,
            institute_id: institute.id,
            created_by: user.user_name || 'system',
            issueDate: format(values.issueDate, "yyyy-MM-dd"),
            from_date: format(values.from_date, "yyyy-MM-dd"),
            to_date: format(values.to_date, "yyyy-MM-dd"),
            institute: { id: institute.id, balance: institute.balance } // Pass only necessary info
        };

        try {
            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to issue certificate.');
            }

            // Update session storage with new balance
            if (result.updatedInstitute) {
                sessionStorage.setItem('ukcas_active_institute', JSON.stringify(result.updatedInstitute));
            }
            
            const studentName = students.find(s => String(s.id) === values.student_id)?.name || 'Unknown Student';
            
            toast({
                title: "Certificate Submitted!",
                description: `The new certificate for ${studentName} is pending admin approval. $${CERTIFICATE_COST.toFixed(2)} has been deducted from your balance.`,
            });
            
            router.push('/dashboard/certificates');

        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ variant: 'destructive', title: 'Submission Failed', description: msg });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
             <Link href="/dashboard/certificates" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to Certificate List
            </Link>
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold font-headline">Issue New Certificate</CardTitle>
                    <CardDescription>Fill out the form below. Each certificate costs ${CERTIFICATE_COST.toFixed(2)} to issue, which will be deducted from your balance upon submission.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="student_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student's Full Name</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoading ? "Loading students..." : "Select a registered student"} />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {!isLoading && students.length === 0 && <p className="p-4 text-sm text-muted-foreground">No students found.</p>}
                                                {students.map(student => (
                                                    <SelectItem key={student.id} value={String(student.id)}>{student.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="course_id"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Course or Qualification Name</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={isLoading ? "Loading courses..." : "Select a course"} />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                             {!isLoading && courses.length === 0 && <p className="p-4 text-sm text-muted-foreground">No courses found.</p>}
                                            {courses.map(course => (
                                                <SelectItem key={course.id} value={String(course.id)}>{course.course_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="issueDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Date of Issue</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormField
                                    control={form.control}
                                    name="from_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>From Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="to_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>To Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isSubmitting || isLoading}>
                            {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
