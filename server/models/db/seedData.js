const categoryMap = {
  Memory: ['Matching', 'visual Sequence'],

  'Reaction Speed': ['Bug Catch', 'Light Reaction'],

  'Color Explore': ['Colors Identification', 'Color Sorting'],

  Hearing: ['Sound Identification', 'Path Sound'],

  IQ: ['Puzzle', 'Odd One Out'],

  Art: ['Drawing'],
};

const testsDescription = {
  Matching: { easy: { targetPairs: 3 }, medium: { targetPairs: 6 }, hard: { targetPairs: 8 } },

  'visual Sequence': {
    easy: { seqLength: 3, totalRounds: 3 },
    medium: { seqLength: 4, totalRounds: 3 },
    hard: { seqLength: 5, totalRounds: 3 },
  },

  'Bug Catch': {
    easy: { initialTime: 25, bugLifespan: 1500, objectSize: 'large' },
    medium: { initialTime: 20, bugLifespan: 1000, objectSize: 'normal' },
    hard: { initialTime: 15, bugLifespan: 850, objectSize: 'tiny' },
  },

  'Light Reaction': { easy: { totalRounds: 5 }, medium: { totalRounds: 8 }, hard: { totalRounds: 10 } },

  'Colors Identification': { easy: { numRounds: 4 }, medium: { numRounds: 6 }, hard: { numRounds: 8 } },

  'Color Sorting': { easy: { maxRounds: 6 }, medium: { maxRounds: 9 }, hard: { maxRounds: 12 } },

  'Sound Identification': {
    easy: { numOptions: 3, numRounds: 4 },
    medium: { numOptions: 6, numRounds: 6 },
    hard: { numOptions: 8, numRounds: 8 },
  },

  'Path Sound': {
    easy: { seqLength: 3, totalRounds: 3 },
    medium: { seqLength: 4, totalRounds: 3 },
    hard: { seqLength: 5, totalRounds: 3 },
  },

  Puzzle: { easy: { gridSize: 2 }, medium: { gridSize: 3 }, hard: { gridSize: 4 } },

  'Odd One Out': { easy: { maxRounds: 5 }, medium: { maxRounds: 5 }, hard: { maxRounds: 5 } },

  Drawing: { easy: {}, medium: {}, hard: {} },
};

module.exports = { categoryMap, testsDescription };
