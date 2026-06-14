import { BOY_AVATARS, GIRL_AVATARS } from './avatars';

export const API_URL = import.meta.env.VITE_API_URL || '';

export const VIBE_QUESTIONS = [
  {
    q: "It's 6 PM after the last lecture. Where are you?",
    options: ['Chai at Datre ☕', 'Straight home, headphones on 🎧', 'Ground — sports till dark 🏏', 'Roaming Treasure Island 🛍️'],
  },
  {
    q: 'Exam season strategy?',
    options: ['Library since day one 📚', 'One legendary all-nighter 🌙', 'Group study (10% study) 👥', 'Bhagwan bharose 🙏'],
  },
  {
    q: 'Your love language is…',
    options: ['Sending memes at 2 AM 😂', 'Long deep talks 🌌', 'Sharing food (huge deal) 🍕', 'Making playlists 🎶'],
  },
  {
    q: 'Ideal first mulaqat?',
    options: ['Samosa at the Main Canteen 🥟', 'Sunset walk to MediSquare 🌇', 'Movie + bhutta 🍿', 'Long ride on the bypass 🏍️'],
  },
  {
    q: 'Your texting style?',
    options: ['Replies in 0.2 seconds ⚡', 'Seen. Will reply… eventually 💤', 'Voice notes only 🎙️', 'Full paragraphs, full grammar ✍️'],
  },
];

export const INTERESTS = [
  'Music', 'Foodie', 'Gym', 'Cricket', 'Coding', 'Anime', 'Photography', 'Dance',
  'Gaming', 'Travel', 'Books', 'Movies', 'Art', 'Fashion', 'Startups', 'Bikes',
  'Poetry', 'Badminton',
];

export const BRANCHES = [
  'CSE', 'IT', 'AIML', 'Data Science', 'ECE', 'EE', 'Mechanical', 'Civil',
  'MBA', 'BBA', 'B.Com', 'B.Pharma', 'Law', 'Other',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG'];

export const SPOTS = [
  'MediSquare', 'Main Canteen', 'Datre', 'V Block', 'Q Block', 'CKD',
  'CKD Square', 'Library', 'Bus Stand', 'Somewhere on campus',
];

export const avatarUrl = (style, seed, opts) => {
  const params = new URLSearchParams();
  params.set('seed', String(seed));
  if (opts) {
    for (const [key, value] of Object.entries(opts)) {
      if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)));
      else params.set(key, String(value));
    }
  }
  return `https://api.dicebear.com/7.x/${style}/svg?${params.toString()}`;
};

const FRIENDLY = {
  mouth: ['default', 'smile', 'twinkle'],
  eyes: ['default', 'happy', 'wink'],
  eyebrows: ['default', 'defaultNatural', 'raisedExcitedNatural'],
  accessoriesProbability: 0,
  hairColor: ['2c1b18', '4a312c', '724133', 'a55728', 'b58143', 'c93305', 'd6b370'],
};
const MALE_HAIR = ['shortFlat', 'shortRound', 'shortWaved', 'shortCurly', 'theCaesar', 'theCaesarAndSidePart', 'sides', 'frizzle'];
const FEMALE_HAIR = ['straight01', 'straight02', 'straightAndStrand', 'bob', 'bun', 'curly', 'curvy', 'longButNotTooLong', 'miaWallace', 'bigHair', 'frida', 'fro'];
const MALE_CLOTHING = ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt', 'hoodie', 'shirtCrewNeck', 'shirtVNeck'];
const MALE_CLOTHES_COLORS = ['262e33', '3c4f5c', '5199e4', '25557c', '929598', '65c9ff', 'b1e2ff', 'e6e6e6'];

const optsForGender = (gender) => {
  if (gender === 'female') return { ...FRIENDLY, top: FEMALE_HAIR, facialHairProbability: 0 };
  if (gender === 'male') {
    return {
      ...FRIENDLY, top: MALE_HAIR, facialHairProbability: 70, facialHair: ['beardLight', 'beardMedium', 'moustacheFancy'],
      clothing: MALE_CLOTHING, clothesColor: MALE_CLOTHES_COLORS,
    };
  }
  return { ...FRIENDLY, top: [...MALE_HAIR, ...FEMALE_HAIR], facialHairProbability: 30, facialHair: ['beardLight', 'moustacheFancy'] };
};

export const niceAvatar = (gender, seed) => avatarUrl('avataaars', seed, optsForGender(gender));

const poolForGender = (gender) =>
  gender === 'female' ? GIRL_AVATARS : gender === 'male' ? BOY_AVATARS : [...BOY_AVATARS, ...GIRL_AVATARS];

const PER_PAGE = 12;

export function avatarChoicesFor(gender, page = 0) {
  const pool = poolForGender(gender);
  const start = pool.length ? (Math.abs(page) * PER_PAGE) % pool.length : 0;
  const count = Math.min(PER_PAGE, pool.length);
  return Array.from({ length: count }, (_, i) => {
    const idx = (start + i) % pool.length;
    return { key: `${gender || 'x'}-${start + i}`, url: pool[idx] };
  });
}
