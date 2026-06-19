import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VIBE_QUESTIONS, COLLEGES, niceAvatar } from '../lib/constants';
import ThemeToggle from '../components/ThemeToggle';
import Reveal from '../components/Reveal';

// The hero word cycles and lands on the brand word. Keep each short so it fits.
const HERO_WORDS = ['crush', 'match', 'partner', 'mulaqat'];

const CAMPUS_PLACES = [
  'The canteen', 'The library', 'Chai stall', 'The quad', 'Parking lot', 'Back benches', 'Bus stand',
];

function PlacesTicker() {
  const strip = CAMPUS_PLACES.map((p) => `${p}   ✦   `).join('');
  return (
    <div className="ticker ticker-mask overflow-hidden border-y border-paper/10 py-3.5">
      <div className="flex w-max animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-[0.3em] text-faded/50">
        <span>{strip}</span>
        <span>{strip}</span>
      </div>
    </div>
  );
}

function Ticket({ number, title, children, color }) {
  return (
    <div
      className="relative h-full rounded-2xl border border-dashed border-paper/20 bg-coal p-6 transition hover:-translate-y-1.5 hover:border-paper/40"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ink" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ink" />
      <span className="font-display text-5xl font-black italic" style={{ color }}>{number}</span>
      <h3 className="mt-3 font-display text-2xl font-black">{title}</h3>
      <p className="mt-2 leading-relaxed text-faded">{children}</p>
    </div>
  );
}

const SPOTTED_SAMPLES = [
  { text: 'To the girl in the blue kurti who laughed at my canteen tray disaster — you made a bad Monday good.', who: 'Caffeinated Sparrow', spot: 'Canteen', rot: '-rotate-2' },
  { text: "We've shared the library table four times. I bring extra pens hoping you'll forget yours.", who: 'Backbench Fox', spot: 'Library', rot: 'rotate-1' },
  { text: 'You: red Activa, always parked crooked in the lot. Me: judging, but also kinda charmed.', who: 'Lowkey Panda', spot: 'Parking Lot', rot: '-rotate-1' },
];

const COMPARISONS = [
  ['Strangers from anywhere', 'Only students from your college'],
  ['Swipe on faces', 'See your vibe % first'],
  ['"hey" … "hey" … silence', 'Icebreakers from shared answers'],
  ['Catfish roulette', 'Hand-drawn avatars, zero pressure'],
  ['Pay to see who likes you', 'Free. It is for our campus.'],
];

