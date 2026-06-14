import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import ThemeToggle from './ThemeToggle';

const IcoCards   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="13" rx="2"/><path d="M22 5 6 5"/><path d="M18 2 6 2"/></svg>;
const IcoHeart   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoMsg     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcoEye     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoLogout  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const LINKS = [
  { to: '/discover', label: 'Discover', Icon: IcoCards },
  { to: '/matches',  label: 'Matches',  Icon: IcoHeart },
  { to: '/chat',     label: 'Chat',     Icon: IcoMsg   },
  { to: '/spotted',  label: 'Spotted',  Icon: IcoEye   },
];

export default function Navbar() {
  const { user, admirers, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

 const inConversation = /^\/chat\/.+/.test(pathname);

  const handleLogout = () => { logout(); navigate('/'); };

  const desktopLink = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] rounded-full transition-colors ${
      isActive ? 'text-flame' : 'text-faded hover:text-paper'
    }`;

  const mobileLink = ({ isActive }) =>
    `flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
      isActive ? 'text-flame' : 'text-faded'
    }`;

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-paper/10 backdrop-blur-md" style={{ background: 'color-mix(in srgb, rgb(var(--c-ink)) 88%, transparent)' }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link
            to="/discover"
            className="font-display text-2xl font-black italic tracking-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            Mulaqat<span className="text-flame">.</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} className={desktopLink}>
                <Icon /> {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {admirers > 0 && (
              <span className="sticker sticker-berry hidden rotate-2 px-2 py-0.5 text-xs sm:inline-block">
                {admirers} {admirers === 1 ? 'admirer' : 'admirers'}
              </span>
            )}
            <ThemeToggle />
            <Link to="/profile" title="Your profile">
              <Avatar user={user} size={36} ring />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center text-faded transition hover:text-flame"
              title="Log out"
            >
              <IcoLogout />
            </button>
          </div>
        </div>
      </header>

      {!inConversation && (
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-paper/10 backdrop-blur-md md:hidden"
        style={{ background: 'color-mix(in srgb, rgb(var(--c-ink)) 92%, transparent)' }}
      >
        {LINKS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={mobileLink}>
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
      )}
    </>
  );
}
