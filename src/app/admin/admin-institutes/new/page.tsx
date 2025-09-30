
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, ArrowLeft, Loader2, CalendarIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState } from 'react';
import { cn, slugify } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function NewInstitutePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [instituteName, setInstituteName] = useState('');
  const [slug, setSlug] = useState('');
  const [validUntilDate, setValidUntilDate] = useState<Date | undefined>();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      setInstituteName(name);
      setSlug(slugify(name));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const token = localStorage.getItem('ukcas_token');
       if (!token) {
          toast({ variant: 'destructive', title: "Authentication Error", description: "You must be logged in to create an institute." });
          setIsLoading(false);
          return;
      }
      
      // Append additional data that is not directly in the form
      if (validUntilDate) {
          formData.set('accreditation_valid_until', format(validUntilDate, 'yyyy-MM-dd'));
      }
       // Ensure slug is set from state
      formData.set('slug', slug);

      try {
          const response = await fetch('/api/institutes', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`},
              body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result.message || 'Failed to create institute.');
          }

          toast({
              title: "Institute Created",
              description: `The institute "${instituteName}" has been successfully created.`,
          });

          router.push('/admin/admin-institutes');

      } catch (error) {
          const msg = error instanceof Error ? error.message : "An unknown error occurred.";
          toast({ variant: 'destructive', title: "Creation Failed", description: msg });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/admin/admin-institutes" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Institute Management
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
             <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Building className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-headline">Create New Institute</CardTitle>
            <CardDescription>
              Fill out the form to add a new institute to the UKCAS network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Institute Name</Label>
                <Input id="name" name="name" placeholder="e.g., Global Tech University" required value={instituteName} onChange={handleNameChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" name="slug" placeholder="e.g., global-tech-university" required value={slug} onChange={(e) => setSlug(e.target.value)} />
                <p className="text-xs text-muted-foreground">This is auto-generated from the name but can be customized.</p>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="accreditation_status">Accreditation Status</Label>
                       <Select name="accreditation_status" defaultValue="Accredited">
                          <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Accredited">Accredited</SelectItem>
                              <SelectItem value="Conditional">Conditional</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="accreditation_valid_until">Accreditation Valid Until</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !validUntilDate && "text-muted-foreground")}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {validUntilDate ? format(validUntilDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={validUntilDate} onSelect={setValidUntilDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" name="email" type="email" placeholder="e.g., contact@university.com" required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="+44 123 456 7890" />
                </div>
              </div>

               <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" name="website" type="url" placeholder="https://university.com" />
                </div>
              
               <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input id="address_line1" name="address_line1" placeholder="e.g., 123 University Avenue" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                <Input id="address_line2" name="address_line2" placeholder="e.g., Science Park" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" placeholder="e.g., London" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" name="state" placeholder="e.g., England" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input id="postal_code" name="postal_code" placeholder="e.g., W1A 1AA" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" placeholder="e.g., United Kingdom" />
                </div>
              </div>


               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="logo">Institute Logo</Label>
                    <Input id="logo" name="logo" type="file" accept="image/*" />
                    <p className="text-xs text-muted-foreground">Upload the institute's official logo.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cover_image">Cover Image</Label>
                    <Input id="cover_image" name="cover_image" type="file" accept="image/*" />
                     <p className="text-xs text-muted-foreground">Upload a cover or banner image.</p>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Creating...' : 'Create Institute'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
