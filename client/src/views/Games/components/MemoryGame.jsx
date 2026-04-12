import { playSound, SOUNDS } from "@/assets";
import { IS_DEV } from "@/constants/config";
import { Puzzle } from "lucide-react";
import { useEffect, useState } from "react";

const MemoryGame = ({ onFinish, difficulty = "medium" }) => {
  const ALL_ICONS = ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐸", "🐼"];
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(true);
  const [previewTime, setPreviewTime] = useState(3);

  const [gameStartTime, setGameStartTime] = useState(null);
  const [pairTimestamps, setPairTimestamps] = useState([]);
  const [showDevMetrics, setShowDevMetrics] = useState(false);

  const targetPairs = difficulty === "easy" ? 3 : difficulty === "hard" ? 8 : 6;
  const gridColsClass = difficulty === "easy" ? "grid-cols-3" : "grid-cols-4";
  const cardSizeClass =
    difficulty === "easy"
      ? "text-5xl sm:text-6xl rounded-[1.5rem]"
      : "text-4xl sm:text-5xl rounded-xl";
  const iconSize = difficulty === "easy" ? 48 : 32;

  useEffect(() => {
    let pairCount = 6;
    let useJoker = false;

    if (difficulty === "easy") {
      pairCount = 3;
    }
    if (difficulty === "medium") {
      pairCount = 6;
      useJoker = false;
    }
    if (difficulty === "hard") {
      pairCount = 8;
    }

    const selectedIcons = ALL_ICONS.slice(0, pairCount);
    let deck = [...selectedIcons, ...selectedIcons].map((emoji, idx) => ({
      id: idx,
      emoji,
      isFlipped: true,
      isMatched: false,
      isJoker: false,
    }));

    if (useJoker) {
      deck.push({
        id: "joker",
        emoji: "🌟",
        isFlipped: true,
        isMatched: true,
        isJoker: true,
      });
    }
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);

    let timeLeft = 3;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setPreviewTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCards((prevCards) =>
          prevCards.map((c) => ({ ...c, isFlipped: c.isJoker ? true : false })),
        );
        setIsPreviewing(false);
        setGameStartTime(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [difficulty]);

  const handleCardClick = (index) => {
    if (
      isPreviewing ||
      flippedIndices.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    )
      return;

    playSound(SOUNDS.click);

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const currentMoves = moves + 1;
      setMoves(currentMoves);

      const currentClickTime = Date.now();
      const newTimestamps = [...pairTimestamps, currentClickTime];
      setPairTimestamps(newTimestamps);

      const match =
        newCards[newFlipped[0]].emoji === newCards[newFlipped[1]].emoji;

      if (match) {
        playSound(SOUNDS.match);
        newCards[newFlipped[0]] = {
          ...newCards[newFlipped[0]],
          isMatched: true,
        };
        newCards[newFlipped[1]] = {
          ...newCards[newFlipped[1]],
          isMatched: true,
        };
        setCards(newCards);
        setFlippedIndices([]);

        const currentMatches = matches + 1;
        setMatches(currentMatches);

        if (currentMatches === targetPairs) {
          const AR = ((currentMatches / currentMoves) * 100).toFixed(1);
          let sumDiff = 0;
          let prevT = gameStartTime;
          newTimestamps.forEach((t) => {
            sumDiff += t - prevT;
            prevT = t;
          });
          const ARL = (sumDiff / currentMoves / 1000).toFixed(2);

          setTimeout(
            () =>
              onFinish(Math.max(10, 50 - currentMoves), {
                AR,
                ARL,
                N: currentMoves,
                targetPairs: targetPairs,
              }),
            800,
          );
        }
      } else {
        setTimeout(() => {
          setCards((prevCards) => {
            const revertedCards = [...prevCards];
            if (revertedCards[newFlipped[0]])
              revertedCards[newFlipped[0]] = {
                ...revertedCards[newFlipped[0]],
                isFlipped: false,
              };
            if (revertedCards[newFlipped[1]])
              revertedCards[newFlipped[1]] = {
                ...revertedCards[newFlipped[1]],
                isFlipped: false,
              };
            return revertedCards;
          });
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const liveAR = moves === 0 ? 0 : ((matches / moves) * 100).toFixed(1);
  let liveSumDiff = 0;
  let livePrevT = gameStartTime;
  pairTimestamps.forEach((t) => {
    liveSumDiff += t - livePrevT;
    livePrevT = t;
  });
  const liveARL = moves === 0 ? 0 : (liveSumDiff / moves / 1000).toFixed(2);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto h-[60vh] relative">
      {IS_DEV && (
        <div className="absolute top-0 right-0 z-50 flex flex-col items-end transform translate-x-4 md:translate-x-12">
          <button
            onClick={() => setShowDevMetrics(!showDevMetrics)}
            className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 opacity-30 hover:opacity-100 transition-opacity"
          >
            {showDevMetrics ? "Hide Dev Metrics" : "Show Dev Metrics"}
          </button>
          {showDevMetrics && (
            <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-2xl shadow-xl border border-gray-700 w-52 text-left">
              <div className="font-bold text-white mb-2 border-b border-gray-700 pb-2">
                Live Dev Metrics
              </div>
              <div className="mb-1 text-blue-300">Metric A: Accuracy</div>
              <div className="mb-1 ml-2">- Target Pairs: {targetPairs}</div>
              <div className="mb-1 ml-2">- Correct: {matches}</div>
              <div className="mb-1 ml-2">- Selections: {moves}</div>
              <div className="mb-1 mt-2 pt-2 border-t border-gray-700">
                AR: <span className="text-white font-bold">{liveAR}%</span>
              </div>
              <div>
                ARL: <span className="text-white font-bold">{liveARL}s</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="h-16 w-full flex justify-center items-center mb-4">
        {isPreviewing && (
          <div className="bg-white px-8 py-3 rounded-full shadow-md text-[#FFC82C] font-black text-2xl animate-bounce border-2 border-[#FFC82C]">
            Memorize! ({previewTime}s)
          </div>
        )}
      </div>
      <div
        className={`grid ${gridColsClass} gap-3 md:gap-4 w-full px-4 touch-none select-none`}
      >
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square ${cardSizeClass} flex items-center justify-center cursor-pointer select-none transition-all duration-300 transform-gpu will-change-transform ${card.isFlipped || card.isMatched ? "bg-white shadow-md rotate-y-180" : "bg-[#FFC82C] border-b-8 border-[#E5B427] hover:scale-105"} ${card.isJoker ? "opacity-80" : ""}`}
          >
            {card.isFlipped || card.isMatched ? (
              card.emoji
            ) : (
              <Puzzle
                size={iconSize}
                className="text-yellow-600/30 pointer-events-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
