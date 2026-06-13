import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

const HEART_EMOJI = ['💌', '❤️', '🧡', '💖', '💛', '💘'];

/** Full-screen celebration when two people like each other. */
export default function MatchOverlay({ match, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Deterministic scatter of drifting hearts — varied size, path and timing.
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        emoji: HEART_EMOJI[i % HEART_EMOJI.length],
        x: (i % 2 ? 1 : -1) * (16 + ((i * 47) % 150)),
        rot: (i % 2 ? 1 : -1) * (10 + ((i * 31) % 30)),
        delay: (i * 0.21) % 2.4,
        dur: 2.4 + ((i * 53) % 110) / 60,
        size: 14 + ((i * 29) % 22),
      })),
    []
  );

  if (!match) return null;

  return (
    <div className="overlay-in fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-ink/95 p-6 backdrop-blur-sm">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="heart-burst"
          style={{
            fontSize: h.size,
            '--hx': `${h.x}px`,
            '--hr': `${h.rot}deg`,
            '--hdelay': `${h.delay}s`,
            '--hd': `${h.dur}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}

      <div className="flex flex-col items-center text-center">
        <div className="flex items-center">
          <div className="match-card-l -rotate-6 rounded-2xl border-4 border-milk bg-cream p-2 shadow-lifted">
            <Avatar user={user} size="h-28 w-28" />
          </div>
          <span className="z-10 -mx-4 animate-heartbeat text-5xl">💘</span>
          <div className="match-card-r rotate-6 rounded-2xl border-4 border-milk bg-cream p-2 shadow-lifted">
            <Avatar user={match.user} size="h-28 w-28" />
          </div>
        </div>

        <h2 className="match-title mt-8 font-display text-5xl font-black italic text-honey">
          It&apos;s a Mulaqat!
        </h2>
        <p className="hero-rise mt-3 max-w-xs text-faded" style={{ '--d': '0.75s' }}>
          You and <span className="font-bold text-paper">{match.user?.name}</span> liked each
          other. The chai date plans itself from here.
        </p>

        <div className="hero-rise mt-8 flex gap-3" style={{ '--d': '0.9s' }}>
          <button onClick={() => navigate(`/chat/${match.roomId}`)} className="btn-primary">
            Say hi now 💬
          </button>
          <button onClick={onClose} className="btn-ghost">
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  );
}
