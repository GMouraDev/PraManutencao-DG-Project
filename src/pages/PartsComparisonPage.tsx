import { DashboardLayout } from "@/components/DashboardLayout";
import { PartsComparison } from "@/components/PartsComparison";

const PartsComparisonPage = () => {
  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Comparação de Preços de Peças
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Compare preços de peças entre diferentes oficinas e localizações
          </p>
        </div>
        <PartsComparison />
      </div>
    </DashboardLayout>
  );
};

export default PartsComparisonPage;

