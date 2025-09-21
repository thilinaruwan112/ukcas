
'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import type { ApiInstitute } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

function InstituteListItem({ institute }: { institute: ApiInstitute }) {
    const fullAddress = [institute.address_line1, institute.address_line2, institute.city, institute.state, institute.country]
    .filter(Boolean)
    .join(', ');

    return (
         <Link href={`/institutes/${institute.slug}`} className="block hover:bg-accent/50 rounded-lg p-3 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-white flex items-center justify-center border flex-shrink-0">
                     {institute.logo_path ? (
                        <Image
                            src={institute.logo_path}
                            alt={`${institute.name} logo`}
                            width={48}
                            height={48}
                            className="rounded-md object-contain p-1"
                        />
                    ) : (
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{institute.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{fullAddress}</p>
                </div>
            </div>
        </Link>
    )
}

export default function InstituteSearch() {
  const [allInstitutes, setAllInstitutes] = useState<ApiInstitute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredInstitutes = allInstitutes.filter(institute => 
    institute.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchTerm.length < 2) {
        setAllInstitutes([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    const timerId = setTimeout(() => {
        async function fetchInstitutes() {
          try {
            const response = await fetch(`https://ukcas-server.payshia.com/institutes?search=${searchTerm}`, {
                headers: {
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
                }
            });
            if (!response.ok) {
              throw new Error('Failed to fetch institutes');
            }
            const data = await response.json();
            setAllInstitutes(data);
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
    }, 300); // Debounce API call

    return () => clearTimeout(timerId);

  }, [searchTerm]);
  
  const InstitutesSkeleton = () => (
    <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
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

        <div className="max-w-2xl mx-auto">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by institute name..."
                    className="pl-12 h-14 text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                 {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
            </div>

            {searchTerm.length > 1 && (
                <div className="mt-4 border rounded-lg bg-card shadow-lg overflow-hidden">
                    <div className="p-2">
                        {loading && <InstitutesSkeleton />}

                        {error && (
                            <div className="text-center text-destructive p-4">
                                <p>Failed to load results.</p>
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                {filteredInstitutes.length > 0 ? (
                                    <div className="divide-y">
                                        {filteredInstitutes.map(institute => (
                                            <InstituteListItem key={institute.id} institute={institute} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground p-8">
                                        <h3 className="font-semibold">No Institutes Found</h3>
                                        <p className="text-sm">Your search for "{searchTerm}" did not match any institutes.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
