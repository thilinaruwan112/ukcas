
'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import InstituteCard from '@/components/institutes/InstituteCard';
import type { ApiInstitute } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState<ApiInstitute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstitutes() {
      try {
        const response = await fetch('https://ukcas-server.payshia.com/institutes');
        if (!response.ok) {
          throw new Error('Failed to fetch institutes');
        }
        const data = await response.json();
        setInstitutes(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchInstitutes();
  }, []);
  
  const filteredInstitutes = searchTerm.length > 0 
    ? institutes.filter(institute =>
        institute.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const InstitutesSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
            <Card key={i}>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1 space-y-2">
                           <Skeleton className="h-5 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                     <div className="flex justify-end pt-2">
                        <Skeleton className="h-10 w-28" />
                    </div>
                </div>
            </Card>
        ))}
    </div>
  );

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-headline">Accredited Institutes</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our global network of trusted and accredited institutions.
          </p>
        </div>

        <div className="relative mb-8 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Search by institute name..."
                className="pl-12 h-14 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {loading && searchTerm.length > 0 && <InstitutesSkeleton />}

        {error && (
            <div className="text-center text-destructive bg-destructive/10 p-6 rounded-lg">
                <h3 className="font-semibold">Failed to load institutes</h3>
                <p>{error}</p>
            </div>
        )}

        {!loading && !error && searchTerm.length > 0 && (
            <>
                {filteredInstitutes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredInstitutes.map(institute => (
                            <InstituteCard key={institute.id} institute={institute} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center text-muted-foreground py-16">
                        <h3 className="text-xl font-semibold">No Institutes Found</h3>
                        <p>Your search for "{searchTerm}" did not match any institutes.</p>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}
