import { avatarUrl } from '../lib/constants';

/**
 * Renders a user's avatar with an optional online dot.
 * Falls back to a generated avatar from the name if none is set.
 */
export default function Avatar({ user, size = 'h-12 w-12', online = false, className = '' }) {
  const src = user?.avatar || avatarUrl('adventurer', user?.name || 'mulaqat');
  return (
    <div className={`relative shrink-0 ${className}`}>
      <img
        src={src}
        alt={user?.name || 'avatar'}
        className={`${size} rounded-full border border-paper/15 bg-cream/10 object-cover`}
        draggable={false}
      />
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-ink bg-emerald-400" />
      )}
    </div>
  );
}
