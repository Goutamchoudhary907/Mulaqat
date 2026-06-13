import { useEffect, useState } from 'react';
import api, { errMsg } from '../lib/api';
import { SPOTS } from '../lib/constants';
import { timeAgo } from '../lib/util';

export default function Spotted() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [spot, setSpot] = useState(SPOTS[0]);
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
          <h1 className="font-display text-4xl font-black">
            Spotted <span className="text-flame">👀</span>
          </h1>
          <p className="mt-1 text-sm text-faded">
            Anonymous campus confessions. Saw someone? Say it here — kindly.
          </p>
        </div>
        <span className="sticker text-xs">your name is never shown</span>
      </div>

      {/* Compose */}
      <form onSubmit={post} className="card-paper relative mt-8 border-dashed p-5">
        <textarea
          className="field resize-none border-0 bg-transparent px-1 py-1 text-lg focus:ring-0"
          rows={2}
          maxLength={500}
          placeholder='"To the guy in the grey hoodie at the library, 3rd floor…"'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-faded">Spotted at:</span>
          {SPOTS.map((s) => (
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
            {posting ? 'Posting…' : 'Post anonymously 🕊️'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm font-bold text-flame">{error}</p>}
      </form>

      {/* Feed */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <span className="animate-heartbeat text-5xl">💌</span>
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
              <span className="tape -top-2.5 left-6" />
              <p className="font-medium leading-relaxed">“{c.text}”</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-bold">— {c.pseudonym}</span>
                <span className="rounded-full bg-carbon/10 px-2 py-0.5 text-xs font-bold">@ {c.spot}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-carbon/10 pt-3">
                <button
                  onClick={() => react(c._id, 'hearts')}
                  className={`rounded-full px-2.5 py-1 text-sm font-bold transition ${
                    c.hearted ? 'bg-flame/15 text-flame' : 'text-carbon/50 hover:bg-carbon/5'
                  }`}
                >
                  <span className={c.hearted ? 'heart-pop' : 'inline-block'}>❤️</span> {c.hearts}
                </button>
                <button
                  onClick={() => react(c._id, 'eyes')}
                  className={`rounded-full px-2.5 py-1 text-sm font-bold transition ${
                    c.eyed ? 'bg-carbon/15 text-carbon' : 'text-carbon/50 hover:bg-carbon/5'
                  }`}
                  title="was this… me?"
                >
                  👀 {c.eyes}
                </button>
                <span className="ml-auto text-xs text-carbon/40">{timeAgo(c.createdAt)}</span>
                {c.mine && (
                  <button
                    onClick={() => remove(c._id)}
                    className="text-xs font-bold text-carbon/40 hover:text-flame"
                    title="Delete your confession"
                  >
                    🗑️
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
