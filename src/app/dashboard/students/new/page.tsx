
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export default function NewStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [dob, setDob] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState<string | undefined>("Sri Lanka");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const instituteId = localStorage.getItem('ukcas_active_institute_id');
      const token = localStorage.getItem('ukcas_token');
      const userData = localStorage.getItem('ukcas_user');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!instituteId || !token || !user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not find institute, user, or authentication token. Please log in again.",
        });
        setIsLoading(false);
        return;
      }
      
      formData.append('institute_id', instituteId);
      formData.append('created_by', user.user_name || 'system');
      formData.append('active_status', '1');
      
      if (dob) {
        formData.set('date_of_birth', format(dob, 'yyyy-MM-dd'));
      }
      
      if (country) {
        formData.set('country', country);
      }

      try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to register student.');
        }

        toast({
            title: "Student Registered",
            description: `${formData.get('name')} has been successfully added to your student records.`,
        });

        router.push('/dashboard/students');

      } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
          toast({
              variant: "destructive",
              title: "Registration Failed",
              description: errorMessage,
          });
      } finally {
          setIsLoading(false);
      }
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
                    <Input id="name" name="name" placeholder="e.g., John Doe" required disabled={isLoading} />
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
                    <Input type="hidden" name="date_of_birth" value={dob ? format(dob, 'yyyy-MM-dd') : ''} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email_address">Student's Email</Label>
                    <Input id="email_address" name="email_address" type="email" placeholder="e.g., john.doe@example.com" disabled={isLoading} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" name="phone_number" type="tel" placeholder="e.g., +44 1234 567890" disabled={isLoading}/>
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
                <Textarea id="address" name="address" placeholder="123 Example Street, London, EX1 2MP" disabled={isLoading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="id_card_front">ID Card (Front)</Label>
                    <Input id="id_card_front" name="id_card_front" type="file" disabled={isLoading}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="id_card_back">ID Card (Back)</Label>
                    <Input id="id_card_back" name="id_card_back" type="file" disabled={isLoading}/>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ol_certificate">O/L Certificate</Label>
                    <Input id="ol_certificate" name="ol_certificate" type="file" disabled={isLoading}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="al_certificate">A/L Certificate</Label>
                    <Input id="al_certificate" name="al_certificate" type="file" disabled={isLoading}/>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="student_photo">Student Photo</Label>
                <Input id="student_photo" name="student_photo" type="file" accept="image/*" disabled={isLoading}/>
            </div>
            
            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Registering...' : 'Register Student'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
