import type { ReactNode } from "react";
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { BadgeCheck, LogOut, Building2, Calendar, HardDrive, Newspaper, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader>
            <Link href="/admin">
              <span className="text-xl font-bold text-sidebar-foreground px-2">UKCAS Admin</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin" isActive>
                  <HardDrive />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/institutes">
                  <Building2 />
                  Institutes
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/certificates">
                  <BadgeCheck />
                  Certificates
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/blogs">
                  <Newspaper />
                  Blogs
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/events">
                  <Calendar />
                  Events
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/users">
                  <UserCircle />
                  User Maintenance
                </SidebarMenuButton>
              </SidebarMenuItem>
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
