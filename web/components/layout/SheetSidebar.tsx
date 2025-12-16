"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebarContext } from "@/context/SidebarContext";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Home, LayoutGrid, LogIn } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
interface SheetSidebarProps {
  children?: React.ReactNode;
}

function SheetSidebar() {
  const { isOpen, closeSidebar } = useSidebarContext();
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeSidebar();
        }
      }}
    >
      <SheetContent side="left" className="w-64 sm:w-80 p-0 flex flex-col">
        <SheetHeader className="p-4 flex items-start gap-3">
          <VisuallyHidden>
            <SheetTitle className="hidden" />
            <SheetDescription className="hidden" />
          </VisuallyHidden>
          <LayoutGrid className="h-4 w-4" />
        </SheetHeader>

        <nav className="flex flex-col space-y-1 p-4 grow">
          <Link href="/pages/dashboard" passHref>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Home className="h-4 w-4" />
              <span>Home (Dashboard)</span>
            </Button>
          </Link>

          <Link href="/pages/auth" passHref>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Login / Full-Screen Page</span>
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t text-sm text-muted-foreground">
          Version 1.0
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(SheetSidebar);
