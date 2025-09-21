'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserCog, ArrowLeft } from "lucide-react";
import type { AdminUser, ApiInstitute } from '@/lib/types';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

async function getInstitutes(): Promise<ApiInstitute[]> {
    try {
        const response = await fetch(`https://ukcas-server.payshia.com/institutes`, {
             headers: {
                'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
            },
        });
        if (!response.ok) {
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch institutes:', error);
        return [];
    }
}

async function getUserById(id: string): Promise<AdminUser | null> {
    try {
        const response = await fetch(`/api/users?id=${id}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (data.status === 'success') {
             const user = data.data;
             return {
                id: user.id,
                instituteName: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.user_name,
                instituteAddress: [user.addressl1, user.addressl2, user.city].filter(Boolean).join(', '),
                registeredDate: user.created_at,
                email: user.email,
                balance: user.balance || 0,
            };
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}


export default function EditUserPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [user, setUser] = useState<AdminUser | null>(null);
    const [institutes, setInstitutes] = useState<ApiInstitute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInstitute, setSelectedInstitute] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (typeof id === 'string') {
            Promise.all([
                getUserById(id),
                getInstitutes()
            ]).then(([userData, instituteData]) => {
                if (userData) {
                    setUser(userData);
                }
                setInstitutes(instituteData);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., API call
        console.log("Saving data...", { selectedInstitute });
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
                                <Label htmlFor="instituteName">User/Institute Name</Label>
                                <Input id="instituteName" placeholder="e.g., Global Tech University" defaultValue={user.instituteName} />
                            </div>
                           <div className="space-y-2">
                                <Label htmlFor="institute">Assign Institute</Label>
                                 <Select onValueChange={setSelectedInstitute} value={selectedInstitute}>
                                    <SelectTrigger id="institute">
                                        <SelectValue placeholder="Select an institute" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutes.map(inst => (
                                            <SelectItem key={inst.id} value={inst.id}>
                                                {inst.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" placeholder="e.g., United Kingdom" defaultValue={user.instituteAddress.split(',').pop()?.trim() || ''} />
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
