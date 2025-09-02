import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BadgeCheck } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Institute Accreditation Application',
  description: 'Apply for UKCAS accreditation. Complete the form to begin the accreditation process for your institution and join our network of globally recognized schools.',
};

export default function RegistrationPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center">
             <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BadgeCheck className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-headline">Institute Accreditation Application</CardTitle>
            <CardDescription>
              Complete the form below to begin the accreditation process with UKCAS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instituteName">Institute Name</Label>
                  <Input id="instituteName" placeholder="e.g., Global Tech University" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="e.g., United Kingdom" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" placeholder="123 University Avenue, London" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input id="contactPerson" placeholder="e.g., Dr. Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" placeholder="e.g., contact@university.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Brief Description of Institute</Label>
                <Textarea id="description" placeholder="Provide a summary of your institution's mission, history, and strengths." />
              </div>
               <div className="space-y-2">
                <Label htmlFor="documentation">Upload Documentation (PDF)</Label>
                <Input id="documentation" type="file" accept=".pdf" />
                <p className="text-xs text-muted-foreground">Please upload your institutional charter, course catalogs, and quality assurance policies in a single PDF file.</p>
              </div>
              <Button type="submit" className="w-full h-12 text-base" size="lg">
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
