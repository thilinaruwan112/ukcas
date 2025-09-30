
'use client';

import { useRouter, useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserCog, ArrowLeft, CalendarIcon, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { Student } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const countries = [
    { name: "Afghanistan", code: "AF" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "Andorra", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Argentina", code: "AR" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Bahamas", code: "BS" },
    { name: "Bangladesh", code: "BD" },
    { name: "Belgium", code: "BE" },
    { name: "Brazil", code: "BR" },
    { name: "Canada", code: "CA" },
    { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" },
    { name: "Denmark", code: "DK" },
    { name: "Egypt", code: "EG" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "Greece", code: "GR" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Italy", code: "IT" },
    { name: "Japan", code: "JP" },
    { name: "Kenya", code: "KE" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mexico", code: "MX" },
    { name: "Netherlands", code: "NL" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nigeria", code: "NG" },
    { name: "Norway", code: "NO" },
    { name: "Pakistan", code: "PK" },
    { name: "Philippines", code: "PH" },
    { name: "Portugal", code: "PT" },
    { name: "Qatar", code: "QA" },
    { name: "Russia", code: "RU" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Singapore", code: "SG" },
    { name: "South Africa", code: "ZA" },
    { name: "South Korea", code: "KR" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Thailand", code: "TH" },
    { name: "Turkey", code: "TR" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    { name: "Vietnam", code: "VN" },
];

async function getStudentById(id: string, token: string): Promise<Student | null> {
    try {
        const response = await fetch(`/api/students?id=${id}`, {
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

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dob, setDob] = useState<Date | undefined>();
  const [country, setCountry] = useState<string | undefined>();
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!id) {
        setError("Invalid student ID.");
        setIsFetching(false);
        return;
    }
    const token = localStorage.getItem('ukcas_token');
    if (!token) {
        router.push('/login');
        return;
    }
    getStudentById(id, token).then(data => {
        if (data) {
            setStudent(data);
            if (data.date_of_birth) {
              setDob(parseISO(data.date_of_birth));
            }
            if(data.country){
                setCountry(data.country);
            }
        } else {
            setError("Student not found.");
        }
    }).catch(err => {
        setError(err.message || "Failed to fetch student data.");
    }).finally(() => {
        setIsFetching(false);
    });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      
      const formData = new FormData(e.currentTarget);
      const token = localStorage.getItem('ukcas_token');
      const userData = localStorage.getItem('ukcas_user');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!token || !user || !student) {
          toast({ variant: 'destructive', title: "Authentication Error", description: "You must be logged in to perform this action." });
          setIsLoading(false);
          return;
      }
      
      // Add necessary fields for update
      formData.append('id', student.id);
      formData.append('institute_id', student.institute_id);
      formData.append('created_by', user.user_name || 'system');
      
      if (dob) {
        formData.set('date_of_birth', format(dob, 'yyyy-MM-dd'));
      }
       if (country) {
        formData.set('country', country);
      }

      try {
        const response = await fetch('/api/students', {
            method: 'POST', // Using POST for updates with FormData
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update student.');
        }

        toast({
            title: "Student Updated",
            description: `Details for "${formData.get('name')}" have been successfully updated.`,
        });

        router.push('/dashboard/students');

      } catch (error) {
        const msg = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: "Update Failed", description: msg });
        setIsLoading(false);
      }
  };

  if (isFetching) {
      return <EditStudentPageSkeleton />;
  }
  
  if (error) {
      return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-xl font-semibold">Error Loading Student</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
  }
  
  if (!student) {
      notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link href="/dashboard/students" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Student List
      </Link>
      <Card className="shadow-lg">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <UserCog className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-headline">Edit Student Details</CardTitle>
          <CardDescription>
            Update the information for "{student.name}".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Student's Full Name</Label>
                    <Input id="name" name="name" defaultValue={student.name} required disabled={isLoading} />
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
                             disabled={isLoading}
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
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email_address">Student's Email</Label>
                    <Input id="email_address" name="email_address" type="email" defaultValue={student.email_address} disabled={isLoading} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" name="phone_number" type="tel" defaultValue={student.phone_number} disabled={isLoading}/>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select onValueChange={setCountry} value={country} name="country" disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(c => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea id="address" name="address" defaultValue={student.address} placeholder="123 Example Street, London, EX1 2MP" disabled={isLoading} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="student_photo">Student Photo</Label>
                <Input id="student_photo" name="student_photo" type="file" accept="image/*" disabled={isLoading}/>
                 <p className="text-xs text-muted-foreground">Upload a new photo to replace the current one.</p>
            </div>
            
            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


function EditStudentPageSkeleton() {
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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-24 w-full" /></div>
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}
