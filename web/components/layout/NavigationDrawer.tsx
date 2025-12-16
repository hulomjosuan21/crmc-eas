"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Home, LayoutGrid, LogIn, LucideIcon } from "lucide-react";
import Link from "next/link";
import { memo, ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Event",
    href: "/event",
    icon: LogIn,
  },
];

/* ------------------ COMPONENT ------------------ */
function NavigationDrawer({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="left" className="w-64 sm:w-80 p-0 flex flex-col">
        <SheetHeader className="flex items-start gap-3">
          <LayoutGrid className="h-4 w-4" />
          <SheetTitle>
            <VisuallyHidden>Main Application Navigation</VisuallyHidden>
          </SheetTitle>
          <SheetDescription>
            <VisuallyHidden>Main Application Description</VisuallyHidden>
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col space-y-1 px-4 grow">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="py-2 px-4 border-t text-xs text-muted-foreground">
          Version 1.0
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(NavigationDrawer);
