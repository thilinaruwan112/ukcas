
'use client';

import { useRouter, useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getCourseById(id: string, token: string): Promise<Course | null> {
    try {
        const response = await fetch(`/api/courses?id=${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.status === 'success' ? data.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!id) {
        setError("Invalid course ID.");
        setIsFetching(false);
        return;
    }
    const token = sessionStorage.getItem('ukcas_token');
    if (!token) {
        router.push('/login');
        return;
    }
    getCourseById(id, token).then(data => {
        if (data) {
            setCourse(data);
        } else {
            setError("Course not found.");
        }
    }).catch(err => {
        setError(err.message || "Failed to fetch course data.");
    }).finally(() => {
        setIsFetching(false);
    });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      
      const formData = new FormData(e.currentTarget);
      const token = sessionStorage.getItem('ukcas_token');
      const userData = sessionStorage.getItem('ukcas_user');
      const user = userData ? JSON.parse(userData) : null;

       if (!token || !course || !user) {
          toast({ variant: 'destructive', title: "Error", description: "Authentication error or missing course data." });
          setIsLoading(false);
          return;
      }
      
      const payload = {
          id: course.id,
          institute_id: course.institute_id,
          course_name: formData.get('courseName') as string,
          course_code: formData.get('courseCode') as string,
          description: formData.get('description') as string,
          duration: formData.get('duration') as string,
          created_by: user.user_name || 'system',
          active_status: course.active_status,
      };

      try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update course.');
        }

        toast({
            title: "Course Updated",
            description: `The course "${payload.course_name}" has been successfully updated.`,
        });

        router.push('/dashboard/courses');

      } catch (error) {
        const msg = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: "Update Failed", description: msg });
        setIsLoading(false);
      }
  };

  if (isFetching) {
      return <EditCoursePageSkeleton />;
  }
  
  if (error) {
      return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-xl font-semibold">Error Loading Course</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
  }
  
  if (!course) {
      notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link href="/dashboard/courses" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Course List
      </Link>
      <Card className="shadow-lg">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-headline">Edit Course</CardTitle>
          <CardDescription>
            Update the details for the course: {course.course_name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input id="courseName" name="courseName" defaultValue={course.course_name} required disabled={isLoading} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code (Optional)</Label>
              <Input id="courseCode" name="courseCode" defaultValue={course.course_code || ''} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Course Duration</Label>
              <Input id="duration" name="duration" defaultValue={course.duration || ''} required disabled={isLoading} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={course.description || ''} placeholder="A brief description of the course." disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function EditCoursePageSkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-6 w-48" />
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-5 w-80 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                     <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                     <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                     <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-24 w-full" /></div>
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}
