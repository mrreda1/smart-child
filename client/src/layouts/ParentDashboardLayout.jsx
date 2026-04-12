import { ParentDashboardHeader } from "@/components/common/ParentDashboardHeader";
import { THEME } from "@/constants/config";
import { Outlet } from "react-router-dom";

const ParentDashboardLayout = () => {
  return (
    <div className={`min-h-screen ${THEME.bgBeige} relative flex flex-col`}>
      <ParentDashboardHeader />
      <main className="flex-1 w-full flex flex-col p-6 md:p-20 space-y-12 animate-in fade-in duration-500">
        <Outlet />
      </main>
    </div>
  );
};

export { ParentDashboardLayout };
