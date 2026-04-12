import { useState, createContext, useContext } from "react";

import { ASSETS } from "../assets";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [globalStars, setGlobalStars] = useState(0);
  const [parentData, setParentData] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [profiles, setProfiles] = useState([
    {
      id: "1",
      name: "Leo",
      age: 5,
      gender: "M",
      avatar: ASSETS.avatars.child1,
      role: "owner",
      lastActive: "Today",
    },
    {
      id: "2",
      name: "Mia",
      age: 6,
      gender: "F",
      avatar: ASSETS.avatars.child2,
      role: "linked",
      lastActive: "Yesterday",
    },
  ]);

  const [testDifficulties, setTestDifficulties] = useState({
    memory: "easy",
    reaction: "easy",
    color: "easy",
    hearing: "easy",
    drawing: "easy",
  });

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContextProvider, useAppContext };
