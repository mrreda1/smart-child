import heroImage from "@/assets/images/home.png";
import logo from "@/assets/images/logo.png";
import flower from "@/assets/images/flower.png";
import doubleHeart from "@/assets/images/doubleHeart.png";
import star from "@/assets/images/star.png";
import sun from "@/assets/images/sun.png";
import forParents from "@/assets/images/forParents.png";
import auth from "@/assets/images/auth.png";
import memoryTest from "@/assets/images/memoryTest.jpg";
import reactionSpeedTest from "@/assets/images/reactionSpeedTest.jpg";
import colorTest from "@/assets/images/colorTest.jpg";
import hearingTest from "@/assets/images/hearingTest.jpg";
import drawingTest from "@/assets/images/drawingTest.jpg";

const ASSETS = {
  auth,
  logo,
  heroImage,
  flower,
  doubleHeart,
  star,
  sun,
  forParents,
  memoryTest,
  reactionSpeedTest,
  colorTest,
  hearingTest,
  drawingTest,
  avatars: {
    child1:
      "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=b6e3f4",
    child2:
      "https://api.dicebear.com/7.x/micah/svg?seed=Mia&backgroundColor=ffdfbf",
    parent:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Parent&backgroundColor=e2e8f0",
  },
};

const SOUNDS = {
  click:
    "https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3",
  match:
    "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3",
  win: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3",
};

const PREDEFINED_AVATARS = [
  "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/micah/svg?seed=Mia&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/micah/svg?seed=Leo&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/micah/svg?seed=Zoe&backgroundColor=ffb8b8",
];

const HEARING_ITEMS = [
  {
    id: "dog",
    emoji: "🐶",
    sound:
      "https://assets.mixkit.co/sfx/preview/mixkit-dog-barking-twice-1.mp3",
  },
  {
    id: "cat",
    emoji: "🐱",
    sound:
      "https://assets.mixkit.co/sfx/preview/mixkit-sweet-kitty-meow-93.mp3",
  },
  {
    id: "car",
    emoji: "🚗",
    sound: "https://assets.mixkit.co/sfx/preview/mixkit-car-horn-718.mp3",
  },
  {
    id: "bird",
    emoji: "🐦",
    sound:
      "https://assets.mixkit.co/sfx/preview/mixkit-jungle-bird-chirp-212.mp3",
  },
  {
    id: "cow",
    emoji: "🐮",
    sound: "https://assets.mixkit.co/sfx/preview/mixkit-cow-moo-1744.mp3",
  },
  {
    id: "bell",
    emoji: "🔔",
    sound:
      "https://assets.mixkit.co/sfx/preview/mixkit-front-desk-bells-510.mp3",
  },
  {
    id: "train",
    emoji: "🚆",
    sound:
      "https://assets.mixkit.co/sfx/preview/mixkit-train-door-bell-1664.mp3",
  },
  {
    id: "frog",
    emoji: "🐸",
    sound: "https://assets.mixkit.co/sfx/preview/mixkit-frog-croak-108.mp3",
  },
];

const AUDIO_CACHE = {};
const playSound = (url) => {
  try {
    if (!AUDIO_CACHE[url]) {
      AUDIO_CACHE[url] = new Audio(url);
    }
    const audio = AUDIO_CACHE[url].cloneNode();
    audio.play().catch((e) => console.warn("Audio play blocked:", e));
  } catch (e) {
    console.warn("Audio not supported");
  }
};

export {
  ASSETS,
  SOUNDS,
  PREDEFINED_AVATARS,
  HEARING_ITEMS,
  AUDIO_CACHE,
  playSound,
};
