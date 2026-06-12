import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

/** Full-screen celebration when two people like each other. */
export default function MatchOverlay({ match, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 p-6 backdrop-blur-sm">
      <div className="animate-pop flex flex-col items-center text-center">
        <div className="flex items-center">
          <div className="-rotate-6 rounded-2xl border-4 border-milk bg-cream p-2 shadow-lifted">
            <Avatar user={user} size="h-28 w-28" />
          </div>
          <span className="z-10 -mx-4 animate-heartbeat text-5xl">💘</span>
          <div className="rotate-6 rounded-2xl border-4 border-milk bg-cream p-2 shadow-lifted">
            <Avatar user={match.user} size="h-28 w-28" />
          </div>
        </div>

        <h2 className="mt-8 font-display text-5xl font-black italic text-honey">
          It&apos;s a Mulaqat!
        </h2>
        <p className="mt-3 max-w-xs text-faded">
          You and <span className="font-bold text-paper">{match.user?.name}</span> liked each
          other. The canteen date plans itself from here.
        </p>

        <div className="mt-8 flex gap-3">
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
