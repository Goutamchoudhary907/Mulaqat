import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { timeAgo } from '../lib/util';

export default function Matches() {
  const { onlineIds } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/match/matches')
      .then(({ data }) => setMatches(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <p className="eyebrow">Campus connections</p>
      <h1 className="mt-2 font-display text-4xl font-black">
        Your <em className="text-berry">mulaqats</em>
      </h1>
      <p className="mt-1 text-sm text-faded">People who liked you back. The hard part is done.</p>

      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-paper/10 border-t-flame" />
        </div>
      ) : matches.length === 0 ? (
        <div className="card-elevated mx-auto mt-10 max-w-md p-10 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: 'var(--berry-soft)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="rgb(var(--c-berry))" stroke="rgb(var(--c-berry))" strokeWidth="0">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2 className="font-display text-2xl font-black">No matches yet</h2>
          <p className="mt-2 text-faded">Every great campus story starts with a swipe. Get back out there.</p>
          <Link to="/discover" className="btn-primary mt-6 inline-block">Back to the deck</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m, i) => (
            <div
              key={m.roomId}
              className={`rounded-lg bg-cream p-3 pb-4 text-carbon shadow-lifted transition hover:rotate-0 hover:scale-[1.02] ${
                i % 2 ? 'rotate-1' : '-rotate-1'
              }`}
            >
              <span className="tape absolute -top-2 left-6" />
              <div className="relative flex h-40 items-center justify-center rounded-sm bg-carbon/90">
                <Avatar
                  user={m.user}
                  size={112}
                  online={onlineIds.includes(String(m.user._id))}
                />
                <span className="sticker absolute right-2 top-2 text-xs">{m.compatibility}% vibe</span>
              </div>
              <div className="mt-3 px-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-black">{m.user.name}</h2>
                  <span className="shrink-0 text-xs font-bold text-carbon/50">
                    {m.user.branch}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-carbon/60">
                  {m.lastMessage
                    ? `"${m.lastMessage.text}" · ${timeAgo(m.lastMessage.createdAt)}`
                    : 'No messages yet — break the ice'}
                </p>
                <Link
                  to={`/chat/${m.roomId}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-carbon px-4 py-2 text-sm font-bold text-milk transition hover:bg-flame"
                >
                  {m.lastMessage ? 'Continue the chat' : 'Say hi first'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
