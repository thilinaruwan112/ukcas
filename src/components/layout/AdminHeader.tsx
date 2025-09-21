
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { LogOut, Search, Settings, Building, ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from 'next/link';
import type { ApiInstitute } from '@/lib/types';

interface UserData {
    email: string;
    user_name: string;
    first_name?: string;
    last_name?: string;
    img_path?: string;
    acc_type?: string;
}

export default function AdminHeader() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [institute, setInstitute] = useState<ApiInstitute | null>(null);

    useEffect(() => {
        const userDataString = sessionStorage.getItem('ukcas_user');
        if (userDataString) {
            setUser(JSON.parse(userDataString));
        }

        const instituteDataString = sessionStorage.getItem('ukcas_active_institute');
        if (instituteDataString) {
            setInstitute(JSON.parse(instituteDataString));
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('ukcas_user');
        sessionStorage.removeItem('ukcas_token');
        sessionStorage.removeItem('ukcas_active_institute');
        sessionStorage.removeItem('ukcas_active_institute_id');
        router.push('/login');
    };

    const getInitials = () => {
        if (!user) return 'AD';
        const firstNameInitial = user.first_name ? user.first_name[0] : '';
        const lastNameInitial = user.last_name ? user.last_name[0] : '';
        const userNameInitial = user.user_name ? user.user_name[0] : '';
        return ((firstNameInitial + lastNameInitial) || userNameInitial).toUpperCase() || 'AD';
    }
    
    const getFullName = () => {
        if (!user) return "Admin Account";
        return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.user_name;
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
             <div className="flex items-center gap-4">
                {institute && user?.acc_type !== 'admin' && (
                    <Button variant="outline" asChild className="hidden sm:flex">
                        <Link href="/admin/select-institute">
                            <Building className="mr-2 h-4 w-4" />
                            <span className="truncate max-w-xs">{institute.name}</span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground"/>
                        </Link>
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-10 bg-card" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9 cursor-pointer">
                            {user?.img_path ? <AvatarImage src={user.img_path} alt={user.user_name} /> : null}
                            <AvatarFallback>{getInitials()}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{getFullName()}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                       <Link href="/admin/select-institute">
                         <Building className="mr-2 h-4 w-4" />
                         <span>Change Institute</span>
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
