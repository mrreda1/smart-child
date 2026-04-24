import { useState, createContext, useContext } from 'react';

import { ASSETS } from '../assets';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [globalStars, setGlobalStars] = useState(0);
  const [parentData, setParentData] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [profiles, setProfiles] = useState([
    {
      id: '1',
      name: 'Leo',
      age: 5,
      gender: 'M',
      avatar: ASSETS.childAvatars[2],
      role: 'owner',
      lastActive: 'Today',
    },
    {
      id: '2',
      name: 'Mia',
      age: 6,
      gender: 'F',
      avatar: ASSETS.childAvatars[4],
      role: 'linked',
      lastActive: 'Yesterday',
    },
  ]);

  const [testDifficulties, setTestDifficulties] = useState({
    memory: 'easy',
    reaction: 'easy',
    color: 'easy',
    hearing: 'easy',
    drawing: 'easy',
  });

  const DEFAULT_SERVER_CONFIG = {
    memory: { easy: { targetPairs: 3 }, medium: { targetPairs: 6 }, hard: { targetPairs: 8 } },
    visual_sequence: {
      easy: { seqLength: 3, totalRounds: 3 },
      medium: { seqLength: 4, totalRounds: 3 },
      hard: { seqLength: 5, totalRounds: 3 },
    },
    reaction: {
      easy: { initialTime: 25, bugLifespan: 1500 },
      medium: { initialTime: 20, bugLifespan: 1000 },
      hard: { initialTime: 15, bugLifespan: 850 },
    },
    light_reaction: { easy: { totalRounds: 5 }, medium: { totalRounds: 8 }, hard: { totalRounds: 10 } },
    color: { easy: { numRounds: 4 }, medium: { numRounds: 6 }, hard: { numRounds: 8 } },
    color_sorting: { easy: { maxRounds: 6 }, medium: { maxRounds: 9 }, hard: { maxRounds: 12 } },
    hearing: {
      easy: { numOptions: 3, numRounds: 4 },
      medium: { numOptions: 6, numRounds: 6 },
      hard: { numOptions: 8, numRounds: 8 },
    },
    path_sound: {
      easy: { seqLength: 3, totalRounds: 3 },
      medium: { seqLength: 4, totalRounds: 3 },
      hard: { seqLength: 5, totalRounds: 3 },
    },
    puzzle: { easy: { gridSize: 2 }, medium: { gridSize: 3 }, hard: { gridSize: 4 } },
    odd_one_out: { easy: { maxRounds: 5 }, medium: { maxRounds: 5 }, hard: { maxRounds: 5 } },
    drawing: { easy: {}, medium: {}, hard: {} },
  };

  const [testConfigs, setTestConfigs] = useState(DEFAULT_SERVER_CONFIG);

  return (
    <AppContext.Provider
      value={{
        parentData,
        setParentData,
        activeChild,
        setActiveChild,
        profiles,
        setProfiles,
        globalStars,
        setGlobalStars,
        testDifficulties,
        setTestDifficulties,
        testConfigs,
        setTestConfigs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContextProvider, useAppContext };
