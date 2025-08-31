
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const courseName = formData.get('courseName') as string;

      // In a real app, you would save this data to your database
      console.log({
          name: courseName,
      });

      toast({
          title: "Course Added",
          description: `The course "${courseName}" has been successfully added to your programs.`,
      });

      router.push('/dashboard/courses');
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
              <Input id="courseName" name="courseName" placeholder="e.g., Bachelor of Science in Information Technology" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code (Optional)</Label>
              <Input id="courseCode" name="courseCode" placeholder="e.g., BSIT-01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Course Duration</Label>
              <Input id="duration" name="duration" placeholder="e.g., 4 Years" required />
            </div>
            <Button type="submit" className="w-full h-12 text-base" size="lg">
              Add Course
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
