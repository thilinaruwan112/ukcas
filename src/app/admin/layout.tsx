
'use client';

import type { ReactNode } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { LogOut, Building2, Settings, UserCircle, Award, Users, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/layout/AdminHeader";
import { useState, useEffect } from "react";

interface UserData {
    acc_type: string;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userDataString = sessionStorage.getItem('ukcas_user');
    if (userDataString) {
        const parsedUser = JSON.parse(userDataString);
        setUser(parsedUser);
        
        const activeInstitute = sessionStorage.getItem('ukcas_active_institute_id');
        if (parsedUser.acc_type !== 'admin' && !activeInstitute && pathname !== '/admin/select-institute') {
            router.replace('/admin/select-institute');
        }

    } else {
        router.replace('/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const isAdmin = user?.acc_type === 'admin';
  
  if(loading) {
      return <div>Loading...</div>; // Or a proper skeleton loader
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader>
            <Link href={isAdmin ? "/admin/admin-institutes" : "/admin/select-institute"}>
              <span className="text-xl font-bold text-sidebar-foreground px-2">UKCAS Admin</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {isAdmin ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/admin-institutes" isActive={pathname.startsWith('/admin/admin-institutes')}>
                      <Building2 />
                      Institutes
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/users" isActive={pathname.startsWith('/admin/users')}>
                      <UserCircle />
                      User Maintenance
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/accreditation" isActive={pathname.startsWith('/admin/accreditation')}>
                      <Award />
                      Accreditation
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/select-institute" isActive={pathname.startsWith('/admin/select-institute')}>
                      <Library />
                      Select Institute
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/students" isActive={pathname.startsWith('/admin/students')}>
                      <Users />
                      Students
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                  <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                    <Settings />
                    Settings
                  </Button>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Button asChild variant="ghost" className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-500/10">
                    <Link href="/login">
                      <LogOut />
                      Logout
                    </Link>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
            <AdminHeader />
            <main className="flex-1 p-6 space-y-6">
              {children}
            </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
