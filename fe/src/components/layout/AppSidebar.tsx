import { NavLink, useLocation } from "react-router-dom";
import {
  Store,
  LayoutDashboard,
  Package,
  Tags,
  MapPin,
  Users,
  ShoppingCart,
  CreditCard,
  MonitorSpeaker,
  Shield,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "POS Terminal", url: "/pos", icon: MonitorSpeaker },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const managementItems = [
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Outlets", url: "/outlets", icon: MapPin },
  { title: "Roles", url: "/roles", icon: Shield },
  { title: "Users", url: "/users", icon: Users },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Payments", url: "/payments", icon: CreditCard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary font-medium text-white"
      : "hover:bg-muted/50 text-foreground";

  const collapsed = state === "collapsed";

  return (
    <Sidebar className={`transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`} collapsible="icon">
      <SidebarContent className="bg-pos-surface border-r">
        <div className={`border-b p-4`}>
          <div className={`flex items-center ${collapsed ? 'justify-left' : 'gap-2'}`}>
            <Store className={`text-primary transition-all duration-200 h-8 w-8`} />
            <span className={`text-xl font-bold text-foreground transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
              POS Pro
            </span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={`transition-all duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className={`h-4 w-4`} />
                      <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={`transition-all duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className={`h-4 w-4`} />
                      <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}