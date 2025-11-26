import { LayoutDashboard, Wrench, Truck, FileText, BarChart3, Settings, AlertCircle } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, isRoute: true, hash: null },
  { title: "Painel Frota", url: "/fleet-panel", icon: BarChart3, isRoute: true, hash: null },
  { title: "Frota em Manutenção", url: "/maintenance-fleet", icon: Settings, isRoute: true, hash: null },
  { title: "Frota Ociosa", url: "/idle-fleet", icon: AlertCircle, isRoute: true, hash: null },
  { title: "Gestão de Frota", url: "/fleet", icon: Truck, isRoute: true, hash: null },
  { title: "Documentos Veículo", url: "/documents", icon: FileText, isRoute: true, hash: null },
  { title: "Comparação de Peças", url: "/parts", icon: Wrench, isRoute: true, hash: null },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (item: typeof menuItems[0]) => {
    if (item.hash) {
      const currentHash = location.hash;
      return location.pathname === "/" && (currentHash === `#${item.hash}` || (!currentHash && item.hash === "map"));
    }
    return location.pathname === item.url;
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-sidebar-border bg-sidebar z-50"
      side="left"
    >
      <div className={`relative flex items-center justify-center border-b border-sidebar-border bg-sidebar ${
        isCollapsed ? 'p-2' : 'p-3 sm:p-4'
      }`}>
        <SidebarTrigger className="absolute left-2 top-1/2 -translate-y-1/2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary rounded-md p-1.5 flex-shrink-0 transition-colors z-10" />
        {!isCollapsed && (
          <div className="flex flex-col items-center gap-2">
            <img 
              src="/pralog-logo.png" 
              alt="Pralog Logo" 
              className="h-8 sm:h-12 w-auto max-w-full"
            />
            <span className="font-bold text-xs sm:text-sm text-sidebar-foreground">PRA Manutenção</span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center w-full px-1">
            <img 
              src="/pralog-logo.png" 
              alt="Pralog Logo" 
              className="h-8 w-auto max-w-full object-contain"
            />
          </div>
        )}
      </div>
      
      <SidebarContent className="bg-sidebar flex flex-col">
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs sm:text-sm px-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.hash ? `${item.url}#${item.hash}` : item.url}
                        onClick={(e) => {
                          if (item.hash) {
                            e.preventDefault();
                            if (window.location.pathname !== "/") {
                              window.location.href = `/#${item.hash}`;
                            } else {
                              const element = document.getElementById(item.hash);
                              element?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }}
                        className={`flex items-center gap-2 sm:gap-3 text-sidebar-foreground transition-all rounded-md mx-1 px-2 py-2 text-sm ${
                          active 
                            ? "bg-primary text-sidebar-primary-foreground shadow-md font-medium" 
                            : "hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-sidebar-primary-foreground" : "text-primary"}`} />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Toggle Section */}
        <div className="mt-auto border-t border-sidebar-border flex-shrink-0">
          <SidebarGroup>
            <SidebarGroupContent>
              <div className={`${isCollapsed ? 'px-1.5 py-2.5' : 'px-2 py-3'}`}>
                <ThemeToggle />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
