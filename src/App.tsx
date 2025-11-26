import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import Fleet from "./pages/Fleet";
import Documents from "./pages/Documents";
import PartsComparisonPage from "./pages/PartsComparisonPage";
import FleetPanel from "./pages/FleetPanel";
import MaintenanceFleet from "./pages/MaintenanceFleet";
import IdleFleet from "./pages/IdleFleet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="pramanutencao-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/fleet-panel" element={<FleetPanel />} />
            <Route path="/maintenance-fleet" element={<MaintenanceFleet />} />
            <Route path="/idle-fleet" element={<IdleFleet />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/parts" element={<PartsComparisonPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
