
import { notFound } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import type { ApiInstitute } from '@/lib/types';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getInstituteBySlug(slug: string): Promise<ApiInstitute | null> {
    try {
        const response = await fetch(`https://ukcas-server.payshia.com/institutes?search=${slug.replace(/-/g, ' ')}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        // Assuming the first result is the most relevant one.
        // A more robust solution might require a dedicated API endpoint to fetch by slug.
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('Failed to fetch institute:', error);
        return null;
    }
}


export default async function InstituteDetailPage({ params }: { params: { slug: string } }) {
    const institute = await getInstituteBySlug(params.slug);

    if (!institute) {
        notFound();
    }

     const fullAddress = [institute.address_line1, institute.address_line2, institute.city, institute.state, institute.country]
    .filter(Boolean)
    .join(', ');

    return (
        <div className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                 <Card className="overflow-hidden">
                    <div className="relative h-48 w-full bg-muted">
                        {institute.cover_image && (
                            <Image
                                src={`https://ukcas-server.payshia.com/${institute.cover_image}`}
                                alt={`${institute.name} cover image`}
                                layout="fill"
                                className="object-cover"
                            />
                        )}
                    </div>
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-6 -mt-20">
                            <div className="relative flex-shrink-0">
                                <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center border-4 border-background shadow-lg">
                                    {institute.logo ? (
                                        <Image
                                            src={`https://ukcas-server.payshia.com/${institute.logo}`}
                                            alt={`${institute.name} logo`}
                                            width={128}
                                            height={128}
                                            className="rounded-full object-contain p-2"
                                        />
                                    ) : (
                                        <Building2 className="w-16 h-16 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 pt-20 sm:pt-0">
                                <h1 className="text-2xl md:text-3xl font-bold font-headline">{institute.name}</h1>
                                <p className="text-muted-foreground">{fullAddress}</p>
                                {institute.website && (
                                    <a href={institute.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 block">
                                        Visit Website
                                    </a>
                                )}
                            </div>
                            <div className="w-full sm:w-auto">
                                <Button size="lg" className="w-full">View Courses</Button>
                            </div>
                        </div>

                        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                            <InfoItem label="Accreditation Status" value={institute.accreditation_status} />
                            <InfoItem label="Valid Until" value={new Date(institute.accreditation_valid_until).toLocaleDateString()} />
                            <InfoItem label="Institute Type" value={institute.type} />
                            <InfoItem label="Email" value={institute.email} />
                            <InfoItem label="Phone" value={institute.phone} />
                            <InfoItem label="Country" value={institute.country} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    )
}
