import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Confession from './models/Confession.js';
import { pseudonym } from './utils/helpers.js';

dotenv.config();

// Clear, cartoon avatars that read male / female (beard forced on / off).
const MALE_STYLES = ['avataaars', 'micah', 'adventurer', 'personas'];
const FEMALE_STYLES = ['lorelei', 'avataaars', 'micah', 'big-smile'];

const avatar = (gender, seed, i = 0) => {
  const pool = gender === 'female' ? FEMALE_STYLES : MALE_STYLES;
  const style = pool[i % pool.length];
  const params = new URLSearchParams({ seed });
  params.set('facialHairProbability', gender === 'female' ? '0' : '100');
  return `https://api.dicebear.com/7.x/${style}/svg?${params.toString()}`;
};

// Every sample account's password is "medicaps123" — log in as any of them
// to test matching and chat from both sides.
const SAMPLE_STUDENTS = [
  { name: 'Priya Sharma', gender: 'female', interestedIn: 'male', branch: 'CSE', year: '3rd Year', vibe: [0, 2, 0, 0, 0], interests: ['Music', 'Foodie', 'Photography', 'Movies'], bio: 'Chai > coffee, fight me. Found at the canteen more than in class.', style: 'lorelei' },
  { name: 'Arjun Verma', gender: 'male', interestedIn: 'female', branch: 'Mechanical', year: '4th Year', vibe: [0, 1, 1, 0, 3], interests: ['Cricket', 'Bikes', 'Music', 'Gym'], bio: 'Will write you bad poetry and good chai. Last bench, big dreams.', style: 'adventurer' },
  { name: 'Sana Khan', gender: 'female', interestedIn: 'everyone', branch: 'MBA', year: 'PG', vibe: [3, 2, 1, 1, 3], interests: ['Travel', 'Books', 'Art', 'Startups'], bio: 'Looking for a Sarafa night-market partner. Must tolerate my food photos.', style: 'lorelei' },
  { name: 'Rohan Patel', gender: 'male', interestedIn: 'female', branch: 'IT', year: '2nd Year', vibe: [1, 0, 0, 2, 0], interests: ['Coding', 'Gaming', 'Anime', 'Movies'], bio: 'Debugging code and my life simultaneously. Send memes.', style: 'micah' },
  { name: 'Ananya Gupta', gender: 'female', interestedIn: 'male', branch: 'AIML', year: '2nd Year', vibe: [1, 0, 1, 1, 3], interests: ['Coding', 'Books', 'Music', 'Poetry'], bio: 'Training models by day, overthinking by night. My playlists slap.', style: 'notionists' },
  { name: 'Kabir Singh Rajput', gender: 'male', interestedIn: 'female', branch: 'CSE', year: '3rd Year', vibe: [2, 3, 2, 3, 1], interests: ['Gym', 'Cricket', 'Bikes', 'Foodie'], bio: 'Gym at 6, ground at 5, somehow still failing one subject. Balanced.', style: 'adventurer' },
  { name: 'Ishita Jain', gender: 'female', interestedIn: 'male', branch: 'B.Pharma', year: '3rd Year', vibe: [0, 2, 2, 0, 1], interests: ['Foodie', 'Dance', 'Fashion', 'Movies'], bio: 'Will judge you by your samosa-eating technique. 56 Dukan connoisseur.', style: 'lorelei' },
  { name: 'Aditya Tiwari', gender: 'male', interestedIn: 'female', branch: 'ECE', year: '1st Year', vibe: [3, 3, 0, 3, 0], interests: ['Bikes', 'Travel', 'Photography', 'Music'], bio: 'Fresher with a camera and too much optimism. Show me around?', style: 'open-peeps' },
  { name: 'Mehak Chouhan', gender: 'female', interestedIn: 'everyone', branch: 'Law', year: '2nd Year', vibe: [2, 0, 1, 1, 3], interests: ['Books', 'Art', 'Poetry', 'Startups'], bio: 'Future lawyer, current overthinker. I will win every argument except feelings.', style: 'notionists' },
  { name: 'Veer Malhotra', gender: 'male', interestedIn: 'female', branch: 'BBA', year: '3rd Year', vibe: [3, 2, 3, 2, 2], interests: ['Startups', 'Music', 'Travel', 'Gaming'], bio: 'Pitch deck by day, playlists by night. Voice notes > texts.', style: 'micah' },
  { name: 'Tanvi Deshmukh', gender: 'female', interestedIn: 'male', branch: 'CSE', year: '1st Year', vibe: [1, 2, 3, 2, 0], interests: ['Anime', 'Gaming', 'Art', 'Music'], bio: 'Fresher. Anime recommendations = instant friendship. Maybe more.', style: 'lorelei' },
  { name: 'Harsh Solanki', gender: 'male', interestedIn: 'female', branch: 'Civil', year: '4th Year', vibe: [0, 2, 2, 0, 1], interests: ['Cricket', 'Foodie', 'Movies', 'Gym'], bio: 'Building bridges, burning them only at the gym. Canteen samosa loyalist.', style: 'open-peeps' },
  { name: 'Zoya Sheikh', gender: 'female', interestedIn: 'male', branch: 'IT', year: '3rd Year', vibe: [3, 1, 0, 3, 2], interests: ['Photography', 'Travel', 'Bikes', 'Foodie'], bio: 'My Activa and I have seen every corner of Indore. Hop on?', style: 'notionists' },
  { name: 'Dev Chandel', gender: 'male', interestedIn: 'everyone', branch: 'Data Science', year: 'PG', vibe: [1, 0, 3, 1, 3], interests: ['Coding', 'Books', 'Music', 'Poetry'], bio: 'I make playlists for people I like. Statistically significant feelings only.', style: 'micah' },
];

