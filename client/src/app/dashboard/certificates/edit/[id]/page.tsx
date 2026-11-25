
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Loader2, ArrowLeft, GraduationCap, AlertTriangle, AlertCircle, CheckCircle, Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams, notFound } from "next/navigation";

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import type { Student, Course, ApiInstitute, Certificate, CertificateVerificationData } from "@/lib/types";

const formSchema = z.object({
  student_id: z.string({ required_error: "Please select a student." }),
  course_id: z.string({ required_error: "Please select a course." }),
  issue_date: z.date({ required_error: "An issue date is required." }),
  from_date: z.date({ required_error: "A 'from' date is required." }),
  to_date: z.date({ required_error: "A 'to' date is required." }),
});

async function getStudents(instituteId: string, token: string): Promise<Student[]> {
    try {
        const response = await fetch(`/api/students?instituteId=${instituteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.status === 'success' ? data.data : [];
    } catch { return []; }
}

async function getCourses(instituteId: string, token: string): Promise<Course[]> {
    try {
        const response = await fetch(`/api/courses?instituteId=${instituteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.status === 'success' ? data.data : [];
    } catch { return []; }
}

async function getCertificate(id: string, token: string): Promise<CertificateVerificationData | null> {
    try {
        const response = await fetch(`/api/certificates?id=${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.status === 'success' ? data.data : null;
    } catch (error) {
        console.error("Failed to fetch certificate:", error);
        return null;
    }
}

export default function EditCertificatePage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : '';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [institute, setInstitute] = useState<ApiInstitute | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [user, setUser] = useState<any>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (!id) {
            setError("Invalid Certificate ID.");
            setIsLoading(false);
            return;
        }
        
        const instituteId = localStorage.getItem('ukcas_active_institute_id');
        const token = localStorage.getItem('ukcas_token');
        const instituteDataStr = localStorage.getItem('ukcas_active_institute');
        const userDataStr = localStorage.getItem('ukcas_user');

        if (!instituteId || !token || !instituteDataStr || !userDataStr) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in and have an institute selected." });
            router.push('/admin/select-institute');
            return;
        }

        setInstitute(JSON.parse(instituteDataStr));
        setUser(JSON.parse(userDataStr));

        async function fetchData() {
            try {
                const [studentsData, coursesData, certificateData] = await Promise.all([
                    getStudents(instituteId, token),
                    getCourses(instituteId, token),
                    getCertificate(id, token),
                ]);

                setStudents(studentsData);
                setCourses(coursesData);
                
                if (certificateData) {
                    form.reset({
                        student_id: String(certificateData.student_id),
                        course_id: String(certificateData.course_id),
                        issue_date: parseISO(certificateData.created_at), // or issue_date field if available
                        from_date: parseISO(certificateData.from_date),
                        to_date: parseISO(certificateData.to_date),
                    });
                } else {
                    setError("Certificate data could not be loaded.");
                }

            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Failed to load page data.';
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [id, router, toast, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        const token = localStorage.getItem('ukcas_token');
        if (!token || !institute || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'Authentication details are missing.' });
            setIsSubmitting(false);
            return;
        }

        const payload = {
            id: id,
            student_id: values.student_id,
            course_id: values.course_id,
            issueDate: format(values.issue_date, "yyyy-MM-dd"),
            from_date: format(values.from_date, "yyyy-MM-dd"),
            to_date: format(values.to_date, "yyyy-MM-dd"),
            institute_id: institute.id,
            created_by: user.user_name || 'system',
        };

        try {
            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update certificate.');
            }
            
            toast({
                title: "Certificate Updated!",
                description: result.message || `The certificate details have been successfully updated.`,
            });
            
            router.push('/dashboard/certificates');

        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ variant: 'destructive', title: 'Update Failed', description: msg });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (isLoading) {
        return (
             <div className="space-y-6 max-w-2xl mx-auto">
                <Skeleton className="h-6 w-48" />
                <Card>
                    <CardHeader className="text-center">
                        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                        <Skeleton className="h-8 w-64 mx-auto" />
                        <Skeleton className="h-5 w-80 mx-auto mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-xl font-semibold">Error Loading Certificate</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }
    
    if (!form.getValues('student_id')) {
        notFound();
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
                    <CardTitle className="text-2xl sm:text-3xl font-bold font-headline">Edit Certificate</CardTitle>
                    <CardDescription>Review and update the details for this certificate.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="student_id"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Student's Full Name</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                    )}
                                                     disabled={isSubmitting}
                                                >
                                                    {field.value
                                                    ? students.find(
                                                        (student) => String(student.id) === field.value
                                                      )?.name
                                                    : "Select a student"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search student..." />
                                                    <CommandEmpty>No student found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {students.map((student) => (
                                                        <CommandItem
                                                            value={student.name}
                                                            key={student.id}
                                                            onSelect={() => {
                                                            form.setValue("student_id", String(student.id))
                                                            }}
                                                        >
                                                            <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                String(student.id) === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                            />
                                                            {student.name}
                                                        </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Course selection will be similar */}
                            <FormField
                                control={form.control}
                                name="course_id"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Course or Qualification Name</FormLabel>
                                     <FormControl>
                                         <p className="text-muted-foreground text-sm p-3 border rounded-md bg-muted">
                                            {courses.find(c => String(c.id) === field.value)?.course_name || "Course not found"}
                                        </p>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="issue_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Date of Issue</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start pl-3 text-left font-normal",!field.value && "text-muted-foreground")}
                                            disabled={isSubmitting}
                                            >
                                            {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            captionLayout="dropdown-buttons"
                                            fromYear={new Date().getFullYear() - 70}
                                            toYear={new Date().getFullYear() + 5}
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
                                                className={cn("w-full justify-start pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                disabled={isSubmitting}
                                                >
                                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                captionLayout="dropdown-buttons"
                                                fromYear={new Date().getFullYear() - 70}
                                                toYear={new Date().getFullYear() + 5}
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
                                                className={cn("w-full justify-start pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                disabled={isSubmitting}
                                                >
                                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                captionLayout="dropdown-buttons"
                                                fromYear={new Date().getFullYear() - 70}
                                                toYear={new Date().getFullYear() + 5}
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

