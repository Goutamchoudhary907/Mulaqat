import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { clean } from '../utils/helpers.js';
import { COLLEGES } from '../utils/colleges.js';
import { defaultAvatar } from '../utils/avatar.js';

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export async function register(req, res) {
  const { name, email, password, college, gender, interestedIn, branch, year, bio, interests, vibe, avatar } = req.body;

  if (!name || !email || !password || !college || !gender || !interestedIn) {
    return res.status(400).json({ message: 'Please fill in all the required fields' });
  }
  if (!COLLEGES.includes(college)) {
    return res.status(400).json({ message: 'Please pick your college from the list' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'An account with this email already exists' });

  const user = await User.create({
    name, email, password, college, gender, interestedIn, branch, year, bio, interests, vibe,
    // New users always get a friendly default face; they can change it in onboarding.
    avatar: avatar || defaultAvatar(gender, name),
  });
  res.status(201).json({ token: sign(user._id), user: clean(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Wrong email or password' });
  }
  res.json({ token: sign(user._id), user: clean(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  // People who liked you but aren't matched yet — your secret admirers.
  const admirers = await User.countDocuments({ likes: user._id, _id: { $nin: user.matches } });
  res.json({ user: clean(user), admirers });
}
