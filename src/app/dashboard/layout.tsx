
'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  HardDrive,
  Users,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function InstituteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader>
            <Link href="/dashboard">
              <span className="text-xl font-bold text-sidebar-foreground px-2">
                Institute Portal
              </span>
            </Link>
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
                <SidebarMenuButton href="/dashboard/students" isActive={pathname.startsWith('/dashboard/students')}>
                  <Users />
                  Students
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/certificates" isActive={pathname.startsWith('/dashboard/certificates')}>
                  <GraduationCap />
                  Issue Certificates
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
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-500/10"
                >
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
          <DashboardHeader />
          <main className="flex-1 p-6 space-y-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
