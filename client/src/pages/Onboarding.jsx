import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { errMsg } from '../lib/api';
import { VIBE_QUESTIONS, VIBE_COUNT, INTERESTS, BRANCHES, YEARS } from '../lib/constants';

const STEPS = ['Campus life', 'Vibe check'];

export default function Onboarding() {
  const { user, setUser, profileComplete } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    branch: user?.branch || 'CSE',
    year: user?.year || '1st Year',
    bio: user?.bio || '',
    interests: user?.interests || [],
    vibe: user?.vibe?.length === VIBE_COUNT ? user.vibe : Array.from({ length: VIBE_COUNT }, () => null),
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

  const choiceBtn = (active) =>
    `rounded-xl border-2 px-4 py-3 text-left font-bold transition ${
      active ? 'border-flame bg-flame/15 text-flame' : 'border-paper/15 text-paper hover:border-paper/40'
    }`;

  const validateStep = () => {
    if (step === 1 && form.vibe.some((v) => v === null)) return 'Answer all five — it takes a minute';
    return '';
  };

  const next = () => {
    const problem = validateStep();
    if (problem) return setError(problem);
    setError('');
    setStep((s) => s + 1);
  };

  const finish = async () => {
    const problem = validateStep();
    if (problem) return setError(problem);
    setBusy(true);
    try {
      const { data } = await api.put('/users/me', form);
      setUser(data.user);
      navigate('/discover');
    } catch (err) {
      setError(errMsg(err, 'Could not save your profile'));
      setBusy(false);
    }
  };

  // Already finished → no reason to be here.
  if (profileComplete) return <Navigate to="/discover" replace />;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8">
      <p className="eyebrow">{user?.college || 'Your campus'}</p>
      <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">
        Finish your <em className="text-flame">profile</em>
      </h1>
      <p className="mt-1 text-faded">One quick vibe check and you&apos;re ready to match. You can explore Spotted meanwhile.</p>

      {/* Step progress */}
      <div className="mt-6 flex gap-2">
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

        {/* STEP 0 — campus life */}
        {step === 0 && (
          <div className="animate-fade-up space-y-5">
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
              <p className="mb-2 text-sm font-bold text-faded">One line about you</p>
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

        {/* STEP 1 — vibe check */}
        {step === 1 && (
          <div className="animate-fade-up space-y-7">
            <div>
              <h2 className="font-display text-2xl font-black">The vibe check ✦</h2>
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
            <button type="button" onClick={finish} disabled={busy} className="btn-primary px-7">
              {busy ? 'Saving…' : 'Start matching'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
