import SheetSidebar from "@/components/layout/SheetSidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <SheetSidebar />
      {children}
    </SidebarProvider>
  );
}
