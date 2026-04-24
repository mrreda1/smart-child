import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEME } from '@/constants/config';
import { useAppContext } from '@/context/AppContext';
import {
  Archive,
  ArrowLeft,
  Brain,
  Ear,
  Hand,
  Layers,
  Music,
  Palette,
  PenTool,
  Puzzle,
  Search,
  Star,
  Zap,
} from 'lucide-react';

export const FreePlayMenu = () => {
  const navigate = useNavigate();
  const { globalStars } = useAppContext();
  const [difficulty, setDifficulty] = useState('easy');
  const [activeCategory, setActiveCategory] = useState(null);

  const CATEGORIES = [
    {
      id: 'memory',
      title: 'Memory',
      desc: 'Matching & Sequencing',
      icon: Brain,
      color: 'bg-[#86D293]',
      border: 'border-[#5dbb6d]',
    },
    {
      id: 'reaction',
      title: 'Reaction Speed',
      desc: 'Speed & Reflexes',
      icon: Zap,
      color: 'bg-[#ff5e5e]',
      border: 'border-[#e65a5a]',
    },
    {
      id: 'color',
      title: 'Color',
      desc: 'Recognition & Sorting',
      icon: Palette,
      color: 'bg-[#60A5FA]',
      border: 'border-[#3b82f6]',
    },
    {
      id: 'hearing',
      title: 'Hearing',
      desc: 'Sound & Path Matching',
      icon: Ear,
      color: 'bg-[#a78bfa]',
      border: 'border-[#8b5cf6]',
    },
    { id: 'iq', title: 'IQ', desc: 'Puzzles & Logic', icon: Puzzle, color: 'bg-[#F472B6]', border: 'border-[#db2777]' },
    {
      id: 'drawing',
      title: 'Drawing',
      desc: 'Creative Canvas',
      icon: PenTool,
      color: 'bg-[#fbbf24]',
      border: 'border-[#f59e0b]',
    },
  ];

  const GAMES_BY_CAT = {
    memory: [
      { id: 'memory', title: 'Memory Match', desc: 'Find hidden pairs', icon: Brain },
      { id: 'visual_sequence', title: 'Visual Sequence', desc: 'Repeat the pattern', icon: Layers },
    ],
    reaction: [
      { id: 'reaction', title: 'Reaction Bug', desc: 'Tap bug fast', icon: Hand },
      { id: 'light_reaction', title: 'Light Reaction', desc: 'Tap on green light', icon: Zap },
    ],
    color: [
      { id: 'color', title: 'Color Explorer', desc: 'Find shapes in color', icon: Palette },
      { id: 'color_sorting', title: 'Color Sorting', desc: 'Sort colors in bins', icon: Archive },
    ],
    hearing: [
      { id: 'hearing', title: 'Sound Explorer', desc: 'Match the sounds', icon: Ear },
      { id: 'path_sound', title: 'Path Sound', desc: 'Follow the sounds', icon: Music },
    ],
    iq: [
      { id: 'puzzle', title: 'Puzzle Maker', desc: 'Solve image puzzle', icon: Puzzle },
      { id: 'odd_one_out', title: 'Odd One Out', desc: 'Find the different one', icon: Search },
    ],
    drawing: [{ id: 'drawing', title: 'Creative Canvas', desc: 'Draw pictures', icon: PenTool }],
  };

  return (
    <div
      className={`min-h-screen ${THEME.bgBeige} font-sans relative select-none [-webkit-tap-highlight-color:transparent]`}
    >
      <div className="max-w-6xl mx-auto p-6 py-10 flex flex-col h-full">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => (activeCategory ? setActiveCategory(null) : navigate('/child/dashboard'))}
            className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="bg-white px-5 py-2.5 rounded-full font-black text-lg flex items-center shadow-sm border-2 border-gray-100 text-gray-800">
            <Star size={20} className="mr-2 text-yellow-400 fill-yellow-400" /> {globalStars} Stars
          </div>
        </header>

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            {activeCategory ? 'Choose a Game!' : 'Choose a Category!'}
          </h1>
        </div>

        {activeCategory && activeCategory !== 'drawing' && (
          <div className="flex justify-center mb-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-full p-1.5 shadow-sm flex border border-gray-100 max-w-md w-full">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 rounded-full font-black text-sm capitalize transition-all ${difficulty === level ? THEME.primaryYellow + ' text-black shadow-md scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {!activeCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`${cat.color} text-white p-8 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 ${cat.border}`}
              >
                <div className="bg-white/20 p-6 rounded-full mb-4">
                  <cat.icon size={48} fill="currentColor" />
                </div>
                <h2 className="text-3xl font-black mb-2">{cat.title}</h2>
                <p className="text-white/80 font-bold text-sm">{cat.desc}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom duration-500">
            {GAMES_BY_CAT[activeCategory].map((game) => {
              const activeCatDetails = CATEGORIES.find((c) => c.id === activeCategory);
              return (
                <button
                  key={game.id}
                  onClick={() => navigate('/child/game', { state: { mode: 'free', gameId: game.id, difficulty } })}
                  className={`${activeCatDetails.color} text-white p-6 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 ${activeCatDetails.border}`}
                >
                  <div className="bg-white/20 p-4 rounded-full mb-4">
                    <game.icon size={40} fill="currentColor" />
                  </div>
                  <h2 className="text-xl font-black mb-1">{game.title}</h2>
                  <p className="text-white/80 font-bold text-xs">{game.desc}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
