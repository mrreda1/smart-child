import { playSound, SOUNDS } from "@/assets";
import { IS_DEV } from "@/constants/config";
import { Circle, Heart, Square, Star, Triangle } from "lucide-react";
import { useEffect, useState } from "react";

const ColorGame = ({ onFinish, difficulty = "medium" }) => {
  const SHAPES = [
    { id: "heart", Icon: Heart },
    { id: "star", Icon: Star },
    { id: "circle", Icon: Circle },
    { id: "square", Icon: Square },
    { id: "triangle", Icon: Triangle },
  ];

  const COLOR_VARIANTS = {
    Red: [
      { bg: "#fee2e2", fg: "#dc2626" },
      { bg: "#fca5a5", fg: "#ef4444" },
      { bg: "#f87171", fg: "#ef4444" },
    ],
    Green: [
      { bg: "#dcfce7", fg: "#16a34a" },
      { bg: "#86efac", fg: "#22c55e" },
      { bg: "#4ade80", fg: "#22c55e" },
    ],
    Blue: [
      { bg: "#dbeafe", fg: "#2563eb" },
      { bg: "#93c5fd", fg: "#3b82f6" },
      { bg: "#60a5fa", fg: "#3b82f6" },
    ],
  };

  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [totalSelections, setTotalSelections] = useState(0);
  const [correctIdentifications, setCorrectIdentifications] = useState(0);
  const [colorStats, setColorStats] = useState({
    Red: { prompts: 0, hits: 0 },
    Green: { prompts: 0, hits: 0 },
    Blue: { prompts: 0, hits: 0 },
  });
  const [showDevMetrics, setShowDevMetrics] = useState(false);

  useEffect(() => {
    let pool = [];
    if (difficulty === "easy") {
      pool = [
        { color: "Red", diff: 0 },
        { color: "Green", diff: 0 },
        { color: "Blue", diff: 0 },
        { color: "Red", diff: 0 },
      ].sort(() => Math.random() - 0.5);
    } else if (difficulty === "hard") {
      pool = [
        { color: "Red", diff: 2 },
        { color: "Green", diff: 2 },
        { color: "Blue", diff: 2 },
        { color: "Red", diff: 2 },
        { color: "Green", diff: 2 },
        { color: "Blue", diff: 2 },
        { color: "Red", diff: 2 },
        { color: "Green", diff: 2 },
      ].sort(() => Math.random() - 0.5);
    } else {
      pool = [
        { color: "Red", diff: 1 },
        { color: "Red", diff: 2 },
        { color: "Green", diff: 1 },
        { color: "Green", diff: 2 },
        { color: "Blue", diff: 1 },
        { color: "Blue", diff: 2 },
      ].sort(() => Math.random() - 0.5);
    }

    const generatedRounds = pool.map((item) => {
      const targetShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const options = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, 4);
      if (!options.find((o) => o.id === targetShape.id)) {
        options[0] = targetShape;
        options.sort(() => Math.random() - 0.5);
      }
      return {
        color: item.color,
        diff: item.diff,
        variant: COLOR_VARIANTS[item.color][item.diff],
        targetShape,
        options,
      };
    });
    setRounds(generatedRounds);
  }, [difficulty]);

  const handleOptionClick = (shapeId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const roundData = rounds[currentRound];
    const isCorrect = shapeId === roundData.targetShape.id;

    playSound(isCorrect ? SOUNDS.match : SOUNDS.click);

    const newTotalSelections = totalSelections + 1;
    setTotalSelections(newTotalSelections);

    const newColorStats = {
      ...colorStats,
      [roundData.color]: {
        prompts: colorStats[roundData.color].prompts + 1,
        hits: isCorrect
          ? colorStats[roundData.color].hits + 1
          : colorStats[roundData.color].hits,
      },
    };
    setColorStats(newColorStats);

    const newCorrectIdentifications = isCorrect
      ? correctIdentifications + 1
      : correctIdentifications;
    setCorrectIdentifications(newCorrectIdentifications);

    if (currentRound + 1 >= rounds.length) {
      const AR = (
        (newCorrectIdentifications / newTotalSelections) *
        100
      ).toFixed(1);
      const RedProfile =
        newColorStats.Red.prompts === 0
          ? "0.0"
          : (
              (newColorStats.Red.hits / newColorStats.Red.prompts) *
              100
            ).toFixed(1);
      const GreenProfile =
        newColorStats.Green.prompts === 0
          ? "0.0"
          : (
              (newColorStats.Green.hits / newColorStats.Green.prompts) *
              100
            ).toFixed(1);
      const BlueProfile =
        newColorStats.Blue.prompts === 0
          ? "0.0"
          : (
              (newColorStats.Blue.hits / newColorStats.Blue.prompts) *
              100
            ).toFixed(1);

      setTimeout(() => {
        onFinish(newCorrectIdentifications * 10, {
          AR,
          RedProfile,
          GreenProfile,
          BlueProfile,
          correctIdentifications: newCorrectIdentifications,
          totalSelections: newTotalSelections,
          rawColorStats: newColorStats,
        });
      }, 500);
    } else {
      setTimeout(() => {
        setCurrentRound((curr) => curr + 1);
        setIsTransitioning(false);
      }, 500);
    }
  };

  if (rounds.length === 0) return null;

  const roundData = rounds[currentRound];
  const TargetIcon = roundData.targetShape.Icon;

  const liveAR =
    totalSelections === 0
      ? "0.0"
      : ((correctIdentifications / totalSelections) * 100).toFixed(1);
  const liveRedPI =
    colorStats.Red.prompts === 0
      ? "0.0"
      : ((colorStats.Red.hits / colorStats.Red.prompts) * 100).toFixed(1);
  const liveGreenPI =
    colorStats.Green.prompts === 0
      ? "0.0"
      : ((colorStats.Green.hits / colorStats.Green.prompts) * 100).toFixed(1);
  const liveBluePI =
    colorStats.Blue.prompts === 0
      ? "0.0"
      : ((colorStats.Blue.hits / colorStats.Blue.prompts) * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative h-[70vh]">
      {IS_DEV && (
        <div className="absolute top-[-30px] right-0 z-50 flex flex-col items-end transform translate-x-4 md:translate-x-12">
          <button
            onClick={() => setShowDevMetrics(!showDevMetrics)}
            className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 opacity-30 hover:opacity-100 transition-opacity"
          >
            {showDevMetrics ? "Hide Dev Metrics" : "Show Dev Metrics"}
          </button>
          {showDevMetrics && (
            <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-2xl shadow-xl border border-gray-700 w-56 text-left">
              <div className="font-bold text-white mb-2 border-b border-gray-700 pb-2">
                Live Color Metrics
              </div>
              <div className="mb-1 text-blue-300">Metric A: Accuracy</div>
              <div className="mb-1 ml-2">- Hits: {correctIdentifications}</div>
              <div className="mb-1 ml-2">- Taps: {totalSelections}</div>
              <div className="mb-2">
                AR: <span className="text-white font-bold">{liveAR}%</span>
              </div>
              <div className="pt-2 border-t border-gray-700 text-blue-300 mb-1">
                Metric B: RGB Success
              </div>
              <div className="text-red-400">
                Red: {liveRedPI}% ({colorStats.Red.hits}/
                {colorStats.Red.prompts})
              </div>
              <div className="text-green-400">
                Green: {liveGreenPI}% ({colorStats.Green.hits}/
                {colorStats.Green.prompts})
              </div>
              <div className="text-blue-400">
                Blue: {liveBluePI}% ({colorStats.Blue.hits}/
                {colorStats.Blue.prompts})
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">
          Find the hidden shape!
        </h2>
        <p className="text-gray-500 font-bold text-sm">
          Round {currentRound + 1} of {rounds.length}
        </p>
      </div>

      <div
        className={`relative w-full max-w-[250px] aspect-square rounded-[3rem] flex items-center justify-center shadow-inner mb-8 transition-colors duration-500 select-none overflow-hidden`}
        style={{ backgroundColor: roundData.variant.bg }}
      >
        <TargetIcon
          size={difficulty === "hard" ? 90 : 120}
          style={{
            color: roundData.variant.fg,
            opacity: roundData.diff === 2 ? 0.8 : 1,
          }}
          className="transition-colors duration-500 pointer-events-none relative z-0 transform-gpu will-change-transform"
          fill="currentColor"
        />
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-all duration-500 transform-gpu"
          style={{
            backgroundImage: `radial-gradient(${difficulty === "hard" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)"} 4px, transparent 4px)`,
            backgroundSize:
              difficulty === "easy"
                ? "30px 30px"
                : difficulty === "hard"
                  ? "12px 12px"
                  : "16px 16px",
          }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full touch-none select-none">
        {roundData.options.map((opt) => {
          const OptionIcon = opt.Icon;
          return (
            <button
              key={opt.id}
              onPointerDown={() => handleOptionClick(opt.id)}
              className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-gray-200 hover:-translate-y-1 active:translate-y-0 active:border-b-0 transition-transform transform-gpu will-change-transform flex justify-center items-center select-none"
            >
              <OptionIcon
                size={40}
                className="text-gray-400 pointer-events-none"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorGame;
