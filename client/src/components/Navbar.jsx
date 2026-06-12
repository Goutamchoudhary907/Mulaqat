import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { to: '/discover', label: 'Discover', icon: '🃏' },
  { to: '/matches', label: 'Matches', icon: '💞' },
  { to: '/chat', label: 'Chat', icon: '💬' },
  { to: '/spotted', label: 'Spotted', icon: '👀' },
];

export default function Navbar() {
  const { user, admirers, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const desktopLink = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
      isActive ? 'text-flame' : 'text-faded hover:text-paper'
    }`;

  const mobileLink = ({ isActive }) =>
    `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-bold ${
      isActive ? 'text-flame' : 'text-faded'
    }`;

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-paper/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/discover" className="font-display text-2xl font-black italic tracking-tight">
            Mulaqat<span className="text-flame">.</span>
          </Link>

          <nav className="hidden items-center md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={desktopLink}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {admirers > 0 && (
              <span
                className="hidden rotate-2 bg-berry px-2 py-0.5 text-xs font-bold text-milk shadow-sticker sm:inline-block"
                title="People who liked you — keep swiping to find them!"
              >
                {admirers} admirer{admirers > 1 ? 's' : ''} 👀
              </span>
            )}
            <ThemeToggle />
            <Link to="/profile" title="Your profile">
              <Avatar user={user} size="h-9 w-9" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-bold uppercase tracking-wide text-faded transition hover:text-flame"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-paper/10 bg-ink/95 backdrop-blur md:hidden">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} className={mobileLink}>
            <span className="text-lg">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/profile" className={mobileLink}>
          <span className="text-lg">🙂</span>
          Profile
        </NavLink>
      </nav>
    </>
  );
}
