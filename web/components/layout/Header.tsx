"use client";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebarContext } from "@/context/SidebarContext";

interface HeaderProps {
  pageTitle: string;
  RightSlot?: ReactNode;
}

export function Header({ pageTitle, RightSlot }: HeaderProps) {
  const { openSidebar } = useSidebarContext();

  return (
    <header className="border-b p-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={openSidebar}>
          <Menu className="h-4 w-4" />
        </Button>

        <div className="font-semibold text-sm">{pageTitle}</div>
      </div>

      <nav className="space-x-4">{RightSlot}</nav>
    </header>
  );
}
