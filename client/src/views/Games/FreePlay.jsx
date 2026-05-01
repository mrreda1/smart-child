import { SOUNDS } from '@/assets';
import Confetti from '@/components/common/Confetti';
import { useAppContext } from '@/context/AppContext';
import { playSound } from '@/utils/sound';
import { ArrowLeft, BarChart2, RotateCcw, Star, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TEST_DETAILS } from '@/constants/testsStyling';
import { evaluateGamePerformance } from '@/utils/gameEvaluation';
import { GameRenderer } from '@/components/common/GameRenderer';
import { IS_DEV } from '@/constants/config';
import { useGetTestsConfig } from '@/hooks/test';

export const FreePlay = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location?.state || {};
  const currentGameId = state.gameId;
  const currentDifficulty = state.difficulty || 'easy';

  const [gameOver, setGameOver] = useState(false);
  const [devMetrics, setDevMetrics] = useState(null);
  const [isFestival, setIsFestival] = useState(false);

  const testsConfigQuery = useGetTestsConfig();

  const gameDetails = currentGameId ? TEST_DETAILS[currentGameId] : null;

  const handleFinish = (score, metrics) => {
    metrics.type = state.activeCategory;
    metrics.testName = currentGameId;

    const isGoodGame = evaluateGamePerformance(metrics, testsConfigQuery.data.thresholds);

    setDevMetrics(metrics);
    setGameOver(true);

    if (isGoodGame) {
      setIsFestival(true);
      playSound(SOUNDS.win);
    } else {
      playSound(SOUNDS.fail);
    }
  };

  if (gameOver) {
    let feedbackMessage = 'Great Practice!';
    if (devMetrics) {
      if (devMetrics.type === 'Art') {
        feedbackMessage = 'Beautiful Artwork! 🎨';
      } else if (devMetrics.type === 'IQ') {
        const arValue = parseFloat(devMetrics.ar);
        if (arValue >= 80) feedbackMessage = 'Genius Mind! 🧠';
        else if (arValue >= 50) feedbackMessage = 'Great Logic! 🧩';
        else feedbackMessage = 'Good Try! Keep Thinking! 💪';
      } else if (devMetrics.redProfile !== undefined) {
        const arValue = parseFloat(devMetrics.ar);
        if (arValue >= 100) feedbackMessage = 'Eagle Eye! 🦅';
        else if (arValue >= 80) feedbackMessage = 'Sharp Vision! 👁️';
        else if (arValue >= 50) feedbackMessage = 'Great Spotting! 🎨';
        else feedbackMessage = 'Good Try! Look closer next time! 💪';
      } else if (devMetrics.isr !== undefined) {
        const isrValue = parseFloat(devMetrics.isr);
        if (isrValue >= 100) feedbackMessage = 'Perfect Hearing! 🦇';
        else if (isrValue >= 80) feedbackMessage = 'Super Listener! 👂';
        else if (isrValue >= 50) feedbackMessage = 'Great Job! Keep Listening! 👍';
        else feedbackMessage = 'Good Try! Listen closely next time! 💪';
      } else if (devMetrics.ar !== undefined && devMetrics.arl !== undefined) {
        const arValue = parseFloat(devMetrics.ar);
        if (arValue >= 100) feedbackMessage = 'Perfect Memory! 🌟';
        else if (arValue >= 80) feedbackMessage = 'Amazing Recall! 🧠';
        else if (arValue >= 50) feedbackMessage = 'Great Job! Keep Practicing! 👍';
        else feedbackMessage = "Good Try! You'll get it next time! 💪";
      } else if (devMetrics.pi !== undefined) {
        const piValue = parseFloat(devMetrics.pi);
        const mrtValue = parseFloat(devMetrics.mrt);
        if (piValue >= 80 && mrtValue < 1000) feedbackMessage = 'Lightning Fast Precision! ⚡';
        else if (piValue >= 50 && mrtValue < 1500) feedbackMessage = 'Great Reflexes! 🏃';
        else feedbackMessage = "Nice Try! Let's play again! 💪";
      }
    }

    return (
      <div className="min-h-screen bg-sky-img flex flex-col items-center justify-center p-6 relative overflow-y-auto select-none [-webkit-tap-highlight-color:transparent]">
        {isFestival && <Confetti />}
        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full animate-in zoom-in duration-500 relative z-10 my-8">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{feedbackMessage}</h1>
          <p className="text-lg text-gray-400 font-bold mb-8">Practice makes perfect!</p>

          <div className="space-y-4">
            <button
              onClick={() => {
                setGameOver(false);
                setDevMetrics(null);
                setIsFestival(false);
              }}
              className="w-full bg-blue-500 text-white font-bold py-4 rounded-full text-lg shadow-sm hover:opacity-90 transition-all flex justify-center items-center gap-2"
            >
              <RotateCcw size={20} /> Play Again
            </button>
            <button
              onClick={() => navigate('/child/free-play')}
              className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-full text-lg shadow-sm hover:bg-gray-200 transition-all"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-img font-sans relative select-none [-webkit-tap-highlight-color:transparent]">
      <div className="max-w-4xl mx-auto p-6 py-10 flex flex-col h-full">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate('/child/free-play')}
            className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
          >
            <ArrowLeft size={18} /> Quit
          </button>
          <div className="bg-white px-5 py-3 m-auto rounded-full font-black text-xl flex items-center shadow-sm border-2 border-gray-100 text-gray-800 text-center">
            {currentGameId === 'Drawing'
              ? gameDetails?.title
              : `${gameDetails?.title} (${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)})`}
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <GameRenderer
            gameId={currentGameId}
            difficulty={currentDifficulty}
            onFinish={handleFinish}
            renderKey="free-play"
          />
        </div>
      </div>
    </div>
  );
};
