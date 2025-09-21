
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { ApiInstitute } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
        getInstituteById(id).then(data => {
            if (data) {
                setInstitute(data);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const instituteName = formData.get('instituteName') as string;

      console.log('Updating institute:', Object.fromEntries(formData.entries()));

      toast({
          title: "Institute Updated",
          description: `The details for "${instituteName}" have been successfully saved.`,
      });

      router.push('/admin/institutes');
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
                        <Button onClick={() => router.push('/admin/institutes')}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
            <CardTitle className="text-2xl font-headline">Edit Institute Details</CardTitle>
            <CardDescription>
              Update the information for "{institute.name}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instituteName">Institute Name</Label>
                  <Input id="instituteName" name="instituteName" defaultValue={institute.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" defaultValue={institute.country} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" name="address" defaultValue={institute.address_line1} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={institute.email} required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" name="website" type="url" defaultValue={institute.website} />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="logo">Institute Logo</Label>
                    <Input id="logo" name="logo" type="file" accept="image/*" />
                    <p className="text-xs text-muted-foreground">Upload a new logo to replace the current one.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <Input id="coverImage" name="coverImage" type="file" accept="image/*" />
                     <p className="text-xs text-muted-foreground">Upload a new cover or banner image.</p>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 text-base" size="lg">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}

