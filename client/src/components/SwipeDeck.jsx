import { useRef, useState } from 'react';
import { VIBE_QUESTIONS } from '../lib/constants';

const SWIPE_THRESHOLD = 110;

/**
 * Draggable card stack. The top card follows the pointer, tilts as it moves,
 * and flies off when dragged past the threshold (or via the buttons).
 */
export default function SwipeDeck({ deck, myVibe, onSwipe }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [leaving, setLeaving] = useState(null); // 'left' | 'right'
  const startRef = useRef(null);

  const top = deck[0];
  if (!top) return null;

  const fling = (dir) => {
    if (leaving) return;
    setLeaving(dir);
    setTimeout(() => {
      onSwipe(dir === 'right' ? 'like' : 'pass', top);
      setLeaving(null);
      setDrag({ x: 0, y: 0, active: false });
    }, 320);
  };

  const onPointerDown = (e) => {
    if (leaving) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag((d) => ({ ...d, active: true }));
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!startRef.current || leaving) return;
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y, active: true });
  };

  const onPointerUp = () => {
    startRef.current = null;
    if (Math.abs(drag.x) > SWIPE_THRESHOLD) fling(drag.x > 0 ? 'right' : 'left');
    else setDrag({ x: 0, y: 0, active: false });
  };

  const style = leaving
    ? {
        transform: `translate(${leaving === 'right' ? 130 : -130}%, ${drag.y - 40}px) rotate(${leaving === 'right' ? 28 : -28}deg)`,
        opacity: 0,
        transition: 'transform 0.32s ease-in, opacity 0.32s ease-in',
      }
    : {
        transform: `translate(${drag.x}px, ${drag.y * 0.4}px) rotate(${drag.x * 0.06}deg)`,
        transition: drag.active ? 'none' : 'transform 0.3s cubic-bezier(0.2, 1.4, 0.4, 1)',
      };

  const likeOpacity = Math.min(Math.max(drag.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-drag.x / SWIPE_THRESHOLD, 0), 1);

  // Vibe answers you both picked — the icebreaker.
  const common = VIBE_QUESTIONS
    .map((q, i) => (myVibe?.[i] != null && top.vibe?.[i] === myVibe[i] ? q.options[myVibe[i]] : null))
    .filter(Boolean);

  return (
    <div className="relative mx-auto w-full max-w-sm select-none" style={{ height: 560 }}>
      {/* Cards underneath, peeking out */}
      {deck.slice(1, 3).map((card, i) => (
        <div
          key={card._id}
          className="card-paper absolute inset-0 overflow-hidden"
          style={{
            transform: `scale(${1 - (i + 1) * 0.04}) translateY(${(i + 1) * 14}px) rotate(${i % 2 ? 1.5 : -1.5}deg)`,
            zIndex: 2 - i,
            opacity: 0.7 - i * 0.25,
            transition: 'transform 0.5s var(--ease-out-expo), opacity 0.5s ease',
          }}
        />
      ))}

      {/* Top card */}
      <div
        className="card-paper absolute inset-0 z-10 flex cursor-grab touch-none flex-col overflow-hidden shadow-lifted active:cursor-grabbing"
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Keyed by card id so each new top card plays the focus-pull entrance */}
        <div key={top._id} className="card-promote flex h-full flex-col">
        {/* LIKE / NOPE stamps */}
        <span
          className="absolute left-5 top-6 z-20 -rotate-12 border-4 border-emerald-400 px-3 py-1 font-display text-3xl font-black text-emerald-400"
          style={{ opacity: leaving === 'right' ? 1 : likeOpacity }}
        >
          LIKE
        </span>
        <span
          className="absolute right-5 top-6 z-20 rotate-12 border-4 border-flame px-3 py-1 font-display text-3xl font-black text-flame"
          style={{ opacity: leaving === 'left' ? 1 : nopeOpacity }}
        >
          NOPE
        </span>

        {/* Portrait area */}
        <div className="dotgrid relative flex h-60 shrink-0 items-end justify-center bg-coal">
          <img
            src={top.avatar}
            alt={top.name}
            className="h-52 w-52 object-contain"
            draggable={false}
          />
          <span className="sticker absolute right-4 top-4 text-sm">
            {top.compatibility}% vibe
          </span>
        </div>

        {/* Details */}
        <div className="nice-scroll flex-1 overflow-y-auto p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-3xl font-black">{top.name}</h2>
            <span className="shrink-0 text-sm font-bold text-faded">{top.year}</span>
          </div>
          <span className="chip mt-2 border-honey/40 text-honey">{top.branch}</span>

          {top.bio && <p className="mt-3 text-paper/85">“{top.bio}”</p>}

          {common.length > 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-berry/50 bg-berry/10 p-3 text-sm">
              <span className="font-bold text-berry">You both picked:</span>{' '}
              {common.slice(0, 2).join(' · ')}
            </div>
          )}

          {top.interests?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {top.interests.map((interest) => (
                <span key={interest} className="chip text-xs text-faded">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute -bottom-20 left-0 right-0 z-10 flex items-center justify-center gap-6">
        <button
          onClick={() => fling('left')}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-paper/25 bg-coal text-2xl transition hover:scale-110 hover:border-paper/60"
          title="Pass"
        >
          ✕
        </button>
        <button
          onClick={() => fling('right')}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-flame text-3xl shadow-sticker transition hover:scale-110"
          title="Like"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
