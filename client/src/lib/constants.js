export const API_URL = 'http://localhost:5000';

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

export const AVATAR_STYLES = ['adventurer', 'lorelei', 'notionists', 'micah', 'open-peeps', 'big-smile'];

export const avatarUrl = (style, seed) =>
  `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
