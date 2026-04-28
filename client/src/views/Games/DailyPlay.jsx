import { SOUNDS } from '@/assets';
import Confetti from '@/components/common/Confetti';
import { THEME } from '@/constants/config';
import { useAppContext } from '@/context/AppContext';
import { playSound } from '@/utils/sound';
import { ArrowLeft, Loader2, Play, Puzzle, Star, TrendingUp, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TEST_DETAILS } from '@/constants/testsStyling';
import { evaluateGamePerformance } from '@/utils/gameEvaluation';
import { GameRenderer } from '@/components/common/GameRenderer';
import { useGetAssessmentTests } from '@/hooks/assessment';

export const DailyPlay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state || {};

  const { globalStars, setGlobalStars } = useAppContext();

  const assessmentTestQuery = useGetAssessmentTests(state.assessment?._id, { staleTime: 0, refetchOnMount: true });

  const assessmentTests = assessmentTestQuery.data || [];

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [dailyResults, setDailyResults] = useState({});
  const [sessionStarsEarned, setSessionStarsEarned] = useState(0);

  const [hasStartedDaily, setHasStartedDaily] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isFestival, setIsFestival] = useState(false);

  const currentAssessTestObj = assessmentTests[currentTestIndex];
  const currentGameName = currentAssessTestObj?.test?.name;
  const currentDifficulty = currentAssessTestObj?.difficulty || 'easy';
  const gameDetails = currentGameName ? TEST_DETAILS[currentGameName] : null;

  const handleFinish = (score, metrics) => {
    const isGoodGame = evaluateGamePerformance(score, metrics);

    // Calculate Stars
    let starDelta = 0;
    if (metrics?.type === 'drawing') {
      starDelta = 2;
      setIsFestival(true);
      playSound(SOUNDS.win);
    } else if (isGoodGame) {
      starDelta = currentDifficulty === 'hard' ? 7 : currentDifficulty === 'medium' ? 5 : 3;
      setIsFestival(true);
      playSound(SOUNDS.win);
    } else {
      starDelta = currentDifficulty === 'hard' ? -3 : currentDifficulty === 'medium' ? -2 : -1;
      playSound(SOUNDS.fail);
    }

    const newSessionTotal = sessionStarsEarned + starDelta;
    setSessionStarsEarned(newSessionTotal);

    // Store the results using the unique ID from the database,
    // this makes it super easy to submit a PUT/POST request to your backend later!
    if (currentAssessTestObj) {
      const updatedResults = {
        ...dailyResults,
        [currentAssessTestObj.id]: { rawData: metrics, isGoodGame, score },
      };
      setDailyResults(updatedResults);
    }

    // Sequence advancement
    if (currentTestIndex < assessmentTests.length - 1) {
      setTimeout(
        () => {
          setIsFestival(false);
          setCurrentTestIndex((prev) => prev + 1);
        },
        isGoodGame ? 2500 : 500,
      );
    } else {
      setTimeout(
        () => {
          // setGlobalStars((prev) => Math.max(0, prev + newSessionTotal));
          setGameOver(true);
        },
        isGoodGame ? 2500 : 500,
      );
    }
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-sky-img flex flex-col items-center justify-center p-6 relative overflow-y-auto select-none [-webkit-tap-highlight-color:transparent]">
        {isFestival && <Confetti />}
        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full animate-in zoom-in duration-500 relative z-10 my-8">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Daily Tests Complete! 🌟</h1>
          <div className="mb-8">
            <p className="text-xl text-gray-500 font-bold mb-2">Today's Session Result:</p>
            <p className="text-3xl font-black text-gray-800">
              {sessionStarsEarned > 0 ? '+' : ''}
              {sessionStarsEarned}
              <Star size={28} className="inline text-yellow-500 fill-yellow-500 mb-1" />
            </p>
            <p className="text-sm font-bold text-gray-400 mt-2">Total: {globalStars} Stars</p>
          </div>
          <button
            onClick={() => navigate('/child/dashboard')}
            className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-full text-lg shadow-sm hover:bg-gray-200 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!hasStartedDaily) {
    if (!assessmentTestQuery.isSuccess) {
      return (
        <div
          className={`min-h-screen ${THEME.bgBeige} font-sans flex flex-col items-center justify-center p-6 relative select-none [-webkit-tap-highlight-color:transparent]`}
        >
          <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center max-w-sm w-full animate-pulse flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-yellow-400 animate-spin mb-6" />
            <h2 className="text-2xl font-black text-gray-800">Preparing Assessment...</h2>
            <p className="text-gray-500 font-bold text-sm mt-2">Loading today's challenges</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`min-h-screen ${THEME.bgBeige} font-sans flex flex-col p-4 md:p-6 select-none [-webkit-tap-highlight-color:transparent]`}
      >
        <div className="flex justify-between items-center w-full max-w-md mx-auto mb-6">
          <button
            onClick={() => navigate('/child/dashboard')}
            className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full shadow-sm font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="bg-white border border-gray-200 px-5 py-2 rounded-full font-black text-gray-800 shadow-sm text-sm">
            Daily Tests
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl text-center max-w-md w-full mx-auto relative flex flex-col h-[85vh]">
          <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto -mt-12 mb-4 border-4 border-white shadow-sm">
            <Puzzle size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Today's Tests</h1>

          <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100 text-left shrink-0">
            <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-2 text-sm">
              <TrendingUp size={16} /> Smart Adaptive Tests
            </h3>
            <p className="text-xs text-blue-500 mb-2">Each test tracks your child's performance individually!</p>
          </div>

          <div
            className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 rounded-xl custom-scrollbar"
            style={{ maxHeight: '40vh' }}
          >
            {/* Map through the API response directly */}
            {assessmentTests.map((item, index) => {
              const testName = item.test.name;
              const details = TEST_DETAILS[testName];

              if (!details) return null;

              const TestIcon = details.icon;
              const specificDifficulty = item.difficulty; // Directly from your DB array

              const DIFFICULTY_COLORS = {
                easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                medium: 'bg-amber-100 text-amber-700 border-amber-200',
                hard: 'bg-rose-100 text-rose-700 border-rose-200',
              };

              const badgeColors = DIFFICULTY_COLORS[specificDifficulty] || 'bg-gray-100 text-gray-500 border-gray-200';

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${details.bg} ${details.text}`}
                  >
                    <TestIcon
                      size={24}
                      fill={testName !== 'Odd One Out' && testName !== 'Drawing' ? 'currentColor' : 'none'}
                    />
                  </div>
                  <div className="text-left flex-1 flex items-center justify-between">
                    <div>
                      <p className="font-black text-gray-400 text-[10px] uppercase tracking-wider">Test {index + 1}</p>
                      <p className={`font-black text-lg ${details.text}`}>{details.title}</p>
                    </div>
                    {testName !== 'Drawing' && (
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider shadow-sm ${badgeColors}`}
                      >
                        {specificDifficulty}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            disabled={assessmentTests.length === 0}
            onClick={() => setHasStartedDaily(true)}
            className="w-full bg-[#fbbf24] disabled:opacity-50 text-gray-900 font-black py-4 px-6 rounded-full hover:scale-105 shadow-sm text-lg flex items-center justify-center gap-2 shrink-0"
          >
            Start <Play size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-img font-sans relative select-none [-webkit-tap-highlight-color:transparent]">
      <div className="max-w-4xl mx-auto p-6 py-10 flex flex-col h-full">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate('/child/dashboard')}
            className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="bg-white px-5 py-3 rounded-full font-black text-xl flex items-center shadow-sm border-2 border-gray-100 text-gray-800 text-center">
            {`Test ${currentTestIndex + 1}/${assessmentTests.length} : ${gameDetails?.title}`}
          </div>
          <div className="bg-white px-4 py-2 rounded-full font-black text-lg flex items-center shadow-sm border-2 border-gray-100 text-gray-800">
            <Star size={18} className="mr-2 text-yellow-400 fill-yellow-400" /> {globalStars}
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <GameRenderer
            gameId={currentGameName}
            difficulty={currentDifficulty}
            onFinish={handleFinish}
            renderKey={`daily-${currentAssessTestObj?.id}`}
          />
        </div>
      </div>
    </div>
  );
};
