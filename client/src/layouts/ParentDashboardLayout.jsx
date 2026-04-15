import GamifiedLoader from "@/components/common/GamifiedLoader";
import { ParentDashboardHeader } from "@/components/common/ParentDashboardHeader";
import { THEME } from "@/constants/config";
import { useGetUser } from "@/hooks/user";
import { Outlet } from "react-router-dom";

const ParentDashboardLayout = () => {
  const user = useGetUser({});

  return (
    <div className={`min-h-screen ${THEME.bgBeige} relative flex flex-col`}>
      {user.isSuccess ? (
        <>
          <ParentDashboardHeader />
          <main className="flex-1 w-full flex flex-col p-6 md:p-20 space-y-12 animate-in fade-in duration-500">
            <Outlet />
          </main>
        </>
      ) : (
        <GamifiedLoader />
      )}
    </div>
  );
};

export { ParentDashboardLayout };
