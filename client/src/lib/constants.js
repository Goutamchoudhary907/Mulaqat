// In production the API is served from the same origin (relative '/api'),
// so this is empty. Set VITE_API_URL only to point at a separate backend.
// In dev, Vite proxies '/api' and '/socket.io' to the backend (see vite.config.js).
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

export const AVATAR_STYLES = ['avataaars', 'adventurer', 'lorelei', 'micah', 'big-smile', 'notionists'];

export const avatarUrl = (style, seed, opts) => {
  const params = new URLSearchParams({ seed: String(seed) });
  if (opts) for (const [key, value] of Object.entries(opts)) params.set(key, String(value));
  return `https://api.dicebear.com/7.x/${style}/svg?${params.toString()}`;
};

/* Clear, cartoon-style avatar sets that lean to the chosen gender.
   `facialHairProbability` forces / removes beards so faces read male vs female. */
const MALE_AVATARS = [
  { style: 'avataaars', opts: { facialHairProbability: 100 } },
  { style: 'micah', opts: { facialHairProbability: 100 } },
  { style: 'adventurer' },
  { style: 'notionists' },
  { style: 'personas' },
  { style: 'big-smile' },
];

const FEMALE_AVATARS = [
  { style: 'lorelei' },
  { style: 'avataaars', opts: { facialHairProbability: 0 } },
  { style: 'micah', opts: { facialHairProbability: 0 } },
  { style: 'big-smile' },
  { style: 'adventurer' },
  { style: 'notionists' },
];

const NEUTRAL_AVATARS = [
  { style: 'avataaars' },
  { style: 'micah' },
  { style: 'adventurer' },
  { style: 'lorelei' },
  { style: 'big-smile' },
  { style: 'notionists' },
];

/** Six avatar options appropriate for the user's gender. */
export function avatarChoicesFor(gender, seedBase) {
  const pool = gender === 'male' ? MALE_AVATARS : gender === 'female' ? FEMALE_AVATARS : NEUTRAL_AVATARS;
  return pool.map(({ style, opts }, i) => ({
    key: `${style}-${i}`,
    url: avatarUrl(style, `${seedBase}-${i}`, opts),
  }));
}
