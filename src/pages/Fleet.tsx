import { DashboardLayout } from "@/components/DashboardLayout";
import { FleetManagement } from "@/components/FleetManagement";

const Fleet = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <FleetManagement />
      </div>
    </DashboardLayout>
  );
};

export default Fleet;
