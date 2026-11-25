
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import InstituteCard from '@/components/institutes/InstituteCard';
import type { ApiInstitute } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export default function FeaturedInstitutes() {
  const [institutes, setInstitutes] = useState<ApiInstitute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstitutes() {
      try {
        const response = await fetch('https://ukcas-server.payshia.com/institutes?featured=true');
        if (!response.ok) {
          throw new Error('Failed to fetch institutes');
        }
        const data = await response.json();
        setInstitutes(data);
      } catch (err) {
        // Handle error silently for this component
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchInstitutes();
  }, []);

  if (loading) {
    return (
        <section className="py-20 md:py-28 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured Institutes</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Discover some of the premier institutions accredited by UKCAS, recognized for their academic excellence.
                    </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
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
            </div>
        </section>
    );
  }

  if (institutes.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured Institutes</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover some of the premier institutions accredited by UKCAS, recognized for their academic excellence.
          </p>
        </div>
        
        <Carousel 
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
          <CarouselContent>
            {institutes.map((institute) => (
              <CarouselItem key={institute.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <InstituteCard institute={institute} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>

        <div className="mt-12 text-center">
            <Button asChild size="lg">
                <Link href="/institutes">View All Institutes</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
