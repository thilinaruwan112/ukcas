
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      
      const formData = new FormData(e.currentTarget);
      const token = sessionStorage.getItem('ukcas_token');
      const instituteId = sessionStorage.getItem('ukcas_active_institute_id');
      const userData = sessionStorage.getItem('ukcas_user');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!token || !user || !instituteId) {
          toast({ variant: 'destructive', title: "Authentication Error", description: "You must be logged in and have an institute selected to create a course." });
          setIsLoading(false);
          return;
      }

      const payload = {
          institute_id: parseInt(instituteId),
          name: formData.get('courseName') as string,
          course_code: formData.get('courseCode') as string,
          description: formData.get('description') as string,
          duration: formData.get('duration') as string,
          created_by: user.user_name || 'system',
      };

      try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to create course.');
        }

        toast({
            title: "Course Added",
            description: `The course "${payload.name}" has been successfully added.`,
        });

        router.push('/dashboard/courses');

      } catch (error) {
        const msg = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: "Creation Failed", description: msg });
        setIsLoading(false);
      }
  };

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
          <CardTitle className="text-2xl font-headline">Add New Course</CardTitle>
          <CardDescription>
            Fill out the form below to add a new course to your institute's offerings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input id="courseName" name="courseName" placeholder="e.g., Bachelor of Science in Information Technology" required disabled={isLoading} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code (Optional)</Label>
              <Input id="courseCode" name="courseCode" placeholder="e.g., BSIT-01" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Course Duration</Label>
              <Input id="duration" name="duration" placeholder="e.g., 4 Years" required disabled={isLoading} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="A brief description of the course." disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Course
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
