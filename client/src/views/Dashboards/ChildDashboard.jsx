import { ASSETS } from "@/assets";
import InputField from "@/components/common/InputField";
import { THEME } from "@/constants/config";
import { useAppContext } from "@/context/AppContext";
import { Lock, Puzzle, Smile, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChildDashboard = () => {
  const navigate = useNavigate();
  const { activeChild, globalStars } = useAppContext();

  const childName = activeChild?.name || "Child";
  const childAvatar = activeChild?.avatar || ASSETS.avatars.child1;

  const [isTestLocked, setIsTestLocked] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitPassword, setExitPassword] = useState("");
  const [exitError, setExitError] = useState(false);

  const handleExit = (e) => {
    e.preventDefault();
    navigate("/parent-dashboard");
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`min-h-screen ${THEME.bgBeige} font-sans relative overflow-hidden`}
    >
      <div className="relative z-10 max-w-4xl mx-auto p-6 py-10 flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-12">
          <button
            onClick={() => setShowExitModal(true)}
            className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
          >
            <Lock size={18} /> Exit
          </button>
          <div className="bg-white px-5 py-3 rounded-full font-black text-xl flex items-center shadow-sm border-2 border-gray-100 text-gray-800">
            <Star size={22} className="mr-2 text-yellow-400 fill-yellow-400" />{" "}
            {globalStars} Stars
          </div>
        </header>

        <div
          className="text-center mb-16 animate-in slide-in-from-top duration-700 cursor-pointer"
          onClick={() => setIsTestLocked(!isTestLocked)}
          title="Click to toggle lock state"
        >
          <img
            src={childAvatar}
            className="w-32 h-32 rounded-full mx-auto border-8 border-white shadow-sm mb-6 bg-[#b6e3f4] object-cover"
            alt={childName}
          />
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
            Hi, {childName}! 👋
          </h1>
          <p className="text-xl text-gray-500 mt-4 font-bold">
            What are we playing today?
          </p>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            (Click name to toggle lock demo)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto mb-10 animate-in slide-in-from-bottom duration-700">
          <button
            disabled={isTestLocked}
            onClick={() =>
              !isTestLocked &&
              navigate("/game", {
                state: {
                  mode: "daily",
                  testQueue: [
                    "memory",
                    "reaction",
                    "color",
                    "hearing",
                    "drawing",
                  ],
                },
              })
            }
            className={`${isTestLocked ? "bg-gray-300 border-gray-400 cursor-not-allowed" : "bg-[#ff6b6b] border-[#e65a5a] hover:-translate-y-2"} text-white p-10 rounded-[2.5rem] shadow-sm transition-all flex flex-col items-center justify-center text-center group border-b-8`}
          >
            <div
              className={`${isTestLocked ? "bg-gray-400" : "bg-white/20 group-hover:scale-110"} p-6 rounded-full mb-6 transition-transform backdrop-blur-sm`}
            >
              {isTestLocked ? (
                <Lock className="w-14 h-14 text-white" />
              ) : (
                <Puzzle className="w-14 h-14 text-white" fill="currentColor" />
              )}
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">
              Daily Tests
            </h2>
            {isTestLocked ? (
              <div className="bg-gray-400/50 px-5 py-2.5 rounded-full mt-1">
                <p className="text-white font-bold text-lg flex items-center justify-center gap-2">
                  Next in {countdown}
                </p>
              </div>
            ) : (
              <p className="text-red-100 font-bold text-lg">
                Memory, Reaction & More!
              </p>
            )}
          </button>

          <button
            onClick={() => navigate("/free-play")}
            className="bg-[#4ade80] text-white p-10 rounded-[2.5rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center justify-center text-center group border-b-8 border-[#3bca70]"
          >
            <div className="bg-white/20 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
              <Smile className="w-14 h-14 text-white" fill="currentColor" />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">
              Free Play
            </h2>
            <p className="text-green-100 font-bold text-lg">
              Practice & Draw for Fun
            </p>
          </button>
        </div>
      </div>

      {/* Parent Gate Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`${THEME.cardWhite} w-full max-w-md p-8 md:p-10 relative animate-in zoom-in-95 duration-200`}
          >
            <button
              onClick={() => {
                setShowExitModal(false);
                setExitError(false);
                setExitPassword("");
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Parent Gate
              </h2>
              <p className="text-gray-500 mb-6 font-medium">
                Please enter your parent password to exit child mode.
              </p>

              <form onSubmit={handleExit} className="space-y-4">
                <InputField
                  type="password"
                  placeholder="Password (hint: 1234)"
                  icon={Lock}
                  value={exitPassword}
                  onChange={(e) => {
                    setExitPassword(e.target.value);
                    setExitError(false);
                  }}
                />
                {exitError && (
                  <p className="text-red-500 text-sm font-bold text-left px-4 -mt-2">
                    Incorrect password. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  className={`w-full mt-2 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${THEME.primaryYellowHover} transition-colors text-lg`}
                >
                  Verify & Exit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildDashboard;
