import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/discover');
    } catch (err) {
      setError(errMsg(err, 'Could not log in'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grain dotgrid flex min-h-screen items-center justify-center bg-ink px-4 py-10">
      {/* ambient glow */}
      <div className="warm-glow" style={{ width: 380, height: 380, top: -100, right: -80, background: 'rgba(255,81,38,0.12)' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-3xl font-black italic" style={{ letterSpacing: '-0.03em' }}>
            Mulaqat<span className="text-flame">.</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="card-elevated hero-rise relative mt-6 p-8" style={{ '--d': '0.1s' }}>
          <span className="sticker absolute -top-4 right-6 text-sm">welcome back</span>
          <h1 className="font-display text-4xl font-black">Log in</h1>
          <p className="mt-2 text-faded">The campus missed you.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              type="email"
              required
              placeholder="you@gmail.com"
              className="field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <p className="text-sm font-bold text-flame">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? 'Logging in…' : 'Log in →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-faded">
            New here?{' '}
            <Link to="/register" className="font-bold text-honey underline underline-offset-4">
              Take the vibe check
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
