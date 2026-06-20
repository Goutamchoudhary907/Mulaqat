import { useEffect, useMemo, useState } from 'react';
import api, { errMsg } from '../lib/api';
import { spotsForCollege } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../lib/util';

const IcoHeart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IcoTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const IcoPaper = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

export default function Spotted() {
  const { user } = useAuth();
  const spots = useMemo(() => spotsForCollege(user?.college), [user?.college]);

  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [spot, setSpot] = useState(spots[0]);
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api
      .get('/confessions')
      .then(({ data }) => setConfessions(data))
      .finally(() => setLoading(false));
  }, []);

  const post = async (e) => {
    e.preventDefault();
    setError('');
    setPosting(true);
    try {
      const { data } = await api.post('/confessions', { text, spot });
      setConfessions((list) => [data, ...list]);
      setText('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setPosting(false);
    }
  };

  const react = async (id, type) => {
    try {
      const { data } = await api.post(`/confessions/${id}/react`, { type });
      setConfessions((list) => list.map((c) => (c._id === id ? data : c)));
    } catch {
      /* reaction toggles are non-critical */
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/confessions/${id}`);
      setConfessions((list) => list.filter((c) => c._id !== id));
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Anonymous campus wall</p>
          <h1 className="mt-2 font-display text-4xl font-black">
            Spotted
          </h1>
          <p className="mt-1 text-sm text-faded">
            Saw someone? Say it here — kindly.
          </p>
        </div>
        <span className="sticker text-xs">your name is never shown</span>
      </div>

      {/* Compose */}
      <form onSubmit={post} className="card-elevated relative mt-8 p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-flame/15 text-flame">
            <IcoPaper />
          </div>
          <span className="text-sm font-bold text-faded">Write an anonymous spotted note</span>
        </div>
        <textarea
          className="field resize-none border-0 bg-transparent px-1 py-1 text-base focus:ring-0"
          rows={2}
          maxLength={500}
          placeholder='"To the guy in the grey hoodie at the library, 3rd floor…"'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="eyebrow">Spotted at:</span>
          {spots.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSpot(s)}
              className={`chip text-xs ${spot === s ? 'chip-active' : 'text-faded hover:border-paper/40'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-faded/60">{text.length}/500 · posted under a random alias</span>
          <button type="submit" disabled={posting || text.trim().length < 3} className="btn-primary px-5 py-2 text-sm">
            {posting ? 'Posting…' : 'Post anonymously'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm font-bold text-flame">{error}</p>}
      </form>

      {/* Feed */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-paper/10 border-t-flame" />
        </div>
      ) : confessions.length === 0 ? (
        <p className="mt-12 text-center text-faded">
          The wall is empty. Be the first to confess — history will thank you.
        </p>
      ) : (
        <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {confessions.map((c, i) => (
            <div
              key={c._id}
              className={`relative mb-6 break-inside-avoid rounded-xl bg-cream p-5 text-carbon shadow-lifted ${
                i % 3 === 0 ? '-rotate-1' : i % 3 === 1 ? 'rotate-1' : 'rotate-0'
              }`}
            >
              <span className="tape absolute -top-2.5 left-6" />
              <p className="font-medium leading-relaxed">"{c.text}"</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-bold">— {c.pseudonym}</span>
                <span className="rounded-full bg-carbon/10 px-2 py-0.5 text-xs font-bold">@ {c.spot}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-carbon/10 pt-3">
                <button
                  onClick={() => react(c._id, 'hearts')}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold transition ${
                    c.hearted ? 'bg-flame/15 text-flame' : 'text-carbon/50 hover:bg-carbon/5'
                  }`}
                >
                  <IcoHeart /> {c.hearts}
                </button>
                <span className="ml-auto text-xs text-carbon/40">{timeAgo(c.createdAt)}</span>
                {c.mine && (
                  <button
                    onClick={() => remove(c._id)}
                    className="text-carbon/40 hover:text-flame transition"
                    title="Delete your confession"
                  >
                    <IcoTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
