"use client";

import {
  BookOpen,
  Calendar,
  Command,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavDepartment } from "./navDepartment";
import { ModeToggle } from "../theme/mode-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { NavUserSkeleton } from "./navDepartmentSkeleton";

const navItem = {
  navMain: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "Event Calendar", icon: Calendar, href: "/event-calendar" },
    { title: "Manage Officer", icon: UsersRound, href: "/manage-officer" },
    { title: "Program", icon: BookOpen, href: "/program" },
  ],
};

export function AppSidebar() {
  const { authDepartment, isLoading, isError } = useAuth();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar collapsible="icon" className="relative">
      <div
        onClick={toggleSidebar}
        className="absolute inset-y-0 -right-1 z-20 w-2 cursor-ew-resize hover:bg-sidebar-accent/50 transition-colors"
        title="Toggle Sidebar"
      />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItem.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ModeToggle />
        {isLoading && authDepartment && <NavUserSkeleton />}

        {!isLoading && !isError && authDepartment && (
          <NavDepartment authDept={authDepartment} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
