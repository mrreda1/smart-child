// Landing Page Images
import heroImage from '@/assets/images/home.png';
import logo from '@/assets/images/logo.png';
import flower from '@/assets/images/flower.png';
import doubleHeart from '@/assets/images/doubleHeart.png';
import star from '@/assets/images/star.png';
import sun from '@/assets/images/sun.png';
import forParents from '@/assets/images/forParents.png';
import auth from '@/assets/images/auth.png';
import memoryTest from '@/assets/images/memoryTest.jpg';
import reactionSpeedTest from '@/assets/images/reactionSpeedTest.jpg';
import colorTest from '@/assets/images/colorTest.jpg';
import hearingTest from '@/assets/images/hearingTest.jpg';
import drawingTest from '@/assets/images/drawingTest.jpg';

// Sounds
import clickSound from '@/assets/sounds/click.mp3';
import matchSound from '@/assets/sounds/match.mp3';
import winSound from '@/assets/sounds/win.mp3';
import dogSound from '@/assets/sounds/dog.mp3';
import catSound from '@/assets/sounds/cat.mp3';
import carSound from '@/assets/sounds/car.mp3';
import birdSound from '@/assets/sounds/bird.mp3';
import cowSound from '@/assets/sounds/cow.mp3';
import bellSound from '@/assets/sounds/bell.mp3';
import trainSound from '@/assets/sounds/train.mp3';
import frogSound from '@/assets/sounds/frog.mp3';
import wrongSound from '@/assets/sounds/wrong.mp3';
import failSound from '@/assets/sounds/fail.mp3';
import cowntdown from '@/assets/sounds/cowntdown.mp3';

// Default Child Icons
import blackBoyIcon from '@/assets/images/childIcons/blackBoy.png';
import blackGirlIcon from '@/assets/images/childIcons/blackGirl.png';
import boyBlackHair from '@/assets/images/childIcons/boyBlackHair.png';
import boyBrownHair from '@/assets/images/childIcons/boyBrownHair.png';
import boyYellowHair from '@/assets/images/childIcons/boyYellowHair.png';
import girlBlackHair from '@/assets/images/childIcons/girlBlackHair.png';
import girlYellowHair from '@/assets/images/childIcons/girlYellowHair.png';

// Puzzle Images
import mickyMouse from '@/assets/images/mickeyMouse.png';
import gumball from '@/assets/images/gumball.png';
import wennyBear from '@/assets/images/wennyBear.png';
import tomJerry from '@/assets/images/tomJerry.png';
import lionTheKing from '@/assets/images/lionTheKing.png';

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
  click: clickSound,
  match: matchSound,
  wrong: wrongSound,
  win: winSound,
  fail: failSound,
  cowntdown,
};

const HEARING_ITEMS = [
  {
    id: 'dog',
    emoji: '🐶',
    sound: dogSound,
  },
  {
    id: 'cat',
    emoji: '🐱',
    sound: catSound,
  },
  {
    id: 'car',
    emoji: '🚗',
    sound: carSound,
  },
  {
    id: 'bird',
    emoji: '🐦',
    sound: birdSound,
  },
  {
    id: 'cow',
    emoji: '🐮',
    sound: cowSound,
  },
  {
    id: 'bell',
    emoji: '🔔',
    sound: bellSound,
  },
  {
    id: 'train',
    emoji: '🚆',
    sound: trainSound,
  },
  {
    id: 'frog',
    emoji: '🐸',
    sound: frogSound,
  },
];
const PUZZLE_IMAGES = [mickyMouse, gumball, wennyBear, tomJerry, lionTheKing];

export { ASSETS, SOUNDS, HEARING_ITEMS, PUZZLE_IMAGES };
