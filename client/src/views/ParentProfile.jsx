import { useGetUser } from "@/hooks/user";
import {
  User,
  Camera,
  Mail,
  Lock,
  BadgeCheck,
  AlertCircle,
  Save,
  ShieldCheck,
} from "lucide-react";
import GamifiedLoader from "./Games/GamifiedLoader";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { SecurityForm } from "@/components/profile/SecurityForm";

const ParentProfile = () => {
  const userQuery = useGetUser({});

  const user = userQuery.data;

  if (userQuery.isLoading) return <GamifiedLoader />;

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Parent Profile
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your account settings and security
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <PersonalInfoForm user={user} />
        <SecurityForm />
      </div>
    </>
  );
};

export { ParentProfile };
