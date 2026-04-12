import { Hand, Brain, Ear, PenTool, Palette } from "lucide-react";

const MOCK_REPORTS_DATA = {
  memory: {
    title: "Memory Match",
    icon: Brain,
    color: "bg-[#86D293]",
    textColor: "text-[#86D293]",
    history: [
      { ar: 40, arl: 4.5 },
      { ar: 55, arl: 3.8 },
      { ar: 60, arl: 3.0 },
      { ar: 80, arl: 2.2 },
      { ar: 95, arl: 1.2 },
    ],
    insight:
      "Watch the orange dotted line! If it goes down while the green accuracy line stays high, it means the child is getting faster and remembering pairs automatically.",
    metrics: { Accuracy: "95.0%", "Average Speed": "1.2s", "Pairs Found": 8 },
  },
  reaction: {
    title: "Reaction Speed",
    icon: Hand,
    color: "bg-[#ff5e5e]",
    textColor: "text-[#ff5e5e]",
    history: [
      { pi: 40, mrt: 1800 },
      { pi: 55, mrt: 1500 },
      { pi: 60, mrt: 1200 },
      { pi: 75, mrt: 900 },
      { pi: 88, mrt: 640 },
    ],
    insight:
      "A downward red line is great—it means the child is reacting faster! The blue bars show accuracy, helping us see if they are focused or just tapping randomly.",
    metrics: {
      "Hit Accuracy": "88.0%",
      "Reaction Time": "640ms",
      "Total Hits": 44,
    },
  },
  color: {
    title: "Color Recognition",
    icon: Palette,
    color: "bg-[#60A5FA]",
    textColor: "text-[#60A5FA]",
    history: [70, 75, 80, 90, 100],
    rgbProfile: { r: 85, g: 100, b: 100 },
    insight:
      "The triangle chart shows how well the child spots different colors. If it looks balanced, color vision is great! If one corner is pulled in, they might need practice with that specific color.",
    metrics: {
      "Overall Accuracy": "100%",
      "Red Recognition": "85%",
      "Green Recognition": "100%",
      "Blue Recognition": "100%",
    },
  },
  hearing: {
    title: "Hearing Test",
    icon: Ear,
    color: "bg-[#a78bfa]",
    textColor: "text-[#a78bfa]",
    history: [
      { isr: 60, aarl: 3.5 },
      { isr: 65, aarl: 2.8 },
      { isr: 80, aarl: 2.0 },
      { isr: 85, aarl: 1.5 },
      { isr: 90, aarl: 0.8 },
    ],
    insight:
      "Kids often get the sounds right easily. The grey bars are the real clue—shorter bars mean the child is recognizing the sounds faster and with less effort!",
    metrics: {
      "Correct Sounds": "90.0%",
      "Response Time": "0.8s",
      "Sounds Heard": 10,
    },
  },
  drawing: {
    title: "Creative Canvas",
    icon: PenTool,
    color: "bg-[#fbbf24]",
    textColor: "text-[#fbbf24]",
  },
};

const OVERALL_RECOMMENDATION =
  "The child shows an excellent, balanced cognitive profile with an overall growth trend of +15% over the last 5 sessions. Memory and Color recognition are significant strengths. We recommend continuing the daily 15-minute sessions, with a slight focus on reaction-based activities to align motor-reflex speed with their high visual processing accuracy.";

const MOCK_HISTORY_DATA = [
  {
    id: "sess_001",
    date: "Today, 2:30 PM",
    title: "Daily Assessment",
    score: "Excellent",
    recommendation:
      "The child shows an excellent, balanced cognitive profile today. Memory and Color recognition are significant strengths. We recommend continuing the daily sessions.",
    tests: [
      {
        testId: "memory",
        title: "Memory Match",
        score: "95%",
        metrics: { Accuracy: "95.0%", "Average Speed": "1.2s" },
      },
      {
        testId: "reaction",
        title: "Reaction Bug",
        score: "88%",
        metrics: { "Hit Accuracy": "88.0%", "Reaction Time": "640ms" },
      },
      {
        testId: "color",
        title: "Color Explorer",
        score: "100%",
        metrics: { Accuracy: "100%", "Color Recognition": "Perfect" },
      },
      {
        testId: "hearing",
        title: "Sound Explorer",
        score: "90%",
        metrics: { Accuracy: "90.0%", "Response Time": "0.8s" },
      },
      {
        testId: "drawing",
        title: "Creative Canvas",
        score: "Completed",
        metrics: { Expression: "Happy 😊", Focus: "High" },
      },
    ],
  },
];

export { MOCK_REPORTS_DATA, OVERALL_RECOMMENDATION, MOCK_HISTORY_DATA };
