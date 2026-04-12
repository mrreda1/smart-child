import { playSound, SOUNDS } from "@/assets";
import Confetti from "@/components/common/Confetti";
import { IS_DEV, THEME } from "@/constants/config";
import { useAppContext } from "@/context/AppContext";
import {
  ArrowLeft,
  BarChart2,
  Brain,
  Ear,
  Hand,
  Palette,
  PenTool,
  Play,
  Puzzle,
  RotateCcw,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MemoryGame from "./components/MemoryGame";
import ReactionGame from "./components/ReactionGame";
import ColorGame from "./components/ColorGame";
import HearingGame from "./components/HearingGame";
import DrawingGame from "./components/DrawingGame";

const GamePlay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const { globalStars, setGlobalStars, testDifficulties, setTestDifficulties } =
    useAppContext();

  const mode = state.mode || "free";
  const testQueue = state.testQueue || [];

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [dailyResults, setDailyResults] = useState({});
  const [sessionStarsEarned, setSessionStarsEarned] = useState(0);
  const [hasStartedDaily, setHasStartedDaily] = useState(false);

  const currentGameId =
    mode === "daily" ? testQueue[currentTestIndex] : state.gameId;

  const difficultyRef = useRef(
    mode === "daily"
      ? testDifficulties[currentGameId] || "easy"
      : state.difficulty || "easy",
  );
  const prevTestIndexRef = useRef(currentTestIndex);

  if (currentTestIndex !== prevTestIndexRef.current) {
    difficultyRef.current =
      mode === "daily"
        ? testDifficulties[currentGameId] || "easy"
        : state.difficulty || "easy";
    prevTestIndexRef.current = currentTestIndex;
  }
  const currentDifficulty = difficultyRef.current;

  const [gameOver, setGameOver] = useState(false);
  const [devMetrics, setDevMetrics] = useState(null);
  const [isFestival, setIsFestival] = useState(false);

  if (!currentGameId) return null;

  const gameDetails = {
    memory: {
      title: "Memory Match",
      color: "bg-[#86D293]",
      textColor: "text-[#86D293]",
      icon: <Brain size={24} fill="currentColor" />,
    },
    reaction: {
      title: "Reaction Bug",
      color: "bg-[#ff5e5e]",
      textColor: "text-[#ff5e5e]",
      icon: <Hand size={24} fill="currentColor" />,
    },
    color: {
      title: "Color Explorer",
      color: "bg-[#60A5FA]",
      textColor: "text-[#60A5FA]",
      icon: <Palette size={24} fill="currentColor" />,
    },
    hearing: {
      title: "Sound Explorer",
      color: "bg-[#a78bfa]",
      textColor: "text-[#a78bfa]",
      icon: <Ear size={24} fill="currentColor" />,
    },
    drawing: {
      title: "Creative Canvas",
      color: "bg-[#fbbf24]",
      textColor: "text-[#fbbf24]",
      icon: <PenTool size={24} fill="currentColor" />,
    },
  }[currentGameId];

  const handleFinish = (score, metrics) => {
    let isGoodGame = false;

    if (metrics) {
      if (metrics.type === "drawing") {
        isGoodGame = true;
      } else if (metrics.RedProfile !== undefined) {
        const arValue = parseFloat(metrics.AR);
        const rgbSum =
          parseFloat(metrics.RedProfile) +
          parseFloat(metrics.GreenProfile) +
          parseFloat(metrics.BlueProfile);
        isGoodGame = arValue >= 50 && rgbSum >= 50;
      } else if (metrics.ISR !== undefined) {
        const isrValue = parseFloat(metrics.ISR);
        const aarlValue = parseFloat(metrics.AARL);
        isGoodGame = isrValue >= 50 && aarlValue > 0 && aarlValue <= 3.0;
      } else if (metrics.AR !== undefined) {
        const arValue = parseFloat(metrics.AR);
        const arlValue = parseFloat(metrics.ARL);
        isGoodGame = arValue >= 50 && arlValue > 0 && arlValue <= 2.5;
      } else if (metrics.MRT !== undefined) {
        const piValue = parseFloat(metrics.PI);
        const mrtValue = parseFloat(metrics.MRT);
        isGoodGame = piValue >= 50 && mrtValue > 0 && mrtValue <= 1500;
      }
    } else {
      isGoodGame = score > 50;
    }

    if (mode === "free") {
      setDevMetrics(metrics);
      setGameOver(true);
      if (isGoodGame) {
        setIsFestival(true);
        playSound(SOUNDS.win);
      }
    } else if (mode === "daily") {
      let starDelta = 0;
      if (metrics?.type === "drawing") {
        starDelta = 2;
        setIsFestival(true);
        playSound(SOUNDS.win);
      } else if (isGoodGame) {
        starDelta =
          currentDifficulty === "hard"
            ? 7
            : currentDifficulty === "medium"
              ? 5
              : 3;
        setIsFestival(true);
        playSound(SOUNDS.win);
      } else {
        starDelta =
          currentDifficulty === "hard"
            ? -3
            : currentDifficulty === "medium"
              ? -2
              : -1;
      }

      const newSessionTotal = sessionStarsEarned + starDelta;
      setSessionStarsEarned(newSessionTotal);

      if (currentGameId !== "drawing") {
        setTestDifficulties((prev) => {
          const diff = prev[currentGameId];
          let newDiff = diff;
          if (isGoodGame) {
            if (diff === "easy") newDiff = "medium";
            else if (diff === "medium") newDiff = "hard";
          } else {
            if (diff === "hard") newDiff = "medium";
            else if (diff === "medium") newDiff = "easy";
          }
          return { ...prev, [currentGameId]: newDiff };
        });
      }

      const updatedResults = {
        ...dailyResults,
        [currentGameId]: { score, metrics, starDelta },
      };
      setDailyResults(updatedResults);

      if (currentTestIndex < testQueue.length - 1) {
        if (isGoodGame || metrics?.type === "drawing") {
          setTimeout(() => {
            setIsFestival(false);
            setCurrentTestIndex((prev) => prev + 1);
          }, 2500);
        } else {
          setCurrentTestIndex((prev) => prev + 1);
        }
      } else {
        setDevMetrics(updatedResults);
        const endDailySequence = () => {
          setGlobalStars((prev) => Math.max(0, prev + newSessionTotal));
          setGameOver(true);
        };
        if (isGoodGame || metrics?.type === "drawing") {
          setTimeout(() => {
            endDailySequence();
          }, 2500);
        } else {
          endDailySequence();
        }
      }
    }
  };

  if (gameOver) {
    let feedbackMessage = "Great Practice!";
    if (mode === "daily") {
      feedbackMessage = "Daily Tests Complete! 🌟";
    } else if (devMetrics) {
      if (devMetrics.type === "drawing") {
        feedbackMessage = "Beautiful Artwork! 🎨";
      } else if (devMetrics.RedProfile !== undefined) {
        const arValue = parseFloat(devMetrics.AR);
        if (arValue >= 100) feedbackMessage = "Eagle Eye! 🦅";
        else if (arValue >= 80) feedbackMessage = "Sharp Vision! 👁️";
        else if (arValue >= 50) feedbackMessage = "Great Spotting! 🎨";
        else feedbackMessage = "Good Try! Look closer next time! 💪";
      } else if (devMetrics.ISR !== undefined) {
        const isrValue = parseFloat(devMetrics.ISR);
        if (isrValue >= 100) feedbackMessage = "Perfect Hearing! 🦇";
        else if (isrValue >= 80) feedbackMessage = "Super Listener! 👂";
        else if (isrValue >= 50)
          feedbackMessage = "Great Job! Keep Listening! 👍";
        else feedbackMessage = "Good Try! Listen closely next time! 💪";
      } else if (devMetrics.AR !== undefined) {
        const arValue = parseFloat(devMetrics.AR);
        if (arValue >= 100) feedbackMessage = "Perfect Memory! 🌟";
        else if (arValue >= 80) feedbackMessage = "Amazing Recall! 🧠";
        else if (arValue >= 50)
          feedbackMessage = "Great Job! Keep Practicing! 👍";
        else feedbackMessage = "Good Try! You'll get it next time! 💪";
      } else if (devMetrics.PI !== undefined) {
        const piValue = parseFloat(devMetrics.PI);
        const mrtValue = parseFloat(devMetrics.MRT);
        if (piValue >= 80 && mrtValue < 1000)
          feedbackMessage = "Lightning Fast Precision! ⚡";
        else if (piValue >= 50 && mrtValue < 1500)
          feedbackMessage = "Great Reflexes! 🏃";
        else feedbackMessage = "Nice Try! Let's play again! 💪";
      }
    }

    return (
      <div
        className={`min-h-screen ${THEME.bgBeige} flex flex-col items-center justify-center p-6 relative overflow-y-auto`}
      >
        {isFestival && <Confetti />}
        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full animate-in zoom-in duration-500 relative z-10 my-8">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            {feedbackMessage}
          </h1>

          {mode === "daily" ? (
            <div className="mb-8">
              <p className="text-xl text-gray-500 font-bold mb-2">
                Today's Session Result:
              </p>
              <p className="text-3xl font-black text-gray-800">
                {sessionStarsEarned > 0 ? "+" : ""}
                {sessionStarsEarned}{" "}
                <Star
                  size={28}
                  className="inline text-yellow-500 fill-yellow-500 mb-1"
                />
              </p>
              <p className="text-sm font-bold text-gray-400 mt-2">
                Total: {globalStars} Stars
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-400 font-bold mb-8">
              Practice makes perfect!
            </p>
          )}

          {IS_DEV && devMetrics && mode === "free" && (
            <div className="mb-8 bg-gray-50 border-2 border-dashed border-gray-200 p-4 rounded-2xl text-left">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <BarChart2 size={14} /> Dev Purpose Metrics
              </p>
              <div className="space-y-2 font-mono text-sm">
                {devMetrics.type === "drawing" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Test Type:</span>
                      <span className="font-bold text-gray-800">
                        Drawing Output (PNG)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Child Expression:</span>
                      <span className="font-bold text-gray-800">
                        {devMetrics.expression}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <img
                        src={devMetrics.imageBase64}
                        alt="Child's Drawing"
                        className="w-32 h-32 border border-gray-300 rounded-xl shadow-sm object-cover"
                      />
                    </div>
                  </>
                ) : devMetrics.RedProfile !== undefined ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Color Accuracy (AR):
                      </span>
                      <span className="font-bold text-gray-800">
                        {devMetrics.AR}%
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t text-xs text-red-500">
                      <span className="font-bold">Red Profile:</span>
                      <span className="font-black">
                        {devMetrics.RedProfile}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-green-500">
                      <span className="font-bold">Green Profile:</span>
                      <span className="font-black">
                        {devMetrics.GreenProfile}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-blue-500">
                      <span className="font-bold">Blue Profile:</span>
                      <span className="font-black">
                        {devMetrics.BlueProfile}%
                      </span>
                    </div>
                  </>
                ) : devMetrics.ISR !== undefined ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Success Rate (ISR):</span>
                      <span className="font-bold text-gray-800">
                        {devMetrics.ISR}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg Latency (AARL):</span>
                      <span className="font-bold text-gray-800">
                        {devMetrics.AARL}s
                      </span>
                    </div>
                    <div className="flex justify-between border-t mt-2 pt-2 text-xs text-gray-400">
                      <span className="font-bold">
                        Correct: {devMetrics.correctIdentifications}
                      </span>
                      <span className="font-bold">
                        Total Sounds: {devMetrics.totalPlayed}
                      </span>
                    </div>
                  </>
                ) : devMetrics.AR !== undefined ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hits (Pairs Found):</span>
                      <span className="font-bold text-gray-800">
                        {devMetrics.targetPairs}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Selections (Moves):</span>
                      <span className="font-bold text-gray-800">
                        {devMetrics.N}
                      </span>
                    </div>
                    <div className="flex justify-between border-t mt-2 pt-2">
                      <span className="text-gray-500 font-bold">
                        Accuracy (AR):
                      </span>
                      <span className="font-black text-blue-600">
                        {devMetrics.AR}%
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Successful Hits:</span>
                      <span className="font-bold text-gray-800">
                        {devMetrics.totalHits}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Selections:</span>
                      <span className="font-bold text-gray-800">
                        {devMetrics.totalTaps}
                      </span>
                    </div>
                    <div className="flex justify-between border-t mt-2 pt-2">
                      <span className="text-gray-500 font-bold">
                        Precision (PI):
                      </span>
                      <span className="font-black text-red-600">
                        {devMetrics.PI}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">
                        Mean RT (MRT):
                      </span>
                      <span className="font-black text-green-600">
                        {devMetrics.MRT}ms
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {IS_DEV && devMetrics && mode === "daily" && (
            <div className="mb-8 bg-gray-900 p-4 rounded-2xl text-left overflow-hidden">
              <p className="text-xs font-black text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1 border-b border-gray-700 pb-2">
                <BarChart2 size={14} /> Final API Data Object
              </p>
              <div className="max-h-48 overflow-y-auto">
                <pre className="font-mono text-[10px] text-gray-300">
                  {JSON.stringify(
                    devMetrics,
                    (key, val) =>
                      key === "imageBase64" ? "[Base64 PNG String]" : val,
                    2,
                  )}
                </pre>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {mode === "free" && (
              <button
                onClick={() => {
                  setGameOver(false);
                  setDevMetrics(null);
                  setIsFestival(false);
                }}
                className={`w-full ${gameDetails.color} text-white font-bold py-4 rounded-full text-lg shadow-sm hover:opacity-90 transition-all flex justify-center items-center gap-2`}
              >
                <RotateCcw size={20} /> Play Again
              </button>
            )}
            <button
              onClick={() =>
                navigate(mode === "daily" ? "/child-dashboard" : "/free-play")
              }
              className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-full text-lg shadow-sm hover:bg-gray-200 transition-all"
            >
              {mode === "daily" ? "Back to Dashboard" : "Back to Menu"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${THEME.bgBeige} font-sans relative`}>
      <div className="max-w-4xl mx-auto p-6 py-10 flex flex-col h-full">
        <header className="flex justify-between items-center mb-10">
          {mode === "free" ? (
            <button
              onClick={() => navigate("/free-play")}
              className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
            >
              <ArrowLeft size={18} /> Quit
            </button>
          ) : mode === "daily" && !hasStartedDaily ? (
            <button
              onClick={() => navigate("/child-dashboard")}
              className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
            >
              <ArrowLeft size={18} /> Back
            </button>
          ) : (
            <div className="w-[100px]"></div>
          )}

          <div className="bg-white px-5 py-3 rounded-full font-black text-xl flex items-center shadow-sm border-2 border-gray-100 text-gray-800 text-center">
            {mode === "daily"
              ? !hasStartedDaily
                ? "Daily Tests"
                : `Test ${currentTestIndex + 1}/${testQueue.length} : ${gameDetails.title} (${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)})`
              : currentGameId === "drawing"
                ? gameDetails.title
                : `${gameDetails.title} (${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)})`}
          </div>
          <div className="bg-white px-4 py-2 rounded-full font-black text-lg flex items-center shadow-sm border-2 border-gray-100 text-gray-800">
            <Star size={18} className="mr-2 text-yellow-400 fill-yellow-400" />{" "}
            {globalStars}
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          {mode === "daily" && !hasStartedDaily ? (
            <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center max-w-md w-full animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Puzzle size={48} className="text-blue-500" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                Today's Tests
              </h1>

              <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200 text-left">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-500" /> Smart
                  Adaptive Tests
                </h3>
                <p className="text-xs text-blue-700 mb-2">
                  Each test tracks your child's performance individually based
                  on speed and accuracy!
                </p>
                <ul className="text-xs font-medium text-blue-800 space-y-1">
                  <li>
                    • <strong>Pass a test:</strong> It levels up (gets harder)
                    next time.
                  </li>
                  <li>
                    • <strong>Struggle:</strong> It levels down to help them
                    practice.
                  </li>
                  <li>
                    • <strong>Stars:</strong> Earned for completing tests.
                    Harder tests give more stars!
                  </li>
                </ul>
              </div>

              <div className="space-y-4 mb-8">
                {testQueue.map((testId, index) => {
                  const details = {
                    memory: {
                      title: "Memory Match",
                      icon: <Brain size={24} fill="currentColor" />,
                      color: "bg-[#86D293]",
                      text: "text-[#86D293]",
                    },
                    reaction: {
                      title: "Reaction Bug",
                      icon: <Hand size={24} fill="currentColor" />,
                      color: "bg-[#ff5e5e]",
                      text: "text-[#ff5e5e]",
                    },
                    color: {
                      title: "Color Explorer",
                      icon: <Palette size={24} fill="currentColor" />,
                      color: "bg-[#60A5FA]",
                      text: "text-[#60A5FA]",
                    },
                    hearing: {
                      title: "Sound Explorer",
                      icon: <Ear size={24} fill="currentColor" />,
                      color: "bg-[#a78bfa]",
                      text: "text-[#a78bfa]",
                    },
                    drawing: {
                      title: "Creative Canvas",
                      icon: <PenTool size={24} fill="currentColor" />,
                      color: "bg-[#fbbf24]",
                      text: "text-[#fbbf24]",
                    },
                  }[testId];
                  return (
                    <div
                      key={testId}
                      className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-gray-100"
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${details.color} flex items-center justify-center text-white`}
                      >
                        {details.icon}
                      </div>
                      <div className="text-left flex-1 flex items-center justify-between">
                        <div>
                          <p className="font-black text-gray-400 text-xs uppercase tracking-wider">
                            Test {index + 1}
                          </p>
                          <p className={`font-black text-lg ${details.text}`}>
                            {details.title}
                          </p>
                        </div>
                        {testId !== "drawing" && (
                          <span className="text-xs font-black text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 uppercase tracking-wider shadow-sm">
                            {testDifficulties[testId]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setHasStartedDaily(true)}
                className={`w-full ${THEME.primaryYellow} ${THEME.textBlack} font-black py-4 px-6 rounded-full ${THEME.primaryYellowHover} transition-all hover:scale-105 shadow-sm text-xl flex items-center justify-center gap-2`}
              >
                Start <Play size={20} fill="currentColor" />
              </button>
            </div>
          ) : (
            <>
              {currentGameId === "memory" && (
                <MemoryGame
                  key={`memory-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === "reaction" && (
                <ReactionGame
                  key={`reaction-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === "color" && (
                <ColorGame
                  key={`color-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === "hearing" && (
                <HearingGame
                  key={`hearing-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === "drawing" && (
                <DrawingGame
                  key={`drawing-${currentTestIndex}`}
                  onFinish={handleFinish}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
