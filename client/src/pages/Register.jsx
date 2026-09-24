import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../lib/api';
import { COLLEGES } from '../lib/constants';
import ThemeToggle from '../components/ThemeToggle';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    college: '', name: '', email: '', password: '', gender: '', interestedIn: '',
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const pillBtn = (active) =>
    `rounded-xl border-2 px-2 py-3 text-center text-sm font-bold transition ${
      active ? 'border-flame bg-flame/15 text-flame' : 'border-paper/15 text-paper hover:border-paper/40'
    }`;

  const validate = () => {
    if (!COLLEGES.includes(form.college)) return 'Pick your college';
    if (!form.name.trim()) return 'Tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'That email looks off';
    if (form.password.length < 6) return 'Password needs at least 6 characters';
    if (!form.gender) return 'Pick how you identify';
    if (!form.interestedIn) return 'Tell us who you want to meet';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/discover');
    } catch (err) {
      setError(errMsg(err, 'Could not create your account'));
      setBusy(false);
    }
  };

  return (
    <div className="grain dotgrid min-h-screen bg-ink px-4 py-10">
      <div className="warm-glow" style={{ width: 420, height: 420, top: -140, right: -100, background: 'rgba(255,81,38,0.12)' }} />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-3xl font-black italic" style={{ letterSpacing: '-0.03em' }}>
            Mulaqat<span className="text-flame">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-bold text-faded hover:text-paper transition">
              Log in
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <form onSubmit={submit} className="card-elevated hero-rise relative mt-6 space-y-4 p-6 sm:p-8" style={{ '--d': '0.1s' }}>
          <span className="sticker absolute -top-4 right-6 text-sm">30 seconds, promise</span>
          <h1 className="font-display text-3xl font-black sm:text-4xl">Join your campus.</h1>
          <p className="-mt-1 text-faded">Your profile &amp; vibe check come right after — let&apos;s get you in first.</p>

          <div>
            <p className="mb-2 text-sm font-bold text-faded">Your college</p>
            <select className="field" value={form.college} onChange={(e) => set('college', e.target.value)}>
              <option value="" disabled>Select your college</option>
              {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <input className="field" placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} />
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          <input className="field" type="password" placeholder="Password (6+ characters)" value={form.password} onChange={(e) => set('password', e.target.value)} />

          <div>
            <p className="mb-2 text-sm font-bold text-faded">I am…</p>
            <div className="grid grid-cols-3 gap-2">
              {['male', 'female', 'other'].map((g) => (
                <button type="button" key={g} className={pillBtn(form.gender === g)} onClick={() => set('gender', g)}>
                  {g === 'male' ? 'A guy' : g === 'female' ? 'A girl' : 'Other'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-faded">I want to meet…</p>
            <div className="grid grid-cols-3 gap-2">
              {['male', 'female', 'everyone'].map((g) => (
                <button type="button" key={g} className={pillBtn(form.interestedIn === g)} onClick={() => set('interestedIn', g)}>
                  {g === 'male' ? 'Guys' : g === 'female' ? 'Girls' : 'Everyone'}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm font-bold text-flame">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Creating…' : 'Create account →'}
          </button>

          <p className="text-center text-sm text-faded">
            Already here?{' '}
            <Link to="/login" className="font-bold text-honey underline underline-offset-4">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
