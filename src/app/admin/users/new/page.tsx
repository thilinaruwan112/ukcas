import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export default function NewUserPage() {
  return (
    <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
             <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-headline">Create New Institute User</CardTitle>
            <CardDescription>
              Fill out the form below to create a new user account for an institute.
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
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" placeholder="e.g., contact@university.com" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="logo">Institute Logo</Label>
                    <Input id="logo" type="file" accept="image/*" />
                    <p className="text-xs text-muted-foreground">Upload the institute's official logo.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <Input id="coverImage" type="file" accept="image/*" />
                     <p className="text-xs text-muted-foreground">Upload a cover or banner image.</p>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 text-base" size="lg">
                Create User
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
