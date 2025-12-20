import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="md:h-8 md:p-0 cursor-default"
          disabled
        >
          <Skeleton className="h-8 w-8 rounded-lg" />

          <div className="grid flex-1 gap-1 text-left">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>

          <Skeleton className="ml-auto h-4 w-4 rounded-sm" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
