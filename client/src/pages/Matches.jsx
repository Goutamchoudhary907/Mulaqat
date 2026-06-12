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
      <h1 className="font-display text-4xl font-black">
        Your <em className="text-berry">mulaqats</em>
      </h1>
      <p className="mt-1 text-sm text-faded">People who liked you back. The hard part is done — go say something.</p>

      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <span className="animate-heartbeat text-5xl">💌</span>
        </div>
      ) : matches.length === 0 ? (
        <div className="card-paper mx-auto mt-10 max-w-md p-10 text-center">
          <p className="text-5xl">🌱</p>
          <h2 className="mt-4 font-display text-2xl font-black">No matches yet</h2>
          <p className="mt-2 text-faded">Every great campus love story starts with a swipe. Get back out there.</p>
          <Link to="/discover" className="btn-primary mt-6">Back to the deck 🃏</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m, i) => (
            <div
              key={m.roomId}
              className={`rounded-lg bg-cream p-3 pb-4 text-ink shadow-lifted transition hover:rotate-0 hover:scale-[1.02] ${
                i % 2 ? 'rotate-1' : '-rotate-1'
              }`}
            >
              <div className="dotgrid relative flex h-40 items-center justify-center rounded-sm bg-ink/90">
                <Avatar user={m.user} size="h-28 w-28" online={onlineIds.includes(String(m.user._id))} />
                <span className="sticker absolute right-2 top-2 text-xs">{m.compatibility}% vibe</span>
              </div>
              <div className="mt-3 px-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-black">{m.user.name}</h2>
                  <span className="shrink-0 text-xs font-bold text-ink/50">
                    {m.user.branch} · {m.user.year}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-ink/60">
                  {m.lastMessage
                    ? `“${m.lastMessage.text}” · ${timeAgo(m.lastMessage.createdAt)}`
                    : 'No messages yet — break the ice 🧊'}
                </p>
                <Link
                  to={`/chat/${m.roomId}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper transition hover:bg-flame"
                >
                  {m.lastMessage ? 'Continue the chat 💬' : 'Say hi first 👋'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
