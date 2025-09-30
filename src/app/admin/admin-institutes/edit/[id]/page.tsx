
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, ArrowLeft, Loader2, AlertTriangle, CalendarIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { ApiInstitute } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { cn, slugify } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';

async function getInstituteById(id: string): Promise<ApiInstitute | null> {
    try {
        const response = await fetch(`/api/institutes?id=${id}`);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch institute:', error);
        return null;
    }
}

function EditInstitutePageSkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-6 w-48" />
            <Card className="shadow-lg">
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
                    <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function EditInstitutePage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const { id } = params;
  
  const [institute, setInstitute] = useState<ApiInstitute | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [instituteName, setInstituteName] = useState('');
  const [slug, setSlug] = useState('');
  const [validUntilDate, setValidUntilDate] = useState<Date | undefined>();

  useEffect(() => {
    if (typeof id === 'string') {
        getInstituteById(id).then(data => {
            if (data) {
                setInstitute(data);
                setInstituteName(data.name);
                setSlug(data.slug);
                if (data.accreditation_valid_until) {
                    setValidUntilDate(parseISO(data.accreditation_valid_until));
                }
            } else {
                setError("Could not find an institute with this ID.");
            }
        }).catch(() => {
            setError("An error occurred while fetching institute data.");
        }).finally(() => {
            setLoading(false);
        })
    } else {
         setError("Invalid institute ID.");
         setLoading(false);
    }
  }, [id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      setInstituteName(name);
      setSlug(slugify(name));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      
      if (typeof id === 'string') {
        formData.append('id', id);
      }
      
      if (validUntilDate) {
          formData.set('accreditation_valid_until', format(validUntilDate, 'yyyy-MM-dd'));
      }
      formData.set('slug', slug);
      
      const token = localStorage.getItem('ukcas_token');
      const userStr = localStorage.getItem('ukcas_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!token || !user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You are not logged in.' });
        setIsSubmitting(false);
        return;
      }
      
      formData.set('created_by', user.user_name || 'admin');

      try {
        const response = await fetch('/api/institutes', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update institute.');
        }
        
        toast({
            title: "Institute Updated",
            description: `The details for "${instituteName}" have been successfully saved.`,
        });

        router.push('/admin/admin-institutes');
        router.refresh();

      } catch (error) {
        const msg = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: 'Update Failed', description: msg });
      } finally {
        setIsSubmitting(false);
      }
  };

  if (loading) {
      return <EditInstitutePageSkeleton />;
  }

  if (error || !institute) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                 <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                        <h1 className="text-2xl font-bold">Error Loading Institute</h1>
                        <p className="text-muted-foreground">{error || "The institute data could not be loaded."}</p>
                        <Button onClick={() => router.push('/admin/admin-institutes')}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
            <CardTitle className="text-2xl font-headline">Edit Institute Details</CardTitle>
            <CardDescription>
              Update the information for "{institute.name}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Institute Name</Label>
                <Input id="name" name="name" required value={instituteName} onChange={handleNameChange} disabled={isSubmitting} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} disabled={isSubmitting} />
                <p className="text-xs text-muted-foreground">This is auto-generated from the name but can be customized.</p>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="accreditation_status">Accreditation Status</Label>
                       <Select name="accreditation_status" defaultValue={institute.accreditation_status} disabled={isSubmitting}>
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
                            disabled={isSubmitting}
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
                        <Label htmlFor="type">Institute Type</Label>
                        <Input id="type" name="type" defaultValue={institute.type} placeholder="e.g., University" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={institute.status} disabled={isSubmitting}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={institute.email} required disabled={isSubmitting} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" defaultValue={institute.phone} placeholder="+44 123 456 7890" disabled={isSubmitting} />
                </div>
              </div>

               <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" name="website" type="url" defaultValue={institute.website} placeholder="https://university.com" disabled={isSubmitting} />
                </div>
              
               <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input id="address_line1" name="address_line1" defaultValue={institute.address_line1} placeholder="e.g., 123 University Avenue" disabled={isSubmitting} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                <Input id="address_line2" name="address_line2" defaultValue={institute.address_line2} placeholder="e.g., Science Park" disabled={isSubmitting} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" defaultValue={institute.city} placeholder="e.g., London" disabled={isSubmitting} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" name="state" defaultValue={institute.state} placeholder="e.g., England" disabled={isSubmitting} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input id="postal_code" name="postal_code" defaultValue={institute.postal_code} placeholder="e.g., W1A 1AA" disabled={isSubmitting} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" defaultValue={institute.country} placeholder="e.g., United Kingdom" disabled={isSubmitting} />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="logo">Institute Logo</Label>
                    <Input id="logo" name="logo" type="file" accept="image/*" disabled={isSubmitting} />
                    <p className="text-xs text-muted-foreground">Upload a new logo to replace the current one.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cover_image">Cover Image</Label>
                    <Input id="cover_image" name="cover_image" type="file" accept="image/*" disabled={isSubmitting} />
                     <p className="text-xs text-muted-foreground">Upload a new cover or banner image.</p>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}

    