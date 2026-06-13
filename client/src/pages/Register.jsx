import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../lib/api';
import { VIBE_QUESTIONS, INTERESTS, BRANCHES, YEARS, avatarChoicesFor } from '../lib/constants';
import ThemeToggle from '../components/ThemeToggle';

const STEPS = ['The basics', 'Campus life', 'Vibe check', 'Your face'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shuffle, setShuffle] = useState(0);

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    gender: '', interestedIn: '',
    branch: 'CSE', year: '1st Year', bio: '', interests: [],
    vibe: [null, null, null, null, null],
    avatar: '',
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleInterest = (interest) =>
    set(
      'interests',
      form.interests.includes(interest)
        ? form.interests.filter((i) => i !== interest)
        : form.interests.length < 8
          ? [...form.interests, interest]
          : form.interests
    );

  const avatarChoices = useMemo(
    () => avatarChoicesFor(form.gender, `${form.name || 'medicaps'}-${shuffle}`),
    [form.gender, form.name, shuffle]
  );

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) return 'Tell us your name';
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'That email looks off';
      if (form.password.length < 6) return 'Password needs at least 6 characters';
      if (!form.gender) return 'Pick how you identify';
      if (!form.interestedIn) return 'Tell us who you want to meet';
    }
    if (step === 2 && form.vibe.some((v) => v === null)) return 'Answer all five — it takes a minute';
    if (step === 3 && !form.avatar) return 'Pick a face! Any face.';
    return '';
  };

  const next = () => {
    const problem = validateStep();
    if (problem) return setError(problem);
    setError('');
    setStep((s) => s + 1);
  };

  const submit = async () => {
    const problem = validateStep();
    if (problem) return setError(problem);
    setBusy(true);
    try {
      await register(form);
      navigate('/discover');
    } catch (err) {
      setError(errMsg(err, 'Could not create your account'));
      setBusy(false);
    }
  };

  const choiceBtn = (active) =>
    `rounded-xl border-2 px-4 py-3 text-left font-bold transition ${
      active ? 'border-flame bg-flame/15 text-flame' : 'border-paper/15 text-paper hover:border-paper/40'
    }`;

  return (
    <div className="grain dotgrid min-h-screen bg-ink px-4 py-10">
      <div className="warm-glow" style={{ width: 420, height: 420, top: -140, right: -100, background: 'rgba(255,81,38,0.12)' }} />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-3xl font-black italic" style={{ letterSpacing: '-0.03em' }}>
            Mulaqat<span className="text-flame">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-bold text-faded hover:text-paper transition">
              Have an account? Log in
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Step progress */}
        <div className="mt-8 flex gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors duration-300 ${i <= step ? 'bg-flame' : 'bg-paper/15'}`} />
              <p className={`mt-1.5 hidden text-xs font-bold sm:block ${i === step ? 'text-paper' : 'text-faded/60'}`}>
                {String(i + 1).padStart(2, '0')} · {label}
              </p>
            </div>
          ))}
        </div>

        <div className="card-elevated hero-rise relative mt-6 p-6 sm:p-8" style={{ '--d': '0.1s' }}>
          <span className="sticker absolute -top-4 right-6 text-sm">{STEPS[step]}</span>

          {/* STEP 0 — basics */}
          {step === 0 && (
            <div className="animate-fade-up space-y-4">
              <h1 className="font-display text-3xl font-black sm:text-4xl">First, the boring bits.</h1>
              <input className="field" placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} />
              <input className="field" type="email" placeholder="you@medicaps.ac.in" value={form.email} onChange={(e) => set('email', e.target.value)} />
              <input className="field" type="password" placeholder="Password (6+ characters)" value={form.password} onChange={(e) => set('password', e.target.value)} />
              <div>
                <p className="mb-2 text-sm font-bold text-faded">I am…</p>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((g) => (
                    <button type="button" key={g} className={choiceBtn(form.gender === g)} onClick={() => set('gender', g)}>
                      {g === 'male' ? 'A guy' : g === 'female' ? 'A girl' : 'Other'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-faded">I want to meet…</p>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'everyone'].map((g) => (
                    <button type="button" key={g} className={choiceBtn(form.interestedIn === g)} onClick={() => set('interestedIn', g)}>
                      {g === 'male' ? 'Guys' : g === 'female' ? 'Girls' : 'Everyone'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — campus life */}
          {step === 1 && (
            <div className="animate-fade-up space-y-5">
              <h1 className="font-display text-3xl font-black sm:text-4xl">Where on campus are you?</h1>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-bold text-faded">Branch</p>
                  <select className="field" value={form.branch} onChange={(e) => set('branch', e.target.value)}>
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold text-faded">Year</p>
                  <select className="field" value={form.year} onChange={(e) => set('year', e.target.value)}>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-faded">One line about you (make it count)</p>
                <textarea
                  className="field"
                  rows={2}
                  maxLength={300}
                  placeholder='e.g. "Chai > coffee. Found at the canteen more than in class."'
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-faded">
                  Pick your things <span className="text-faded/60">({form.interests.length}/8)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`chip ${form.interests.includes(interest) ? 'chip-active' : 'text-faded hover:border-paper/40'}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — vibe check */}
          {step === 2 && (
            <div className="animate-fade-up space-y-7">
              <div>
                <h1 className="font-display text-3xl font-black sm:text-4xl">The vibe check ✦</h1>
                <p className="mt-1 text-faded">This is how we match you. Answer honestly — chaos included.</p>
              </div>
              {VIBE_QUESTIONS.map((question, qi) => (
                <div key={question.q}>
                  <p className="mb-2 font-bold">
                    <span className="text-honey">{qi + 1}.</span> {question.q}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {question.options.map((option, oi) => (
                      <button
                        type="button"
                        key={option}
                        className={choiceBtn(form.vibe[qi] === oi)}
                        onClick={() => set('vibe', form.vibe.map((v, i) => (i === qi ? oi : v)))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 — avatar */}
          {step === 3 && (
            <div className="animate-fade-up space-y-5">
              <div>
                <h1 className="font-display text-3xl font-black sm:text-4xl">Pick your face</h1>
                <p className="mt-1 text-faded">
                  Mulaqat starts everyone with a hand-drawn avatar — vibes first, photos when{' '}
                  <em>you</em> decide.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {avatarChoices.map(({ key, url }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => set('avatar', url)}
                    className={`rounded-2xl border-2 bg-coal p-2 transition ${
                      form.avatar === url ? 'border-flame bg-flame/10' : 'border-paper/15 hover:border-paper/40'
                    }`}
                  >
                    <img src={url} alt="avatar option" className="h-full w-full" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { setShuffle((s) => s + 1); set('avatar', ''); }}
                className="btn-ghost px-4 py-2 text-sm"
              >
                Shuffle the faces
              </button>
            </div>
          )}

          {error && <p className="mt-5 text-sm font-bold text-flame">{error}</p>}

          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button type="button" onClick={() => { setError(''); setStep((s) => s - 1); }} className="btn-ghost px-5 py-2.5">
                ← Back
              </button>
            ) : <span />}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary px-7">Next →</button>
            ) : (
              <button type="button" onClick={submit} disabled={busy} className="btn-primary px-7">
                {busy ? 'Creating…' : 'Enter Mulaqat'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
