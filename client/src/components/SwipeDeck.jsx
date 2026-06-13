import { useRef, useState } from 'react';
import { VIBE_QUESTIONS } from '../lib/constants';

const SWIPE_THRESHOLD = 110;

/** Circular vibe compatibility meter — SVG ring with animated fill. */
function VibeMeter({ value, size = 56, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  const color = value >= 85 ? '#ff5126' : value >= 68 ? '#ffb627' : '#e0567e';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(246,237,220,0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: '"Bricolage Grotesque", system-ui, sans-serif', fontWeight: 800, fontSize: size * 0.28, color }}>
          {value}
        </span>
      </div>
    </div>
  );
}

export default function SwipeDeck({ deck, myVibe, onSwipe }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [leaving, setLeaving] = useState(null);
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

  const cardStyle = leaving
    ? {
        transform: `translate(${leaving === 'right' ? 130 : -130}%, ${drag.y - 40}px) rotate(${leaving === 'right' ? 28 : -28}deg)`,
        opacity: 0,
        transition: 'transform 0.32s ease-in, opacity 0.32s ease-in',
      }
    : {
        transform: `translate(${drag.x}px, ${drag.y * 0.4}px) rotate(${drag.x * 0.06}deg)`,
        transition: drag.active ? 'none' : 'transform 0.3s cubic-bezier(0.2, 1.4, 0.4, 1)',
      };

  const likeOp = Math.min(Math.max(drag.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOp = Math.min(Math.max(-drag.x / SWIPE_THRESHOLD, 0), 1);

  const common = VIBE_QUESTIONS
    .map((q, i) => (myVibe?.[i] != null && top.vibe?.[i] === myVibe[i] ? q.options[myVibe[i]] : null))
    .filter(Boolean);

  const clamp2 = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

  return (
    <div className="mx-auto flex w-full max-w-sm select-none flex-col gap-3.5">
      {/* Card stack — height driven by the top card's content (no inner scroll) */}
      <div className="relative">
        {/* Back cards — overlay the top card's box and peek out beneath it */}
        {deck.slice(1, 3).map((card, i) => (
          <div
            key={card._id}
            className="card-elevated absolute inset-0 overflow-hidden"
            style={{
              transform: `scale(${1 - (i + 1) * 0.04}) translateY(${(i + 1) * 12}px) rotate(${i % 2 ? 1.5 : -1.5}deg)`,
              zIndex: 2 - i,
              opacity: 0.7 - i * 0.25,
              transition: 'transform 0.5s var(--ease-out-expo), opacity 0.5s ease',
            }}
          />
        ))}

        {/* Top card — in normal flow so the stack sizes to its content */}
        <div
          className="card-elevated relative z-10 cursor-grab touch-none overflow-hidden active:cursor-grabbing"
          style={{ ...cardStyle, boxShadow: 'var(--shadow-lg)' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div key={top._id} className="card-promote flex flex-col">
            {/* LIKE / NOPE stamps */}
            <span
              className="absolute left-4 top-5 z-20 -rotate-12 rounded border-4 border-[#4ec9a0] px-3 py-1 font-display text-2xl font-black text-[#4ec9a0]"
              style={{ opacity: leaving === 'right' ? 1 : likeOp }}
            >
              LIKE
            </span>
            <span
              className="absolute right-4 top-5 z-20 rotate-12 rounded border-4 border-flame px-3 py-1 font-display text-2xl font-black text-flame"
              style={{ opacity: leaving === 'left' ? 1 : nopeOp }}
            >
              NOPE
            </span>

            {/* Portrait */}
            <div
              className="dotgrid relative flex shrink-0 items-center justify-center"
              style={{ height: 'clamp(140px, 21vh, 190px)', background: 'radial-gradient(circle at 50% 30%, rgb(var(--c-coal) / 1), rgb(var(--c-ink) / 1))' }}
            >
              <img
                src={top.avatar}
                alt={top.name}
                className="h-4/5 max-w-[78%] object-contain"
                draggable={false}
              />
              {/* VibeMeter ring */}
              <div
                className="absolute right-3 top-3"
                style={{ background: 'rgb(var(--c-coal))', borderRadius: 999, padding: 4, border: '1px solid var(--hair-2)', boxShadow: 'var(--shadow-sm)' }}
              >
                <VibeMeter value={top.compatibility} size={52} stroke={5} />
              </div>
            </div>

            {/* Details */}
            <div className="p-5">
              <h2 className="font-display text-2xl font-black leading-tight">{top.name}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="chip chip-static text-xs" style={{ borderColor: 'rgb(var(--c-honey) / 0.5)', color: 'rgb(var(--c-honey))' }}>
                  {top.branch}
                </span>
                <span className="chip chip-static text-xs">{top.year}</span>
              </div>

              {top.bio && <p className="mt-3 leading-relaxed text-paper/85" style={clamp2}>"{top.bio}"</p>}

              {common.length > 0 && (
                <div
                  className="mt-3 rounded-xl p-3 text-sm"
                  style={{ border: '1.5px dashed rgb(var(--c-berry) / 0.5)', background: 'var(--berry-soft)' }}
                >
                  <span className="font-bold text-berry">You both picked:</span>{' '}
                  <span className="text-faded">{common.slice(0, 2).join(' · ')}</span>
                </div>
              )}

              {top.interests?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {top.interests.slice(0, 6).map((interest) => (
                    <span key={interest} className="chip chip-static text-xs">{interest}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => fling('left')}
          title="Pass"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-paper/20 bg-coal text-paper/70 transition hover:scale-110 hover:border-paper/50"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button
          onClick={() => fling('right')}
          title="Like"
          className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-flame text-milk transition hover:scale-110"
          style={{ boxShadow: 'var(--glow-flame)' }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
    </div>
  );
}
