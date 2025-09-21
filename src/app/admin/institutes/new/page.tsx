
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function NewInstitutePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const instituteName = formData.get('instituteName') as string;

      // In a real app, you would submit this data to your backend API
      console.log('Creating new institute:', {
          name: instituteName,
          country: formData.get('country'),
          address: formData.get('address'),
          email: formData.get('email'),
      });

      toast({
          title: "Institute Created",
          description: `The institute "${instituteName}" has been successfully created.`,
      });

      router.push('/admin/institutes');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/admin/institutes" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instituteName">Institute Name</Label>
                  <Input id="instituteName" name="instituteName" placeholder="e.g., Global Tech University" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" placeholder="e.g., United Kingdom" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" name="address" placeholder="123 University Avenue, London" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" name="email" type="email" placeholder="e.g., contact@university.com" required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" name="website" type="url" placeholder="https://university.com" />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="logo">Institute Logo</Label>
                    <Input id="logo" name="logo" type="file" accept="image/*" />
                    <p className="text-xs text-muted-foreground">Upload the institute's official logo.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <Input id="coverImage" name="coverImage" type="file" accept="image/*" />
                     <p className="text-xs text-muted-foreground">Upload a cover or banner image.</p>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 text-base" size="lg">
                Create Institute
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
