import { SOUNDS } from '@/assets';
import Confetti from '@/components/common/Confetti';
import { IS_DEV, THEME } from '@/constants/config';
import { useAppContext } from '@/context/AppContext';
import { playSound } from '@/utils/sound';
import {
  Archive,
  ArrowLeft,
  BarChart2,
  Brain,
  Ear,
  Hand,
  Layers,
  Loader2,
  Music,
  Palette,
  PenTool,
  Play,
  Puzzle,
  RotateCcw,
  Search,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MemoryGame } from './components/memory/MemoryGame';
import { VisualSequenceGame } from './components/memory/VisualSequenceGame';
import { ReactionGame } from './components/speed/ReactionGame';
import { LightReactionGame } from './components/speed/LightReactionGame';
import { ColorGame } from './components/color/ColorGame';
import { ColorSortingGame } from './components/color/ColorSortingGame';
import { HearingGame } from './components/hearing/HearingGame';
import { PathSoundGame } from './components/hearing/PathSoundGame';
import { PuzzleGame } from './components/IQ/PuzzleGame';
import { OddOneOutGame } from './components/IQ/OddOneOutGame';
import { DrawingGame } from './components/drawing/DrawingGame';
import { useLocation, useNavigate } from 'react-router-dom';

export const GamePlay = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { globalStars, setGlobalStars, testDifficulties, setTestDifficulties } = useAppContext();

  const state = location?.state;

  const mode = state.mode || 'free';
  const [testQueue, setTestQueue] = useState(state.testQueue || []);

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [dailyResults, setDailyResults] = useState({});
  const [sessionStarsEarned, setSessionStarsEarned] = useState(0);
  const [hasStartedDaily, setHasStartedDaily] = useState(false);
  const [isFetchingConfig, setIsFetchingConfig] = useState(mode === 'daily');

  const currentGameId = mode === 'daily' ? testQueue[currentTestIndex] : state.gameId;

  const difficultyRef = useRef(
    mode === 'daily' ? testDifficulties[currentGameId] || 'easy' : state.difficulty || 'easy',
  );
  const prevTestIndexRef = useRef(currentTestIndex);

  if (currentTestIndex !== prevTestIndexRef.current) {
    difficultyRef.current = mode === 'daily' ? testDifficulties[currentGameId] || 'easy' : state.difficulty || 'easy';
    prevTestIndexRef.current = currentTestIndex;
  }
  const currentDifficulty = difficultyRef.current;

  const [gameOver, setGameOver] = useState(false);
  const [devMetrics, setDevMetrics] = useState(null);
  const [isFestival, setIsFestival] = useState(false);

  useEffect(() => {
    if (mode === 'daily') {
      const fetchAssessmentDetails = async () => {
        try {
          setIsFetchingConfig(true);
          // ======================================================================
          // 🚀 API CALL LOCATION (DAILY ASSESSMENT QUEUE & DIFFICULTIES)
          // ======================================================================

          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Mock fallback logic updated with new DB names
          if (testQueue.length === 0) {
            setTestQueue([
              'Matching',
              'visual Sequence',
              'Bug Catch',
              'Light Reaction',
              'Colors Identification',
              'Color Sorting',
              'Sound Identification',
              'Path Sound',
              'Puzzle',
              'Odd One Out',
              'Drawing',
            ]);
          }
        } catch (error) {
          console.error('Failed to fetch assessment difficulties:', error);
        } finally {
          setIsFetchingConfig(false);
        }
      };

      fetchAssessmentDetails();
    }
  }, [mode, setTestDifficulties]);

  const TEST_DETAILS = {
    Matching: { title: 'Memory Match', icon: Brain, bg: 'bg-green-100', text: 'text-green-500' },
    'visual Sequence': { title: 'Visual Sequence', icon: Layers, bg: 'bg-green-100', text: 'text-green-500' },
    'Bug Catch': { title: 'Reaction Bug', icon: Hand, bg: 'bg-red-100', text: 'text-red-500' },
    'Light Reaction': { title: 'Light Reaction', icon: Zap, bg: 'bg-red-100', text: 'text-red-500' },
    'Colors Identification': { title: 'Color Explorer', icon: Palette, bg: 'bg-blue-100', text: 'text-blue-500' },
    'Color Sorting': { title: 'Color Sorting', icon: Archive, bg: 'bg-blue-100', text: 'text-blue-500' },
    'Sound Identification': { title: 'Sound Explorer', icon: Ear, bg: 'bg-purple-100', text: 'text-purple-500' },
    'Path Sound': { title: 'Path Sound', icon: Music, bg: 'bg-purple-100', text: 'text-purple-500' },
    Puzzle: { title: 'Puzzle Maker', icon: Puzzle, bg: 'bg-pink-100', text: 'text-pink-500' },
    'Odd One Out': { title: 'Odd One Out', icon: Search, bg: 'bg-pink-100', text: 'text-pink-500' },
    Drawing: { title: 'Creative Canvas', icon: PenTool, bg: 'bg-yellow-100', text: 'text-yellow-500' },
  };

  const gameDetails = currentGameId ? TEST_DETAILS[currentGameId] : null;

  const handleFinish = (score, metrics) => {
    let isGoodGame = false;

    if (metrics) {
      if (metrics.type === 'drawing') {
        isGoodGame = true;
      } else if (metrics.type === 'iq') {
        isGoodGame = parseFloat(metrics.ar) >= 50;
      } else if (metrics.redProfile !== undefined) {
        const arValue = parseFloat(metrics.ar);
        const rgbSum =
          parseFloat(metrics.redProfile) + parseFloat(metrics.greenProfile) + parseFloat(metrics.blueProfile);
        isGoodGame = arValue >= 50 && rgbSum >= 50;
      } else if (metrics.isr !== undefined) {
        const isrValue = parseFloat(metrics.isr);
        const aarlValue = parseFloat(metrics.aarl);
        isGoodGame = isrValue >= 50 && aarlValue > 0 && aarlValue <= 3.0;
      } else if (metrics.ar !== undefined && metrics.arl !== undefined) {
        const arValue = parseFloat(metrics.ar);
        const arlValue = parseFloat(metrics.arl);
        isGoodGame = arValue >= 50 && arlValue > 0 && arlValue <= 2.5;
      } else if (metrics.mrt !== undefined) {
        const piValue = parseFloat(metrics.pi);
        const mrtValue = parseFloat(metrics.mrt);
        isGoodGame = piValue >= 50 && mrtValue > 0 && mrtValue <= 1500;
      }
    } else {
      isGoodGame = score > 50;
    }

    if (mode === 'free') {
      setDevMetrics(metrics);
      setGameOver(true);
      if (isGoodGame) {
        setIsFestival(true);
        playSound(SOUNDS.win);
      } else {
        playSound(SOUNDS.fail);
      }
    } else if (mode === 'daily') {
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

      if (currentGameId !== 'Drawing') {
        setTestDifficulties((prev) => {
          const diff = prev[currentGameId];
          let newDiff = diff;
          if (isGoodGame) {
            if (diff === 'easy') newDiff = 'medium';
            else if (diff === 'medium') newDiff = 'hard';
          } else {
            if (diff === 'hard') newDiff = 'medium';
            else if (diff === 'medium') newDiff = 'easy';
          }
          return { ...prev, [currentGameId]: newDiff };
        });
      }

      const updatedResults = { ...dailyResults, [currentGameId]: { rawData: metrics } };
      setDailyResults(updatedResults);

      if (currentTestIndex < testQueue.length - 1) {
        setTimeout(
          () => {
            setIsFestival(false);
            setCurrentTestIndex((prev) => prev + 1);
          },
          isGoodGame ? 2500 : 500,
        );
      } else {
        setDevMetrics(updatedResults);
        const endDailySequence = () => {
          setGlobalStars((prev) => Math.max(0, prev + newSessionTotal));
          setGameOver(true);
        };
        setTimeout(
          () => {
            endDailySequence();
          },
          isGoodGame ? 2500 : 500,
        );
      }
    }
  };

  if (gameOver) {
    let feedbackMessage = 'Great Practice!';
    if (mode === 'daily') {
      feedbackMessage = 'Daily Tests Complete! 🌟';
    } else if (devMetrics) {
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
      <div
        className={`min-h-screen bg-sky-img flex flex-col items-center justify-center p-6 relative overflow-y-auto select-none [-webkit-tap-highlight-color:transparent]`}
      >
        {isFestival && <Confetti />}
        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full animate-in zoom-in duration-500 relative z-10 my-8">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{feedbackMessage}</h1>

          {mode === 'daily' ? (
            <div className="mb-8">
              <p className="text-xl text-gray-500 font-bold mb-2">Today's Session Result:</p>
              <p className="text-3xl font-black text-gray-800">
                {sessionStarsEarned > 0 ? '+' : ''}
                {sessionStarsEarned} <Star size={28} className="inline text-yellow-500 fill-yellow-500 mb-1" />
              </p>
              <p className="text-sm font-bold text-gray-400 mt-2">Total: {globalStars} Stars</p>
            </div>
          ) : (
            <p className="text-lg text-gray-400 font-bold mb-8">Practice makes perfect!</p>
          )}

          {IS_DEV && devMetrics && mode === 'free' && (
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
            {mode === 'free' && (
              <button
                onClick={() => {
                  setGameOver(false);
                  setDevMetrics(null);
                  setIsFestival(false);
                }}
                className={`w-full bg-blue-500 text-white font-bold py-4 rounded-full text-lg shadow-sm hover:opacity-90 transition-all flex justify-center items-center gap-2`}
              >
                <RotateCcw size={20} /> Play Again
              </button>
            )}
            <button
              onClick={() => navigate(mode === 'daily' ? '/child/dashboard' : '/child/free-play')}
              className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-full text-lg shadow-sm hover:bg-gray-200 transition-all"
            >
              {mode === 'daily' ? 'Back to Dashboard' : 'Back to Menu'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'daily' && !hasStartedDaily) {
    if (isFetchingConfig) {
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
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-full font-black text-gray-800 shadow-sm text-sm flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-yellow-400" /> {globalStars}
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
            <p className="text-xs text-blue-500 mb-2">
              Each test tracks your child's performance individually based on speed and accuracy!
            </p>
            <ul className="text-xs font-medium text-blue-600 space-y-1">
              <li>
                • <span className="font-bold">Pass a test:</span> It levels up (gets harder) next time.
              </li>
              <li>
                • <span className="font-bold">Struggle:</span> It levels down to help them practice.
              </li>
              <li>
                • <span className="font-bold">Stars:</span> Earned for completing tests. Harder tests give more stars!
              </li>
            </ul>
          </div>

          <div
            className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 rounded-xl custom-scrollbar"
            style={{ maxHeight: '40vh' }}
          >
            {testQueue.map((testId, index) => {
              const details = TEST_DETAILS[testId];
              // Fallback in case a key doesn't exactly match
              if (!details) return null;

              const TestIcon = details.icon;
              return (
                <div
                  key={testId}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${details.bg} ${details.text}`}
                  >
                    <TestIcon
                      size={24}
                      fill={testId !== 'Odd One Out' && testId !== 'Drawing' ? 'currentColor' : 'none'}
                    />
                  </div>
                  <div className="text-left flex-1 flex items-center justify-between">
                    <div>
                      <p className="font-black text-gray-400 text-[10px] uppercase tracking-wider">Test {index + 1}</p>
                      <p className={`font-black text-lg ${details.text}`}>{details.title}</p>
                    </div>
                    {testId !== 'Drawing' && (
                      <span className="text-[10px] font-black text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 uppercase tracking-wider">
                        {testDifficulties[testId] || 'EASY'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setHasStartedDaily(true)}
            className="w-full bg-[#fbbf24] text-gray-900 font-black py-4 px-6 rounded-full hover:scale-105 shadow-sm text-lg flex items-center justify-center gap-2 shrink-0"
          >
            Start <Play size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-sky-img font-sans relative select-none [-webkit-tap-highlight-color:transparent]`}>
      <div className="max-w-4xl mx-auto p-6 py-10 flex flex-col h-full">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate(mode === 'daily' ? '/child/dashboard' : '/child/free-play')}
            className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
          >
            <ArrowLeft size={18} /> {mode === 'daily' ? 'Back' : 'Quit'}
          </button>
          <div className="bg-white px-5 py-3 rounded-full font-black text-xl flex items-center shadow-sm border-2 border-gray-100 text-gray-800 text-center">
            {mode === 'daily'
              ? `Test ${currentTestIndex + 1}/${testQueue.length} : ${gameDetails?.title} (${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)})`
              : currentGameId === 'Drawing'
                ? gameDetails?.title
                : `${gameDetails?.title} (${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)})`}
          </div>
          <div className="bg-white px-4 py-2 rounded-full font-black text-lg flex items-center shadow-sm border-2 border-gray-100 text-gray-800">
            <Star size={18} className="mr-2 text-yellow-400 fill-yellow-400" /> {globalStars}
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          {currentGameId && (
            <>
              {/* Components rendered conditionally based on the new explicit names */}
              {currentGameId === 'Matching' && (
                <MemoryGame key={`memory-${currentTestIndex}`} difficulty={currentDifficulty} onFinish={handleFinish} />
              )}
              {currentGameId === 'visual Sequence' && (
                <VisualSequenceGame
                  key={`vseq-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === 'Bug Catch' && (
                <ReactionGame
                  key={`reaction-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === 'Light Reaction' && (
                <LightReactionGame
                  key={`lreact-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === 'Colors Identification' && (
                <ColorGame key={`color-${currentTestIndex}`} difficulty={currentDifficulty} onFinish={handleFinish} />
              )}
              {currentGameId === 'Color Sorting' && (
                <ColorSortingGame
                  key={`csort-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === 'Sound Identification' && (
                <HearingGame
                  key={`hearing-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === 'Path Sound' && (
                <PathSoundGame
                  key={`psound-${currentTestIndex}`}
                  difficulty={currentDifficulty}
                  onFinish={handleFinish}
                />
              )}
              {currentGameId === 'Puzzle' && (
                <PuzzleGame key={`puzzle-${currentTestIndex}`} difficulty={currentDifficulty} onFinish={handleFinish} />
              )}
              {currentGameId === 'Odd One Out' && (
                <OddOneOutGame key={`odd-${currentTestIndex}`} difficulty={currentDifficulty} onFinish={handleFinish} />
              )}
              {currentGameId === 'Drawing' && (
                <DrawingGame key={`drawing-${currentTestIndex}`} onFinish={handleFinish} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
