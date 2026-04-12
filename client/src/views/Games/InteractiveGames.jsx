import { THEME } from "@/constants/config";
import { useAppContext } from "@/context/AppContext";
import {
  ArrowLeft,
  Brain,
  Ear,
  Hand,
  Palette,
  PenTool,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FreePlayMenu = () => {
  const navigate = useNavigate();
  const { globalStars } = useAppContext();
  const [difficulty, setDifficulty] = useState("easy");

  return (
    <div className={`min-h-screen ${THEME.bgBeige} font-sans relative`}>
      <div className="max-w-4xl mx-auto p-6 py-10 flex flex-col h-full">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate("/child-dashboard")}
            className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="bg-white px-5 py-2.5 rounded-full font-black text-lg flex items-center shadow-sm border-2 border-gray-100 text-gray-800">
            <Star size={20} className="mr-2 text-yellow-400 fill-yellow-400" />{" "}
            {globalStars} Stars
          </div>
        </header>

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Choose a Game!
          </h1>
        </div>

        {/* Difficulty Selector */}
        <div className="flex justify-center mb-8 animate-in fade-in duration-500">
          <div className="bg-white rounded-full p-1.5 shadow-sm flex border border-gray-100 max-w-md w-full">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-3 rounded-full font-black text-sm capitalize transition-all ${difficulty === level ? THEME.primaryYellow + " text-black shadow-md scale-105" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in slide-in-from-bottom duration-500">
          <button
            onClick={() =>
              navigate("/game", {
                state: { mode: "free", gameId: "memory", difficulty },
              })
            }
            className="bg-[#86D293] text-white p-8 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 border-[#5dbb6d]"
          >
            <div className="bg-white/20 p-5 rounded-full mb-4">
              <Brain size={48} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black mb-2">Memory Match</h2>
            <p className="text-green-100 font-bold text-sm">
              Find the hidden pairs!
            </p>
          </button>

          <button
            onClick={() =>
              navigate("/game", {
                state: { mode: "free", gameId: "reaction", difficulty },
              })
            }
            className="bg-[#ff5e5e] text-white p-8 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 border-[#e65a5a]"
          >
            <div className="bg-white/20 p-5 rounded-full mb-4">
              <Hand size={48} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black mb-2">Reaction Bug</h2>
            <p className="text-red-100 font-bold text-sm">
              Tap bug as fast as you can!
            </p>
          </button>

          <button
            onClick={() =>
              navigate("/game", {
                state: { mode: "free", gameId: "color", difficulty },
              })
            }
            className="bg-[#60A5FA] text-white p-8 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 border-[#3b82f6]"
          >
            <div className="bg-white/20 p-5 rounded-full mb-4">
              <Palette size={48} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black mb-2">Color Explorer</h2>
            <p className="text-blue-100 font-bold text-sm">
              Find shapes hidden in colors!
            </p>
          </button>

          <button
            onClick={() =>
              navigate("/game", {
                state: { mode: "free", gameId: "hearing", difficulty },
              })
            }
            className="bg-[#a78bfa] text-white p-8 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 border-[#8b5cf6]"
          >
            <div className="bg-white/20 p-5 rounded-full mb-4">
              <Ear size={48} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black mb-2">Sound Explorer</h2>
            <p className="text-purple-100 font-bold text-sm">
              Listen and match the sounds!
            </p>
          </button>

          <button
            onClick={() =>
              navigate("/game", {
                state: { mode: "free", gameId: "drawing", difficulty },
              })
            }
            className="bg-[#fbbf24] text-white p-8 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 border-[#f59e0b]"
          >
            <div className="bg-white/20 p-5 rounded-full mb-4">
              <PenTool size={48} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black mb-2">Creative Canvas</h2>
            <p className="text-yellow-100 font-bold text-sm">
              Draw and upload pictures!
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreePlayMenu;
