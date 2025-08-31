'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserCog, ArrowLeft } from "lucide-react";
import { mockAdminUsers } from '@/lib/mock-data';
import type { AdminUser } from '@/lib/types';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditUserPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [user, setUser] = useState<AdminUser | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Simulate fetching data
            const foundUser = mockAdminUsers.find(u => u.id === id);
            setTimeout(() => {
                if (foundUser) {
                    setUser(foundUser);
                }
                setIsLoading(false);
            }, 500);
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., API call
        toast({
            title: "User Updated",
            description: `Details for ${user?.instituteName} have been saved.`,
        });
        router.push('/admin/users');
    };
    
    if (isLoading) {
        return <EditUserPageSkeleton />;
    }

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Link href="/admin/users" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to User Maintenance
            </Link>

            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <UserCog className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Edit Institute User</CardTitle>
                    <CardDescription>
                        Update the details for an existing institute user account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="instituteName">Institute Name</Label>
                                <Input id="instituteName" placeholder="e.g., Global Tech University" defaultValue={user.instituteName} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" placeholder="e.g., United Kingdom" defaultValue={user.instituteAddress.split(',').pop()?.trim() || ''} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Full Address</Label>
                            <Input id="address" placeholder="123 University Avenue, London" defaultValue={user.instituteAddress} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Contact Email</Label>
                                <Input id="email" type="email" placeholder="e.g., contact@university.com" defaultValue={user.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input id="password" type="password" placeholder="Leave blank to keep current password" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="logo">Institute Logo</Label>
                                <Input id="logo" type="file" accept="image/*" />
                                <p className="text-xs text-muted-foreground">Upload a new logo to replace the current one.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coverImage">Cover Image</Label>
                                <Input id="coverImage" type="file" accept="image/*" />
                                <p className="text-xs text-muted-foreground">Upload a new cover image.</p>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base" size="lg">
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


function EditUserPageSkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-6 w-48" />
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-5 w-80 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}
