
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft, CalendarIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';

export default function NewStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [dob, setDob] = useState<Date | undefined>();


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const studentName = formData.get('name') as string;

      // In a real app, you would save this data to your database
      console.log(Object.fromEntries(formData.entries()));

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Student's Full Name</Label>
                    <Input id="name" name="name" placeholder="e.g., John Doe" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !dob && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={dob}
                                onSelect={setDob}
                                captionLayout="dropdown-buttons"
                                fromYear={1950}
                                toYear={new Date().getFullYear() - 10}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Input type="hidden" name="date_of_birth" value={dob ? format(dob, 'yyyy-MM-dd') : ''} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email_address">Student's Email</Label>
                    <Input id="email_address" name="email_address" type="email" placeholder="e.g., john.doe@example.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" name="phone_number" type="tel" placeholder="e.g., +44 1234 567890" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" placeholder="e.g., United Kingdom" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea id="address" name="address" placeholder="123 Example Street, London, EX1 2MP" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="id_card_front">ID Card (Front)</Label>
                    <Input id="id_card_front" name="id_card_front" type="file" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="id_card_back">ID Card (Back)</Label>
                    <Input id="id_card_back" name="id_card_back" type="file" />
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ol_certificate">O/L Certificate</Label>
                    <Input id="ol_certificate" name="ol_certificate" type="file" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="al_certificate">A/L Certificate</Label>
                    <Input id="al_certificate" name="al_certificate" type="file" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="student_photo">Student Photo</Label>
                <Input id="student_photo" name="student_photo" type="file" accept="image/*" />
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
