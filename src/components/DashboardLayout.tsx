import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

const MobileHeader = () => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center gap-3">
      <SidebarTrigger className="text-foreground hover:bg-primary/10 rounded-md p-1" />
      <div className="flex items-center gap-2">
        <img 
          src="/pralog-logo.png" 
          alt="Pralog Logo" 
          className="h-8 w-auto"
        />
        <span className="font-bold text-sm text-foreground">PRA Manutenção</span>
      </div>
    </div>
  );
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background flex-col">
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto flex flex-col min-h-screen">
            <MobileHeader />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
