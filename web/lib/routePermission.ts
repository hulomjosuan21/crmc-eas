import {
  LucideIcon,
  Building,
  Users,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import routePermissionRawJson from "@/assets/data/jsons/route-permissions.json";

const iconMap: Record<string, LucideIcon> = {
  Building: Building,
  Users: Users,
  Settings: Settings,
  LayoutDashboard: LayoutDashboard,
};

type RoutePermission = {
  value: string;
  label: string;
  nav: {
    title: string;
    icon: LucideIcon;
    href: string;
  };
};

const routePermissions: RoutePermission[] = routePermissionRawJson.map(
  (item) => {
    const IconComponent = iconMap[item.nav.icon] || LayoutDashboard;

    return {
      ...item,
      nav: {
        ...item.nav,
        icon: IconComponent,
      },
    };
  }
);

const getAuthorizedRoutes = (userPermissions: string[]) => {
  if (!userPermissions || userPermissions.length === 0) {
    return [];
  }

  return routePermissions.filter((route) =>
    userPermissions.includes(route.value)
  );
};

export { routePermissions, getAuthorizedRoutes };
