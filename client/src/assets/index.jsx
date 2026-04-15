// Landing Page Images
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

// Default Child Icons
import blackBoyIcon from "@/assets/images/childIcons/blackBoy.png";
import blackGirlIcon from "@/assets/images/childIcons/blackGirl.png";
import boyBlackHair from "@/assets/images/childIcons/boyBlackHair.png";
import boyBrownHair from "@/assets/images/childIcons/boyBrownHair.png";
import boyYellowHair from "@/assets/images/childIcons/boyYellowHair.png";
import girlBlackHair from "@/assets/images/childIcons/girlBlackHair.png";
import girlYellowHair from "@/assets/images/childIcons/girlYellowHair.png";

const childAvatars = [
  boyYellowHair,
  boyBlackHair,
  boyBrownHair,
  blackBoyIcon,
  girlYellowHair,
  girlBlackHair,
  blackGirlIcon,
];

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
  childAvatars,
};

const SOUNDS = {
  click:
    "https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3",
  match:
    "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3",
  win: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3",
};

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

export { ASSETS, SOUNDS, HEARING_ITEMS, AUDIO_CACHE, playSound };
