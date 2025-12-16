"use client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavigationDrawer from "./NavigationDrawer";
import { ModeToggle } from "../theme/mode-toggle";
import { usePathname } from "next/navigation";
import { ReactNode, use } from "react";

const TITLE_MAP: { [key: string]: string } = {
  "/dashboard": "Dashboard",
};

const getPageTitle = (pathname: string): string => {
  return TITLE_MAP[pathname] || "Page Title";
};

export function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="border-b p-2 flex items-center justify-between sticky top-0 bg-background z-10">
      <div className="flex items-center space-x-4">
        <NavigationDrawer>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </NavigationDrawer>

        <div className="font-semibold text-sm">{pageTitle}</div>
      </div>

      <nav className="flex gap-2 items-center justify-between">
        <ModeToggle />
        <Button size={"sm"}>Click</Button>
      </nav>
    </header>
  );
}
