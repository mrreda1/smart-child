import { HEARING_ITEMS, SOUNDS } from '@/assets';
import { useAppContext } from '@/context/AppContext';
import { playSound } from '@/utils/sound';
import { Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const HearingGame = ({ onFinish, difficulty = 'medium' }) => {
  const { testConfigs } = useAppContext();
  const config = testConfigs.hearing[difficulty] || {};
  const numOptions = config?.numOptions || 6;
  const numRounds = config?.numRounds || 6;

  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [reveal, setReveal] = useState({ show: false, clickedId: null });

  const audioRef = useRef(null);
  const [audioEndTime, setAudioEndTime] = useState(0);
  const [correctIdentifications, setCorrectIdentifications] = useState(0);
  const [totalSoundsPlayed, setTotalSoundsPlayed] = useState(0);
  const [sumLatency, setSumLatency] = useState(0);

  useEffect(() => {
    const generatedRounds = [];
    const shuffledTargets = [...HEARING_ITEMS].sort(() => Math.random() - 0.5);
    const safeNumRounds = Math.min(numRounds, HEARING_ITEMS.length);

    for (let i = 0; i < safeNumRounds; i++) {
      const targetItem = shuffledTargets[i];
      const distractors = HEARING_ITEMS.filter((item) => item.id !== targetItem.id).sort(() => Math.random() - 0.5);
      const options = [targetItem, ...distractors.slice(0, numOptions - 1)].sort(() => Math.random() - 0.5);
      generatedRounds.push({ options, targetItem });
    }
    setRounds(generatedRounds);

    return () => {
      if (audioRef.current) {
        try {
          if (typeof audioRef.current.stop === 'function') audioRef.current.stop();
        } catch (e) {}
      }
    };
  }, [difficulty, numOptions, numRounds]);

  const playCurrentSound = async () => {
    if (isPlaying || isTransitioning) return;
    setIsPlaying(true);
    if (audioRef.current) {
      try {
        audioRef.current.stop();
      } catch (e) {}
    }
    const url = rounds[currentRound].targetItem.sound;
    try {
      const source = await playSound(url);
      audioRef.current = source;
      source.onended = () => {
        setIsPlaying(false);
        setHasPlayed(true);
        setAudioEndTime((prev) => (prev === 0 ? Date.now() : prev));
      };
    } catch (e) {
      setIsPlaying(false);
      setHasPlayed(true);
      setAudioEndTime((prev) => (prev === 0 ? Date.now() : prev));
    }
  };

  const handleOptionClick = (itemId) => {
    if (!hasPlayed || isPlaying || isTransitioning) return;
    setIsTransitioning(true);

    const roundData = rounds[currentRound];
    const isCorrect = itemId === roundData.targetItem.id;
    if (isCorrect) {
      playSound(SOUNDS.match);
    } else {
      playSound(SOUNDS.wrong);
    }

    let currentLatency = 0;
    if (audioEndTime > 0) {
      const diff = Date.now() - audioEndTime;
      if (diff > 0 && diff < 30000) {
        currentLatency = diff;
        setSumLatency(sumLatency + diff);
      }
    }

    setReveal({ show: true, clickedId: itemId });

    setTimeout(
      () => {
        const finalCorrect = isCorrect ? correctIdentifications + 1 : correctIdentifications;
        const finalTotalPlayed = totalSoundsPlayed + 1;

        setCorrectIdentifications(finalCorrect);
        setTotalSoundsPlayed(finalTotalPlayed);

        if (currentRound + 1 >= rounds.length) {
          const isr = ((finalCorrect / finalTotalPlayed) * 100).toFixed(1);
          const aarl = ((sumLatency + currentLatency) / finalTotalPlayed / 1000).toFixed(2);
          onFinish(finalCorrect * 10, {
            isr,
            aarl,
            rawData: {
              correctIdentifications: finalCorrect,
              totalSoundsPlayed: finalTotalPlayed,
              sumOfAudioResponseLatenciesMs: sumLatency + currentLatency,
            },
          });
        } else {
          setCurrentRound((curr) => curr + 1);
          setHasPlayed(false);
          setAudioEndTime(0);
          setReveal({ show: false, clickedId: null });
          setIsTransitioning(false);
        }
      },
      isCorrect ? 800 : 1500,
    );
  };

  if (rounds.length === 0) return null;
  const roundData = rounds[currentRound];
  // Adjusted for safe mobile viewing
  const gridColsClass =
    roundData.options.length > 6
      ? 'grid-cols-2 md:grid-cols-4'
      : roundData.options.length > 4
        ? 'grid-cols-2 md:grid-cols-3'
        : 'grid-cols-2';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative h-[70vh] select-none [-webkit-tap-highlight-color:transparent]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">Who makes this sound?</h2>
        <p className="text-gray-500 font-bold text-sm">
          Sound {currentRound + 1} of {rounds.length}
        </p>
      </div>
      <button
        onClick={playCurrentSound}
        disabled={isPlaying}
        className={`w-32 h-32 rounded-full shadow-lg flex items-center justify-center mb-8 transition-all select-none transform-gpu will-change-transform [-webkit-tap-highlight-color:transparent] ${isPlaying ? 'bg-purple-100 animate-pulse border-4 border-purple-400' : 'bg-[#a78bfa] hover:bg-[#9061f9] hover:scale-105 active:scale-95'}`}
      >
        <Volume2 size={48} className={isPlaying ? 'text-purple-600' : 'text-white'} />
      </button>
      <div
        className={`grid ${gridColsClass} gap-4 w-full transition-opacity duration-300 touch-none select-none px-4 ${!hasPlayed || isPlaying ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
      >
        {roundData.options.map((opt) => {
          let btnClass = `bg-white ${roundData.options.length > 6 ? 'p-4 text-4xl' : 'p-6 text-5xl'} rounded-3xl shadow-sm border-b-4 border-gray-200 transition-all transform-gpu will-change-transform flex justify-center items-center select-none [-webkit-tap-highlight-color:transparent] `;

          if (reveal.show) {
            if (opt.id === roundData.targetItem.id) {
              btnClass += 'ring-4 ring-green-400 bg-green-50 scale-105 border-b-0 translate-y-1 z-10 ';
            } else if (opt.id === reveal.clickedId) {
              btnClass += 'ring-4 ring-red-400 bg-red-50 scale-95 border-b-0 translate-y-1 ';
            } else {
              btnClass += 'opacity-40 scale-95 border-b-0 translate-y-1 ';
            }
          } else {
            btnClass += 'hover:-translate-y-1 active:translate-y-0 active:border-b-0 ';
          }

          return (
            <button key={opt.id} onPointerDown={() => handleOptionClick(opt.id)} className={btnClass}>
              {opt.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
};
