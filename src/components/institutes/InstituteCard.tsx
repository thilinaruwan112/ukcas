
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, CheckBadgeIcon } from '@heroicons/react/24/solid';
import type { ApiInstitute } from '@/lib/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';


export default function InstituteCard({ institute }: { institute: ApiInstitute }) {
    const fullAddress = [institute.address_line1, institute.address_line2, institute.city, institute.state, institute.country]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-6 flex flex-col flex-grow">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border">
                    {institute.logo ? (
                        <Image
                            src={`https://ukcas-server.payshia.com/${institute.logo}`}
                            alt={`${institute.name} logo`}
                            width={64}
                            height={64}
                            className="rounded-full object-contain p-1"
                        />
                    ) : (
                        <Building2 className="w-8 h-8 text-muted-foreground" />
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
                    <CheckBadgeIcon className="h-6 w-6 text-primary" />
                </div>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">{institute.name}</h3>
                <p className="text-sm text-muted-foreground">{institute.type}</p>
            </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2 mt-2 flex-grow">
            <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{fullAddress}</span>
            </div>
             {institute.website && (
                 <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <a href={institute.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                       {institute.website}
                    </a>
                </div>
             )}
        </div>
       
        <div className="mt-6 flex items-center justify-between">
             <Badge 
                className={cn({
                    'bg-green-100 text-green-800 border-green-300': institute.accreditation_status === 'Accredited',
                    'bg-yellow-100 text-yellow-800 border-yellow-300': institute.accreditation_status === 'Conditional',
                })}
             >
                {institute.accreditation_status}
            </Badge>
            <Button asChild variant="outline" size="sm">
                <Link href="#">
                    View Details
                </Link>
            </Button>
        </div>

      </CardContent>
    </Card>
  );
}
