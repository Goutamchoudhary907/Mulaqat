import rateLimit from 'express-rate-limit';

// Login / signup — stop brute-force and signup spam from one IP.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts — please wait a few minutes and try again.' },
});

// Content creation (confessions, reports) — basic anti-spam.
export const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "You're doing that a lot — take a short breather." },
});
