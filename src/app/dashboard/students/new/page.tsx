
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function NewStudentPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const studentName = formData.get('studentName') as string;

      // In a real app, you would save this data to your database
      console.log({
          name: formData.get('studentName'),
          course: formData.get('courseName'),
          email: formData.get('email'),
      });

      toast({
          title: "Student Registered",
          description: `${studentName} has been successfully added to your student records.`,
      });

      router.push('/dashboard/students');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link href="/dashboard/students" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Student List
      </Link>
      <Card className="shadow-lg">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-headline">Register New Student</CardTitle>
          <CardDescription>
            Fill out the form below to add a new student to your institute's records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="studentName">Student's Full Name</Label>
              <Input id="studentName" name="studentName" placeholder="e.g., John Doe" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Student's Email</Label>
              <Input id="email" name="email" type="email" placeholder="e.g., john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Enrolled</Label>
              <Input id="courseName" name="courseName" placeholder="e.g., BSc in Computer Science" required />
            </div>
            <Button type="submit" className="w-full h-12 text-base" size="lg">
              Register Student
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
