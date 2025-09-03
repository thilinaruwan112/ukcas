import { notFound } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import type { ApiInstitute } from '@/lib/types';
import Image from 'next/image';
import { Building2, Globe, Link as LinkIcon, Mail, Phone, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

async function getInstituteBySlug(slug: string): Promise<ApiInstitute | null> {
    try {
        const response = await fetch(`https://ukcas-server.payshia.com/institutes/slug/${slug}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch institute:', error);
        return null;
    }
}

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const institute = await getInstituteBySlug(params.slug);

  if (!institute) {
    return {
      title: 'Institute Not Found'
    }
  }

  const fullAddress = [institute.address_line1, institute.address_line2, institute.city, institute.state, institute.country]
    .filter(Boolean)
    .join(', ');
  
  const description = `View accreditation details for ${institute.name}, located in ${fullAddress}. Status: ${institute.accreditation_status}.`;
  
  const imageUrl = institute.cover_image_path || institute.logo_path;

  return {
    title: `${institute.name} | UKCAS Accredited`,
    description: description,
     openGraph: {
      title: `${institute.name} | UKCAS Accredited`,
      description: description,
      images: imageUrl ? [
        {
          url: imageUrl,
          alt: `${institute.name} Image`,
        },
      ] : [{ url: 'https://content-provider.pharmacollege.lk/ukcas/logo-long-1.png' }],
    },
     twitter: {
      card: 'summary_large_image',
      title: `${institute.name} | UKCAS Accredited`,
      description: description,
      images: imageUrl ? [imageUrl] : ['https://content-provider.pharmacollege.lk/ukcas/logo-long-1.png'],
    }
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
                    <div className="relative h-48 md:h-64 w-full bg-muted">
                        {institute.cover_image_path ? (
                            <Image
                                src={institute.cover_image_path}
                                alt={`${institute.name} cover image`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-primary/10 to-accent/10"></div>
                        )}
                         <div className="absolute -bottom-16 left-6">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-background flex items-center justify-center border-4 border-background shadow-lg">
                                {institute.logo_path ? (
                                    <Image
                                        src={institute.logo_path}
                                        alt={`${institute.name} logo`}
                                        width={160}
                                        height={160}
                                        className="rounded-full object-contain p-2"
                                    />
                                ) : (
                                    <Building2 className="w-16 h-16 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    </div>
                    <CardContent className="pt-24 px-6 pb-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-end">
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold font-headline">{institute.name}</h1>
                                <p className="text-muted-foreground mt-1">{fullAddress}</p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                {institute.website && (
                                    <Button asChild>
                                        <a href={institute.website} target="_blank" rel="noopener noreferrer">
                                            <LinkIcon className="mr-2 h-4 w-4" />
                                            Visit Website
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                            <InfoItem label="Institute ID" value={institute.code} icon={<Fingerprint className="w-4 h-4 text-muted-foreground" />}/>
                            <InfoItem label="Accreditation Status" value={institute.accreditation_status} />
                            <InfoItem label="Valid Until" value={new Date(institute.accreditation_valid_until).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} />
                            <InfoItem label="Institute Type" value={institute.type} />
                            <InfoItem label="Email" value={institute.email} icon={<Mail className="w-4 h-4 text-muted-foreground" />}/>
                            <InfoItem label="Phone" value={institute.phone} icon={<Phone className="w-4 h-4 text-muted-foreground" />} />
                            <InfoItem label="Country" value={institute.country} icon={<Globe className="w-4 h-4 text-muted-foreground" />} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoItem({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
    if (!value) return null;
    return (
        <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-muted-foreground text-xs">{label}</p>
            <div className="flex items-center gap-2 mt-1">
                {icon}
                <p className="font-semibold">{value}</p>
            </div>
        </div>
    )
}
