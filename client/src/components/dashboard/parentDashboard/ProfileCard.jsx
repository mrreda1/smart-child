import { THEME } from "@/constants/config";
import { BarChart2, LinkIcon, PenTool, Play, Trash2 } from "lucide-react";

export const ProfileCard = ({
  profile,
  role,
  onEdit,
  onDelete,
  onPlay,
  onViewReports,
}) => {
  const isLinked = role === "linked";

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden group">
      {isLinked ? (
        <div className="absolute top-4 right-4 text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
          <LinkIcon size={12} /> Linked
        </div>
      ) : (
        <div className="absolute top-4 left-4 text-xs font-bold text-[#4ade80] bg-green-50 px-3 py-1 rounded-full border border-green-100">
          Owner
        </div>
      )}

      {!isLinked && (
        <div className="absolute top-4 right-4 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(profile)}
            className="p-2 bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Profile"
          >
            <PenTool size={16} />
          </button>
          <button
            onClick={() => onDelete(profile)}
            className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Profile"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <img
        src={profile.avatar}
        className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-sm mb-4 object-cover"
        alt={profile.name}
      />
      <h3 className="text-2xl font-black text-gray-900 mb-1">
        {profile.name}
        {profile.age !== "-" && `, ${profile.age}`}
      </h3>
      <p className="text-sm text-gray-400 font-medium mb-6">
        Last active: {profile.lastActive}
      </p>

      <div className="flex flex-col w-full gap-3 mt-auto">
        <button
          onClick={() => onPlay(profile)}
          className={`w-full ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-3 rounded-full hover:bg-[#E5B427] transition-colors text-sm flex justify-center items-center gap-2`}
        >
          <Play size={16} fill="currentColor" /> Play Mode
        </button>
        <button
          onClick={() => onViewReports(profile)}
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-full transition-colors text-sm flex justify-center items-center gap-2"
        >
          <BarChart2 size={16} /> View Reports
        </button>
      </div>
    </div>
  );
};
