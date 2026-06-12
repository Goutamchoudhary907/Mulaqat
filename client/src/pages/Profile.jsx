import { useMemo, useState } from 'react';
import api, { errMsg } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { INTERESTS, BRANCHES, YEARS, VIBE_QUESTIONS, AVATAR_STYLES, avatarUrl } from '../lib/constants';

export default function Profile() {
  const { user, setUser, admirers } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio || '',
    branch: user.branch,
    year: user.year,
    interestedIn: user.interestedIn,
    interests: user.interests || [],
    avatar: user.avatar,
  });
  const [shuffle, setShuffle] = useState(0);
  const [status, setStatus] = useState(null); // { ok, msg }
  const [busy, setBusy] = useState(false);

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
    () => AVATAR_STYLES.map((style) => avatarUrl(style, `${form.name || 'medicaps'}-${shuffle}`)),
    [form.name, shuffle]
  );

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const { data } = await api.put('/users/me', form);
      setUser(data.user);
      setStatus({ ok: true, msg: 'Saved! Looking good ✨' });
    } catch (err) {
      setStatus({ ok: false, msg: errMsg(err, 'Could not save') });
    } finally {
      setBusy(false);
    }
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <h1 className="font-display text-4xl font-black">
        Your <em className="text-honey">profile</em>
      </h1>

      {/* Stats strip */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          [user.matches?.length || 0, 'mulaqats'],
          [admirers, 'secret admirers'],
          [memberSince, 'here since'],
        ].map(([big, label]) => (
          <div key={label} className="card-paper p-4">
            <p className="font-display text-2xl font-black text-honey">{big}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-faded">{label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={save} className="card-paper relative mt-6 space-y-6 p-6 sm:p-8">
        <span className="sticker absolute -top-4 right-6 text-sm">this is what they see</span>

        {/* Avatar */}
        <div>
          <p className="mb-3 text-sm font-bold text-faded">Your face</p>
          <div className="flex flex-wrap items-center gap-3">
            <img src={form.avatar} alt="you" className="h-24 w-24 rounded-2xl border-2 border-flame bg-coal p-1" />
            <div className="flex flex-wrap gap-2">
              {avatarChoices.map((url) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => set('avatar', url)}
                  className={`rounded-xl border-2 bg-coal p-1 transition ${
                    form.avatar === url ? 'border-flame' : 'border-paper/15 hover:border-paper/40'
                  }`}
                >
                  <img src={url} alt="option" className="h-14 w-14" />
                </button>
              ))}
              <button type="button" onClick={() => setShuffle((s) => s + 1)} className="btn-ghost px-3 py-1 text-sm" title="New faces">
                🎲
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-faded">Name</p>
            <input className="field" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={50} />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-faded">Looking to meet</p>
            <select className="field" value={form.interestedIn} onChange={(e) => set('interestedIn', e.target.value)}>
              <option value="male">Guys</option>
              <option value="female">Girls</option>
              <option value="everyone">Everyone</option>
            </select>
          </div>
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
          <p className="mb-2 text-sm font-bold text-faded">Bio</p>
          <textarea
            className="field resize-none"
            rows={2}
            maxLength={300}
            value={form.bio}
            onChange={(e) => set('bio', e.target.value)}
            placeholder="One line that does the talking for you"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-faded">
            Your things <span className="text-faded/60">({form.interests.length}/8)</span>
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

        {/* Vibe summary — read-only reminder of what's driving their matches */}
        <div className="rounded-xl border border-dashed border-honey/40 bg-honey/5 p-4">
          <p className="text-sm font-bold text-honey">Your vibe check answers</p>
          <ul className="mt-2 space-y-1 text-sm text-faded">
            {VIBE_QUESTIONS.map((q, i) => (
              <li key={q.q}>
                <span className="text-paper/70">{q.q}</span>{' '}
                <span className="font-bold text-paper">{user.vibe?.[i] != null ? q.options[user.vibe[i]] : '—'}</span>
              </li>
            ))}
          </ul>
        </div>

        {status && (
          <p className={`text-sm font-bold ${status.ok ? 'text-emerald-400' : 'text-flame'}`}>{status.msg}</p>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Saving…' : 'Save changes 💾'}
        </button>
      </form>
    </main>
  );
}
