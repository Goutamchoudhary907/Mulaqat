import { avatarUrl } from '../lib/constants';

/**
 * User avatar in a soft radial-gradient well with optional online dot.
 * Falls back to a generated DiceBear avatar from name.
 */
export default function Avatar({ user, size = 48, online = false, ring = true, className = '' }) {
  const src = user?.avatar || avatarUrl('adventurer', user?.name || 'mulaqat');
  const px = typeof size === 'number' ? size : 48;

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: px, height: px }}>
      <div
        style={{
          width: px,
          height: px,
          borderRadius: 999,
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 32%, rgb(var(--c-coal) / 1), rgb(var(--c-ink) / 1))',
          border: ring ? '1.5px solid var(--hair-2)' : 'none',
          display: 'grid',
          placeItems: 'center',
          padding: Math.round(px * 0.08),
        }}
      >
        <img
          src={src}
          alt={user?.name || 'avatar'}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      {online && (
        <span
          style={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            width: Math.max(9, Math.round(px * 0.2)),
            height: Math.max(9, Math.round(px * 0.2)),
            borderRadius: 999,
            background: 'var(--mint)',
            border: '2px solid rgb(var(--c-ink))',
          }}
        />
      )}
    </div>
  );
}
