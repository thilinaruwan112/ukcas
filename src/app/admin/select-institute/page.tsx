import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockInstitutes } from "@/lib/mock-data";
import { Building, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SelectInstitutePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Building className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Select an Institute</CardTitle>
                    <CardDescription>
                        Choose which institute you would like to manage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockInstitutes.map((institute) => (
                        <Card key={institute.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="relative w-20 h-20 mb-4">
                                     <Image src={institute.logoUrl} alt={`${institute.name} logo`} layout="fill" className="rounded-full object-contain" />
                                </div>
                                <h3 className="text-lg font-semibold">{institute.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{institute.country}</p>
                                <Button asChild className="w-full">
                                    <Link href="/dashboard">
                                        Manage
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