const SAMPLE_CONFESSIONS = [
  { text: 'To the girl in the blue kurti who laughed at my canteen tray disaster — you turned a very bad Monday into a good one.', spot: 'Main Canteen' },
  { text: "We've shared the same library table four times now. I keep bringing extra pens hoping you'll forget yours again.", spot: 'Library' },
  { text: 'You: red Activa, always parked slightly crooked near CKD. Me: judging, but also kind of charmed.', spot: 'CKD Square' },
  { text: 'Whoever played the guitar at MediSquare on Friday evening — the whole crowd was pretending not to stare. I was not pretending.', spot: 'MediSquare' },
  { text: 'To the one who shares their Maggi at Datre without being asked: you are the standard. The absolute standard.', spot: 'Datre' },
  { text: 'We made eye contact for exactly 1.5 seconds at the bus stand and I have now planned our entire wedding. Normal behaviour.', spot: 'Bus Stand' },
];

export async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  console.log('🌱 Empty database — planting sample Medicaps students…');

  const users = await User.create(
    SAMPLE_STUDENTS.map((s, i) => ({
      ...s,
      email: `${s.name.split(' ')[0].toLowerCase()}@medicaps.ac.in`,
      password: 'medicaps123',
      avatar: avatar(s.gender, s.name, i),
    }))
  );

  await Confession.create(
    SAMPLE_CONFESSIONS.map((c, i) => ({
      ...c,
      author: users[i % users.length]._id,
      pseudonym: pseudonym(),
      hearts: users.slice(0, (i * 3) % 9).map((u) => u._id),
      eyes: users.slice(0, (i * 2) % 5).map((u) => u._id),
    }))
  );

  // A few mutual likes so sample accounts have matches to play with.
  console.log(`🌱 Seeded ${users.length} students + ${SAMPLE_CONFESSIONS.length} confessions (sample login: priya@medicaps.ac.in / medicaps123)`);
}

// Standalone usage: `npm run seed` (run while the server is stopped).
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const { default: connectDB } = await import('./config/db.js');
  await connectDB();
  await seedIfEmpty();
  await mongoose.disconnect();
  process.exit(0);
}
