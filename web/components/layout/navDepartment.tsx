import { BadgeCheck, ChevronsUpDown, Loader2, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/use-logout";
import { AuthDepartment } from "@/types/auth";

export function NavDepartment({ authDept }: { authDept: AuthDepartment }) {
  const { mutate: logout, isPending } = useLogout();

  const isAbsoluteUrl = (url?: string) => !!url && /^(https?:)?\/\//i.test(url);

  const resolveAvatarSrc = (src: string | null) => {
    if (!src) return undefined;

    if (isAbsoluteUrl(src)) return src;

    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}`;
  };

  const getInitials = (name?: string) => {
    if (!name) return "D";

    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={resolveAvatarSrc(authDept.authImage)}
                  alt={authDept.authType}
                />
                <AvatarFallback className="rounded-lg">
                  {getInitials(authDept.authName)}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {authDept.authName}
                </span>
                <span className="truncate text-xs">{authDept.authEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={resolveAvatarSrc(authDept.authImage)}
                    alt={authDept.authType}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(authDept.authName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {authDept.authName}
                  </span>
                  <span className="truncate text-xs">{authDept.authEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Department
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut />
                  Log out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
