import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockInstitutes } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InstitutesPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-headline">Accredited Institutes</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our directory of globally recognized institutions that meet the UKCAS standard of excellence.
          </p>
        </div>

        <div className="mb-8 max-w-lg mx-auto">
          <Input type="search" placeholder="Search by name, country, or course..." className="h-12 text-base" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockInstitutes.map((institute) => (
            <Card key={institute.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <Image src={institute.logoUrl} alt={`${institute.name} logo`} width={60} height={60} className="rounded-full" data-ai-hint="university logo" />
                <div>
                  <CardTitle>{institute.name}</CardTitle>
                  <CardDescription>{institute.country}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{institute.description}</p>
                <h4 className="font-semibold text-sm mb-2">Key Courses:</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {institute.courses.slice(0, 2).map(course => <li key={course}>{course}</li>)}
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                 <Button variant="outline" className="w-full" asChild>
                    <Link href={`/institutes/${institute.id}`}>View Details</Link>
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
