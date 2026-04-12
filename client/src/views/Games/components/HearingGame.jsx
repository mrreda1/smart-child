import { HEARING_ITEMS, playSound, SOUNDS } from "@/assets";
import { IS_DEV } from "@/constants/config";
import { Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HearingGame = ({ onFinish, difficulty = "medium" }) => {
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioRef = useRef(null);

  const [audioEndTime, setAudioEndTime] = useState(null);
  const [correctIdentifications, setCorrectIdentifications] = useState(0);
  const [totalSoundsPlayed, setTotalSoundsPlayed] = useState(0);
  const [sumLatency, setSumLatency] = useState(0);
  const [showDevMetrics, setShowDevMetrics] = useState(false);

  useEffect(() => {
    const numOptions =
      difficulty === "easy" ? 3 : difficulty === "hard" ? 8 : 6;
    const numRounds = difficulty === "easy" ? 4 : difficulty === "hard" ? 8 : 6;

    const generatedRounds = [];
    for (let i = 0; i < numRounds; i++) {
      const shuffled = [...HEARING_ITEMS].sort(() => Math.random() - 0.5);
      const options = shuffled.slice(0, numOptions);
      const targetItem = options[Math.floor(Math.random() * numOptions)];
      generatedRounds.push({ options, targetItem });
    }
    setRounds(generatedRounds);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [difficulty]);

  const playCurrentSound = () => {
    if (isPlaying || isTransitioning) return;
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(rounds[currentRound].targetItem.sound);
    audioRef.current = newAudio;
    newAudio.onended = () => {
      setIsPlaying(false);
      setHasPlayed(true);
      setAudioEndTime(Date.now());
    };
    newAudio.play().catch((e) => {
      setIsPlaying(false);
      setHasPlayed(true);
      setAudioEndTime(Date.now());
    });
  };

  const handleOptionClick = (itemId) => {
    if (!hasPlayed || isPlaying || isTransitioning) return;
    setIsTransitioning(true);

    const roundData = rounds[currentRound];
    const isCorrect = itemId === roundData.targetItem.id;
    playSound(isCorrect ? SOUNDS.match : SOUNDS.click);

    const latency = Date.now() - audioEndTime;
    const newSumLatency = sumLatency + latency;
    setSumLatency(newSumLatency);

    const newCorrect = isCorrect
      ? correctIdentifications + 1
      : correctIdentifications;
    setCorrectIdentifications(newCorrect);

    const newTotalPlayed = totalSoundsPlayed + 1;
    setTotalSoundsPlayed(newTotalPlayed);

    if (currentRound + 1 >= rounds.length) {
      const ISR = ((newCorrect / newTotalPlayed) * 100).toFixed(1);
      const AARL = (newSumLatency / newTotalPlayed / 1000).toFixed(2);
      setTimeout(() => {
        onFinish(newCorrect * 10, {
          ISR,
          AARL,
          correctIdentifications: newCorrect,
          totalPlayed: newTotalPlayed,
        });
      }, 500);
    } else {
      setTimeout(() => {
        setCurrentRound((curr) => curr + 1);
        setHasPlayed(false);
        setAudioEndTime(null);
        setIsTransitioning(false);
      }, 500);
    }
  };

  if (rounds.length === 0) return null;

  const roundData = rounds[currentRound];
  const gridColsClass =
    roundData.options.length > 6
      ? "grid-cols-4"
      : roundData.options.length > 4
        ? "grid-cols-3"
        : "grid-cols-2";

  const liveISR =
    totalSoundsPlayed === 0
      ? "0.0"
      : ((correctIdentifications / totalSoundsPlayed) * 100).toFixed(1);
  const liveAARL =
    totalSoundsPlayed === 0
      ? "0.00"
      : (sumLatency / totalSoundsPlayed / 1000).toFixed(2);

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
                Live Audio Metrics
              </div>
              <div className="mb-1 text-blue-300">Metric A: Success Rate</div>
              <div className="mb-1 ml-2">
                - Correct: {correctIdentifications}
              </div>
              <div className="mb-1 ml-2">
                - Sounds Played: {totalSoundsPlayed}
              </div>
              <div className="mb-2">
                ISR: <span className="text-white font-bold">{liveISR}%</span>
              </div>
              <div className="pt-2 border-t border-gray-700 text-blue-300 mb-1">
                Metric B: Latency
              </div>
              <div>
                AARL: <span className="text-white font-bold">{liveAARL}s</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">
          Who makes this sound?
        </h2>
        <p className="text-gray-500 font-bold text-sm">
          Sound {currentRound + 1} of {rounds.length}
        </p>
      </div>

      <button
        onClick={playCurrentSound}
        disabled={isPlaying}
        className={`w-32 h-32 rounded-full shadow-lg flex items-center justify-center mb-8 transition-all select-none transform-gpu will-change-transform ${isPlaying ? "bg-purple-100 animate-pulse border-4 border-purple-400" : "bg-[#a78bfa] hover:bg-[#9061f9] hover:scale-105 active:scale-95"}`}
      >
        <Volume2
          size={48}
          className={isPlaying ? "text-purple-600" : "text-white"}
        />
      </button>

      <div
        className={`grid ${gridColsClass} gap-4 w-full transition-opacity duration-300 touch-none select-none ${!hasPlayed || isPlaying ? "opacity-30 pointer-events-none" : "opacity-100"}`}
      >
        {roundData.options.map((opt) => (
          <button
            key={opt.id}
            onPointerDown={() => handleOptionClick(opt.id)}
            className={`bg-white ${roundData.options.length > 6 ? "p-4 text-4xl" : "p-6 text-5xl"} rounded-3xl shadow-sm border-b-4 border-gray-200 hover:-translate-y-1 active:translate-y-0 active:border-b-0 transition-transform transform-gpu will-change-transform flex justify-center items-center select-none`}
          >
            {opt.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HearingGame;
