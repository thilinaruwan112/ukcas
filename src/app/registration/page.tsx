
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegistrationPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [instituteName, setInstituteName] = useState('');
    const [slug, setSlug] = useState('');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setInstituteName(name);
        setSlug(slugify(name));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        
        // Hardcode values for a public application
        formData.set('accreditation_status', 'Pending');
        formData.set('status', 'Active');
        formData.set('slug', slug); // Ensure slug is set from state
        
        // Use contact person's name as 'created_by' for backend tracking if needed
        const contactPerson = formData.get('contact_person') as string;
        formData.set('created_by', contactPerson || 'public_applicant');
        

        try {
            const response = await fetch('/api/institutes', {
                method: 'POST',
                // No token needed for public registration
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit application.');
            }

            toast({
                title: "Application Submitted!",
                description: "Thank you for your application. We will review your submission and be in touch shortly.",
            });
            
            // Optionally, redirect or clear the form
            e.currentTarget.reset();
            setInstituteName('');
            setSlug('');
            
        } catch (error) {
            const msg = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({ variant: 'destructive', title: "Submission Failed", description: msg });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center">
             <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BadgeCheck className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-headline">Institute Accreditation Application</CardTitle>
            <CardDescription>
              Complete the form below to begin the accreditation process with UKCAS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="name">Institute Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Global Tech University" required value={instituteName} onChange={handleNameChange} disabled={isLoading} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input id="contact_person" name="contact_person" placeholder="e.g., Dr. Jane Doe" required disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input id="email" name="email" type="email" placeholder="e.g., contact@university.com" required disabled={isLoading} />
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" placeholder="+44 123 456 7890" disabled={isLoading} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input id="website" name="website" type="url" placeholder="https://university.com" disabled={isLoading} />
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="address_line1">Address Line 1</Label>
                    <Input id="address_line1" name="address_line1" placeholder="e.g., 123 University Avenue" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                    <Input id="address_line2" name="address_line2" placeholder="e.g., Science Park" disabled={isLoading} />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" placeholder="e.g., London" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input id="state" name="state" placeholder="e.g., England" disabled={isLoading} />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Input id="postal_code" name="postal_code" placeholder="e.g., W1A 1AA" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" placeholder="e.g., United Kingdom" required disabled={isLoading} />
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="logo">Institute Logo</Label>
                        <Input id="logo" name="logo" type="file" accept="image/*" disabled={isLoading} />
                        <p className="text-xs text-muted-foreground">Upload your institute's official logo.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cover_image">Cover Image</Label>
                        <Input id="cover_image" name="cover_image" type="file" accept="image/*" disabled={isLoading} />
                        <p className="text-xs text-muted-foreground">Optional: A banner image for your profile page.</p>
                    </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
