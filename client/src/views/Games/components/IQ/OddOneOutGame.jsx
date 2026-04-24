import { SOUNDS } from '@/assets';
import { SIMILAR_PAIRS } from '@/constants/testData';
import { useAppContext } from '@/context/AppContext';
import { playSound } from '@/utils/sound';
import { useEffect, useState } from 'react';

export const OddOneOutGame = ({ onFinish, difficulty = 'medium' }) => {
  const { testConfigs } = useAppContext();
  const config = testConfigs.odd_one_out[difficulty] || {};
  const maxRounds = config?.maxRounds || 5;

  const [round, setRound] = useState(0);
  const [items, setItems] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [hasFinished, setHasFinished] = useState(false);

  const [reveal, setReveal] = useState({ show: false, clickedId: null });

  useEffect(() => {
    if (round >= maxRounds) return;

    if (round === 0) setStartTime(Date.now());

    const diffPairs = SIMILAR_PAIRS[difficulty] || SIMILAR_PAIRS.medium;
    const selectedPair = diffPairs[Math.floor(Math.random() * diffPairs.length)];

    const isReversed = Math.random() > 0.5;
    const baseEmoji = isReversed ? selectedPair[1] : selectedPair[0];
    const oddEmoji = isReversed ? selectedPair[0] : selectedPair[1];

    const newItems = Array(4)
      .fill(null)
      .map((_, i) => ({
        id: i,
        emoji: baseEmoji,
        isOdd: false,
      }));

    newItems[Math.floor(Math.random() * 4)] = { id: 3, emoji: oddEmoji, isOdd: true };

    setItems(newItems.sort(() => Math.random() - 0.5).map((item, i) => ({ ...item, id: i })));
  }, [round, difficulty, maxRounds]);

  useEffect(() => {
    if (round >= maxRounds && !hasFinished) {
      setHasFinished(true);
      const timeTakenMs = Date.now() - startTime;
      const timeTakenS = timeTakenMs / 1000;
      const ar = ((correctCount / maxRounds) * 100).toFixed(1);
      const art = (timeTakenS / maxRounds).toFixed(1);
      onFinish(correctCount * 20, {
        type: 'iq',
        ar,
        art,
        rawData: {
          correctIdentifications: correctCount,
          totalRounds: maxRounds,
          timeTakenMs: timeTakenMs,
        },
      });
    }
  }, [round, maxRounds, hasFinished, startTime, correctCount, onFinish]);

  const handleSelect = (id, isOdd) => {
    if (reveal.show || hasFinished) return;

    if (isOdd) {
      playSound(SOUNDS.match);
      setCorrectCount((c) => c + 1);
    } else {
      playSound(SOUNDS.wrong);
    }

    setReveal({ show: true, clickedId: id });

    setTimeout(
      () => {
        setRound((r) => r + 1);
        setReveal({ show: false, clickedId: null });
      },
      isOdd ? 800 : 1500,
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[60vh] select-none [-webkit-tap-highlight-color:transparent]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-800">Find the Different One!</h2>
        <p className="text-gray-500 font-bold mt-1">
          Round {Math.min(round + 1, maxRounds)} of {maxRounds}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full p-4">
        {items.map((item) => {
          let btnClass =
            'bg-white aspect-square rounded-[2rem] shadow-sm border-b-8 border-gray-200 flex items-center justify-center transition-all text-6xl md:text-7xl select-none [-webkit-tap-highlight-color:transparent] ';

          if (reveal.show) {
            if (item.isOdd) {
              btnClass += 'ring-8 ring-green-400 bg-green-50 scale-105 border-b-0 translate-y-2 z-10 ';
            } else if (item.id === reveal.clickedId) {
              btnClass += 'ring-8 ring-red-400 bg-red-50 scale-95 border-b-0 translate-y-2 ';
            } else {
              btnClass += 'opacity-40 scale-95 border-b-0 translate-y-2 ';
            }
          } else {
            btnClass += 'hover:-translate-y-1 active:translate-y-2 active:border-b-0 ';
          }

          return (
            <button key={item.id} onClick={() => handleSelect(item.id, item.isOdd)} className={btnClass}>
              {item.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
};