export default function Landing() {
  const [picked, setPicked] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const teaser = VIBE_QUESTIONS[0];

  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % HERO_WORDS.length), 1900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grain relative min-h-screen overflow-x-clip bg-ink">

      {/* Ambient glows — behind the cream panel (clipped by the relative root) */}
      <div className="warm-glow" style={{ width: 520, height: 520, top: -180, right: -60, background: 'rgba(255,81,38,0.14)' }} />
      <div className="warm-glow" style={{ width: 460, height: 460, top: 120, left: -120, background: 'rgba(224,86,126,0.10)' }} />

      {/* ── Cream panel — nav + hero ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-4">
        <div className="cream-panel on-cream" style={{ boxShadow: 'var(--shadow-md)', padding: 'clamp(18px, 2.5vw, 30px)' }}>
          {/* Nav */}
          <nav className="flex items-center justify-between gap-2">
            <span className="shrink-0 font-display text-2xl font-black italic sm:text-3xl" style={{ letterSpacing: '-0.03em' }}>
              Mulaqat<span className="text-flame">.</span>
            </span>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Link to="/login" className="btn-ghost px-3 py-2 text-sm sm:px-5 sm:py-2.5">Log in</Link>
              <Link to="/register" className="btn-primary px-3 py-2 text-sm sm:px-5 sm:py-2.5">Join free</Link>
              <ThemeToggle />
            </div>
          </nav>

          {/* Hero */}
          <section style={{ padding: 'clamp(8px,1.5vw,20px) clamp(4px,1vw,12px) clamp(16px,2vw,28px)' }}>
            <div className="grid w-full items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
              {/* Words */}
              <div>
                <h1
                  className="hero-rise font-display font-black leading-[1.05]"
                  style={{ '--d': '0.18s', fontSize: 'clamp(40px, 6.5vw, 68px)', marginTop: 0 }}
                >
                  Your campus{' '}
                  <span key={wordIdx} className="word-swap text-flame">{HERO_WORDS[wordIdx]}</span>
                  <br />is one vibe check away.
                </h1>
                <p
                  className="hero-rise max-w-md leading-relaxed text-faded"
                  style={{ '--d': '0.32s', marginTop: 22, fontSize: 18 }}
                >
                  Match by <strong className="text-paper">vibe</strong>, not just photos.
                  No randoms, no bots — just real students from your college.
                </p>
                <div
                  className="hero-rise flex flex-wrap items-center gap-3"
                  style={{ '--d': '0.45s', marginTop: 28 }}
                >
                  <Link to="/register" className="btn-primary text-base">Start your story →</Link>
                  <Link to="/login" className="btn-ghost text-base">I have an account</Link>
                </div>
                <p
                  className="hero-rise text-sm text-faded/70"
                  style={{ '--d': '0.58s', marginTop: 16 }}
                >
                  Free for students · Anonymous until you choose not to be
                </p>
              </div>

              {/* Polaroid visual */}
              <div className="relative mx-auto w-64 sm:w-72">
                <figure
                  className="polaroid-back absolute -left-12 top-8 hidden w-44 rotate-[7deg] rounded-md bg-cream p-2 pb-4 shadow-lifted sm:block"
                  style={{ '--rot': '7deg' }}
                >
                  <div className="flex h-28 items-center justify-center rounded-sm bg-carbon/90">
                    <img src={niceAvatar('female', 'Sana Khan')} alt="" className="h-24 w-24" draggable={false} />
                  </div>
                </figure>

                <figure className="polaroid-main relative rotate-[-3deg] rounded-md bg-cream p-3 pb-4 text-carbon shadow-lifted">
                  <span className="tape tape-stick absolute -top-3 left-1/2 -translate-x-1/2" />
                  <div className="develop relative flex h-44 items-center justify-center rounded-sm bg-carbon/90 sm:h-48">
                    <img src={niceAvatar('female', 'Priya Sharma')} alt="" className="-mr-7 h-32 w-32 sm:h-36 sm:w-36" draggable={false} />
                    <img src={niceAvatar('male', 'Arjun Verma')} alt="" className="h-32 w-32 sm:h-36 sm:w-36" draggable={false} />
                    <span className="fade-in-late absolute inset-x-0 bottom-2 mx-auto w-max animate-heartbeat text-xl">💘</span>
                  </div>
                  <figcaption className="fade-in-late mt-3 flex items-center justify-between gap-2 px-1">
                    <div>
                      <span className="font-display text-lg font-black leading-none">Priya × Arjun</span>
                      <p className="mt-0.5 text-xs text-carbon/60">met on Mulaqat · first chai @ Canteen</p>
                    </div>
                    <span
                      className="sticker stamp-in shrink-0 text-xs"
                      style={{ '--d': '1.5s', '--stamp-rot': '-3deg' }}
                    >
                      92% vibe
                    </span>
                  </figcaption>
                </figure>

                <span
                  className="stamp-in absolute -bottom-4 -left-5 -rotate-3 sticker sticker-berry px-3 py-1 text-sm shadow-sticker"
                  style={{ '--d': '1.75s', '--stamp-rot': '-3deg' }}
                >
                  spotted on campus
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <PlacesTicker />

      {/* Now live at — driven by the COLLEGES list */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <p className="eyebrow text-center">Now live across Indore&apos;s campuses</p>
          <h2 className="mt-3 text-center font-display text-3xl font-black sm:text-4xl">
            Is your college <em className="text-flame">in</em>?
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {COLLEGES.map((college, i) => (
            <Reveal key={college} delay={i * 90}>
              <div className="card-elevated flex h-full items-center gap-3 p-5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="font-display text-lg font-black leading-tight">{college}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={COLLEGES.length * 90}>
          <p className="mt-6 text-center text-sm text-faded">
            More colleges coming soon — drag your campus into the mix.
          </p>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="border-b border-paper/10 bg-coal/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
          {[
            ['5 questions', 'is all the vibe check takes'],
            ['0 randoms', 'campus-only, always'],
            ['24/7', 'the Spotted wall never sleeps'],
            ['∞', 'chai dates waiting to happen'],
          ].map(([big, small], i) => (
            <Reveal key={small} delay={i * 90}>
              <p className="font-display text-4xl font-black text-honey">{big}</p>
              <p className="mt-1 text-sm text-faded">{small}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-display text-4xl font-black sm:text-5xl">
            How a <em className="text-berry">mulaqat</em> happens
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <Reveal delay={0}>
            <Ticket number="01" title="Take the vibe check" color="rgb(var(--c-flame))">
              Five fun questions. We decode your vibe.
            </Ticket>
          </Reveal>
          <Reveal delay={130}>
            <Ticket number="02" title="Swipe the campus" color="rgb(var(--c-honey))">
              Real students only. Vibe % before you swipe.
            </Ticket>
          </Reveal>
          <Reveal delay={260}>
            <Ticket number="03" title="Get spotted" color="rgb(var(--c-berry))">
              Caught a glance? Post it anonymously.
            </Ticket>
          </Reveal>
        </div>
      </section>

      {/* Vibe teaser */}
      <section className="border-y border-paper/10 bg-coal/60">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <Reveal>
            <span className="sticker text-sm">try one. right now. no signup.</span>
            <h2 className="mt-6 font-display text-3xl font-black sm:text-4xl">{teaser.q}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 text-left">
              {teaser.options.map((option, i) => (
                <button
                  key={option}
                  onClick={() => setPicked(i)}
                  className={`rounded-xl border-2 px-5 py-4 text-left font-bold transition ${
                    picked === i
                      ? 'border-flame bg-flame/15 text-flame'
                      : 'border-paper/15 text-paper hover:border-paper/40'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </Reveal>
          {picked !== null && (
            <p className="animate-fade-up mt-6 text-faded">
              Noted — somewhere on campus, someone picked exactly the same thing.{' '}
              <Link to="/register" className="font-bold text-honey underline underline-offset-4">
                Go find them →
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-5xl px-4 py-24">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-black sm:text-5xl">
            Not another <span className="outline-text">dating app</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-paper/15">
            <div className="grid grid-cols-2 border-b border-paper/15 bg-coal text-center">
              <p className="border-r border-paper/15 py-4 font-display text-xl font-black text-faded line-through decoration-flame/70">
                other apps
              </p>
              <p className="py-4 font-display text-xl font-black text-honey">Mulaqat</p>
            </div>
            {COMPARISONS.map(([them, us]) => (
              <div key={us} className="grid grid-cols-2 border-b border-paper/10 text-sm last:border-0 sm:text-base">
                <p className="border-r border-paper/10 px-5 py-4 text-faded">✗ {them}</p>
                <p className="px-5 py-4 font-bold">✓ {us}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Spotted wall preview */}
      <section className="border-y border-paper/10 bg-coal/60">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl font-black sm:text-5xl">
                The <em className="text-flame">Spotted</em> wall
              </h2>
              <p className="max-w-sm text-faded">
                Anonymous campus confessions. Half noticeboard, half rom-com plot device.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SPOTTED_SAMPLES.map((s, i) => (
              <Reveal key={s.who} delay={i * 130}>
                <blockquote className={`relative h-full rounded-xl bg-cream p-5 text-carbon shadow-lifted ${s.rot}`}>
                  <span className="tape absolute -top-3 left-6" />
                  <p className="font-medium leading-relaxed">"{s.text}"</p>
                  <footer className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-bold">— {s.who}</span>
                    <span className="rounded-full bg-carbon/10 px-2 py-0.5 text-xs font-bold">@ {s.spot}</span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="dotgrid mx-auto max-w-4xl px-4 py-28 text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-black leading-tight sm:text-6xl">
            Your story could start <em className="text-honey">this semester</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-faded">
            The vibe check takes two minutes. The right mulaqat lasts a lot longer.
          </p>
          <Link to="/register" className="btn-primary mt-9 inline-flex text-lg">
            Create your profile — it&apos;s free
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="overflow-hidden border-t border-paper/10 pb-10 pt-14">
        <p className="select-none whitespace-nowrap text-center font-display text-[18vw] font-black leading-none text-paper/5">
          MULAQAT
        </p>
        <p className="mt-6 text-center text-sm text-faded">
          Made with <span className="text-flame">♥</span> for Indore&apos;s campuses —
          from the canteen queue to the last bench and everywhere in between.
        </p>
        <p className="mt-2 text-center text-xs text-faded/50">
          Be kind. Be respectful. The Spotted wall sees everything.
        </p>
      </footer>
    </div>
  );
}
