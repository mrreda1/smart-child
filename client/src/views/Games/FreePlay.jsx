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

export const FreePlay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { globalStars } = useAppContext();

  const state = location?.state || {};
  const currentGameId = state.gameId;
  const currentDifficulty = state.difficulty || 'easy';

  const [gameOver, setGameOver] = useState(false);
  const [devMetrics, setDevMetrics] = useState(null);
  const [isFestival, setIsFestival] = useState(false);

  const gameDetails = currentGameId ? TEST_DETAILS[currentGameId] : null;

  const handleFinish = (score, metrics) => {
    const isGoodGame = evaluateGamePerformance(score, metrics);

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
      if (devMetrics.type === 'drawing') {
        feedbackMessage = 'Beautiful Artwork! 🎨';
      } else if (devMetrics.type === 'iq') {
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

          {IS_DEV && devMetrics && (
            <div className="mb-8 bg-gray-50 border-2 border-dashed border-gray-200 p-4 rounded-2xl text-left">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <BarChart2 size={14} /> Dev Purpose Metrics
              </p>
              <div className="space-y-2 font-mono text-sm">
                {devMetrics.type === 'iq' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">IQ Score (AR):</span>
                      <span className="font-bold text-gray-800">{devMetrics.ar}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg Time (ART):</span>
                      <span className="font-bold text-gray-800">{devMetrics.art}s</span>
                    </div>
                  </>
                ) : devMetrics.type === 'drawing' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Test Type:</span>
                      <span className="font-bold text-gray-800">Drawing</span>
                    </div>
                  </>
                ) : devMetrics.redProfile !== undefined ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color Accuracy (AR):</span>
                      <span className="font-bold text-gray-800">{devMetrics.ar}%</span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t text-xs text-red-500">
                      <span className="font-bold">Red Profile:</span>
                      <span className="font-black">{devMetrics.redProfile}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-green-500">
                      <span className="font-bold">Green Profile:</span>
                      <span className="font-black">{devMetrics.greenProfile}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-blue-500">
                      <span className="font-bold">Blue Profile:</span>
                      <span className="font-black">{devMetrics.blueProfile}%</span>
                    </div>
                  </>
                ) : devMetrics.isr !== undefined ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Success Rate (ISR):</span>
                      <span className="font-bold text-gray-800">{devMetrics.isr}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg Latency (AARL):</span>
                      <span className="font-bold text-gray-800">{devMetrics.aarl}s</span>
                    </div>
                  </>
                ) : devMetrics.ar !== undefined && devMetrics.arl !== undefined ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Accuracy (AR):</span>
                      <span className="font-bold text-blue-600">{devMetrics.ar}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Latency (ARL):</span>
                      <span className="font-bold text-blue-600">{devMetrics.arl}s</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Precision (PI):</span>
                      <span className="font-black text-red-600">{devMetrics.pi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Mean RT (MRT):</span>
                      <span className="font-black text-green-600">{devMetrics.mrt}ms</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

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
          <div className="bg-white px-5 py-3 rounded-full font-black text-xl flex items-center shadow-sm border-2 border-gray-100 text-gray-800 text-center">
            {currentGameId === 'Drawing'
              ? gameDetails?.title
              : `${gameDetails?.title} (${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)})`}
          </div>
          <div className="bg-white px-4 py-2 rounded-full font-black text-lg flex items-center shadow-sm border-2 border-gray-100 text-gray-800">
            <Star size={18} className="mr-2 text-yellow-400 fill-yellow-400" /> {globalStars}
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
