const assessmentThresholds = {
  Memory: {
    accuracy: { struggle: 55, mastery: 75 },
    latencyMs: { struggle: 3500, mastery: 1800 },
  },
  ReactionSpeed: {
    responseTimeMs: { struggle: 1000, mastery: 600 },
    precision: { struggle: 50, mastery: 85 },
  },
  ColorExplore: {
    accuracy: { struggle: 65, mastery: 85 },
    rgbProfile: { struggle: 40, mastery: 60 },
  },
  Hearing: {
    successRate: { struggle: 60, mastery: 80 },
    latencyMs: { struggle: 3000, mastery: 1500 },
  },
  IQ: {
    accuracy: { struggle: 60, mastery: 80 },
    responseTimeMs: { struggle: 4000, mastery: 2000 },
  },
};

module.exports = { assessmentThresholds };
