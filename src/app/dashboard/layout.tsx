
'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  HardDrive,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Logo } from "@/components/Logo";

export default function InstituteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('ukcas_user');
    localStorage.removeItem('ukcas_token');
    localStorage.removeItem('ukcas_active_institute');
    localStorage.removeItem('ukcas_active_institute_id');
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4">
            <Logo variant="white" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" isActive={pathname === '/dashboard'}>
                  <HardDrive />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/courses" isActive={pathname.startsWith('/dashboard/courses')}>
                  <BookOpen />
                  Courses
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/students" isActive={pathname.startsWith('/dashboard/students')}>
                  <Users />
                  Students
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/certificates" isActive={pathname.startsWith('/dashboard/certificates')}>
                  <GraduationCap />
                  Certificates
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Settings />
                  Profile & Settings
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut />
                    Logout
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 space-y-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
