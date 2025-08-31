'use client';

import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search, LogOut, Settings, Building } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from 'next/link';

export default function DashboardHeader() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-end border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-10 bg-card" />
                </div>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9 cursor-pointer">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Institute Logo" />
                        <AvatarFallback>GT</AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Global Tech University</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                       <Link href="/admin/select-institute">
                         <Building className="mr-2 h-4 w-4" />
                         <span>Change Institute</span>
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
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
