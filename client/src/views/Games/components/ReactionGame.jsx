import { playSound, SOUNDS } from "@/assets";
import { IS_DEV, THEME } from "@/constants/config";
import { Bug, Timer } from "lucide-react";
import { useEffect, useState } from "react";

const ReactionGame = ({ onFinish, difficulty = "medium" }) => {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);

  const initialTime =
    difficulty === "easy" ? 20 : difficulty === "hard" ? 10 : 12;
  const bugSizeClass =
    difficulty === "easy"
      ? "w-28 h-28"
      : difficulty === "hard"
        ? "w-12 h-12"
        : "w-16 h-16";
  const bugIconSize =
    difficulty === "easy" ? 56 : difficulty === "hard" ? 24 : 32;

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPlaying, setIsPlaying] = useState(false);

  const [appearTime, setAppearTime] = useState(null);
  const [sumResponseTime, setSumResponseTime] = useState(0);
  const [showDevMetrics, setShowDevMetrics] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && isPlaying) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      const PI =
        totalTaps === 0
          ? "0.0"
          : ((successfulHits / totalTaps) * 100).toFixed(1);
      const MRT =
        successfulHits === 0
          ? "0"
          : (sumResponseTime / successfulHits).toFixed(0);
      onFinish(successfulHits * 10, {
        MRT,
        PI,
        totalHits: successfulHits,
        totalTaps,
      });
    }
  }, [timeLeft, isPlaying]);

  const moveTarget = () => {
    setPosition({
      top: `${Math.random() * 70 + 10}%`,
      left: `${Math.random() * 70 + 10}%`,
    });
    setAppearTime(Date.now());
  };

  const handleStart = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
    moveTarget();
  };

  const handleContainerTap = (e) => {
    if (isPlaying && timeLeft > 0) {
      setTotalTaps((t) => t + 1);
    }
  };

  const handleBugTap = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isPlaying || timeLeft === 0) return;

    playSound(SOUNDS.click);

    if (appearTime) {
      const rt = Date.now() - appearTime;
      setSumResponseTime((prev) => prev + rt);
    }

    setTotalTaps((t) => t + 1);
    setSuccessfulHits((s) => s + 1);
    moveTarget();
  };

  const livePI =
    totalTaps === 0 ? "0.0" : ((successfulHits / totalTaps) * 100).toFixed(1);
  const liveMRT =
    successfulHits === 0 ? "0" : (sumResponseTime / successfulHits).toFixed(0);

  return (
    <div
      onPointerDown={handleContainerTap}
      className="flex flex-col items-center w-full h-[60vh] bg-white rounded-3xl border-4 border-dashed border-gray-200 relative overflow-hidden cursor-crosshair touch-none select-none"
    >
      {IS_DEV && (
        <div className="absolute top-4 right-4 z-50 flex flex-col items-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDevMetrics(!showDevMetrics);
            }}
            className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 opacity-30 hover:opacity-100 transition-opacity"
          >
            {showDevMetrics ? "Hide Dev Metrics" : "Show Dev Metrics"}
          </button>
          {showDevMetrics && (
            <div
              className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-2xl shadow-xl border border-gray-700 w-52 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-bold text-white mb-2 border-b border-gray-700 pb-2">
                Live Dev Metrics
              </div>
              <div className="mb-1 text-blue-300">Metric A: Precision</div>
              <div className="mb-1 ml-2">- Hits: {successfulHits}</div>
              <div className="mb-1 ml-2">- Selections: {totalTaps}</div>
              <div className="mb-1 mt-2 pt-2 border-t border-gray-700">
                PI: <span className="text-white font-bold">{livePI}%</span>
              </div>
              <div>
                MRT: <span className="text-white font-bold">{liveMRT}ms</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!isPlaying ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <button
            onClick={handleStart}
            className={`${THEME.primaryYellow} ${THEME.textBlack} font-black text-2xl px-10 py-5 rounded-full shadow-sm hover:scale-105 transition-all animate-bounce`}
          >
            START!
          </button>
        </div>
      ) : (
        <div className="absolute top-4 left-4 bg-gray-100 px-4 py-2 rounded-full font-bold text-gray-600 flex items-center gap-2 z-10 pointer-events-none">
          <Timer size={18} /> {timeLeft}s
        </div>
      )}

      <button
        onPointerDown={handleBugTap}
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
        }}
        className={`absolute ${bugSizeClass} bg-[#ff5e5e] rounded-full flex items-center justify-center shadow-lg active:scale-75 transition-transform transform-gpu will-change-transform`}
      >
        <Bug size={bugIconSize} className="text-white pointer-events-none" />
      </button>
    </div>
  );
};

export default ReactionGame;
