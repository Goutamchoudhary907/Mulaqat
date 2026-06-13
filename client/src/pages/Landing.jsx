import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VIBE_QUESTIONS, avatarUrl } from '../lib/constants';
import ThemeToggle from '../components/ThemeToggle';
import Reveal from '../components/Reveal';

const CAMPUS_PLACES = [
  'MediSquare', 'V Block', 'Q Block', 'Main Canteen', 'Datre', 'CKD Square', 'Library', 'Bus Stand',
];

/** Slim divider ticker — the campus, scrolling by. Fades at the edges, pauses on hover. */
function PlacesTicker() {
  const strip = CAMPUS_PLACES.map((p) => `${p}  ✦  `).join('');
  return (
    <div className="ticker ticker-mask overflow-hidden border-y border-paper/10 py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap text-sm font-bold uppercase tracking-[0.3em] text-faded/50">
        <span>{strip}</span>
        <span>{strip}</span>
      </div>
    </div>
  );
}

function Ticket({ number, title, children, accent }) {
  return (
    <div className="relative h-full rounded-2xl border-2 border-dashed border-paper/25 bg-coal p-6 transition hover:-translate-y-1 hover:border-paper/50">
      {/* punched holes — ticket stub feel */}
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ink" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ink" />
      <span className={`font-display text-5xl font-black italic ${accent}`}>{number}</span>
      <h3 className="mt-3 font-display text-2xl font-black">{title}</h3>
      <p className="mt-2 leading-relaxed text-faded">{children}</p>
    </div>
  );
}

const SPOTTED_SAMPLES = [
  { text: 'To the girl in the blue kurti who laughed at my canteen tray disaster — you made a bad Monday good.', who: 'Caffeinated Sparrow', spot: 'Main Canteen', rot: '-rotate-2' },
  { text: "We've shared the library table four times now. I bring extra pens hoping you'll forget yours.", who: 'Backbench Fox', spot: 'Library', rot: 'rotate-1' },
  { text: 'You: red Activa, always parked crooked near CKD. Me: judging, but also kinda charmed.', who: 'Lowkey Panda', spot: 'CKD Square', rot: '-rotate-1' },
];

const COMPARISONS = [
  ['Strangers from anywhere', 'Only Medicaps students'],
  ['Swipe on faces', 'See your vibe % first'],
  ['"hey" … "hey" … silence', 'Icebreakers from shared answers'],
  ['Catfish roulette', 'Hand-drawn avatars, zero pressure'],
  ['Pay to see who likes you', 'Free. It is for our campus.'],
];

export default function Landing() {
  const [picked, setPicked] = useState(null);
  const teaser = VIBE_QUESTIONS[0];

  return (
    <div className="grain min-h-screen overflow-x-hidden bg-ink">
      {/* Nav + hero share the first viewport — CTAs visible without scrolling */}
      <div className="flex min-h-screen flex-col">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-display text-3xl font-black italic tracking-tight">
          Mulaqat<span className="text-flame">.</span>
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="btn-ghost px-5 py-2 text-sm">Log in</Link>
          <Link to="/register" className="btn-primary px-5 py-2 text-sm">Join free</Link>
        </div>
      </nav>

      {/* Hero — one message, one visual, one choreographed entrance */}
      <section className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pb-12 pt-6 md:pb-8">
        <div className="grid w-full items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          {/* Words */}
          <div>
            <p className="hero-rise text-xs font-bold uppercase tracking-[0.35em] text-faded" style={{ '--d': '0.05s' }}>
              Medi-Caps University · Indore
            </p>
            <h1 className="hero-rise mt-5 font-display text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl" style={{ '--d': '0.18s' }}>
              Somewhere between{' '}
              <em className="underline-draw text-flame" style={{ '--d': '1.25s' }}>MediSquare</em>{' '}
              and the Main Canteen{' '}
              <em className="underline-draw text-honey" style={{ '--d': '1.5s' }}>chai line</em>,
              your person is waiting.
            </h1>
            <p className="hero-rise mt-5 max-w-md text-lg leading-relaxed text-faded" style={{ '--d': '0.32s' }}>
              Match by <strong className="text-paper">vibe</strong>, not just photos. No randoms,
              no bots — just Medicaps.
            </p>
            <div className="hero-rise mt-7 flex flex-wrap items-center gap-4" style={{ '--d': '0.45s' }}>
              <Link to="/register" className="btn-primary text-lg">Start your story →</Link>
              <Link to="/login" className="btn-ghost">I have an account</Link>
            </div>
            <p className="hero-rise mt-4 text-sm text-faded/70" style={{ '--d': '0.58s' }}>
              Free for Medicaps students · Anonymous until you choose not to be
            </p>
          </div>

          {/* One composed visual: a matched pair, developing like a real polaroid */}
          <div className="relative mx-auto w-64 sm:w-72">
            <figure className="polaroid-back absolute -left-12 top-8 hidden w-44 rotate-[7deg] rounded-md bg-cream p-2 pb-4 shadow-lifted sm:block">
              <div className="flex h-28 items-center justify-center rounded-sm bg-carbon/90">
                <img src={avatarUrl('notionists', 'Sana Khan')} alt="" className="h-24 w-24" draggable={false} />
              </div>
            </figure>

            <figure className="polaroid-main relative rotate-[-3deg] rounded-md bg-cream p-3 pb-4 text-carbon shadow-lifted">
              <span className="tape tape-stick -top-3 left-1/2 -translate-x-1/2" />
              <div className="develop relative flex h-44 items-center justify-center rounded-sm bg-carbon/90 sm:h-48">
                <img src={avatarUrl('lorelei', 'Priya Sharma')} alt="" className="-mr-7 h-32 w-32 sm:h-36 sm:w-36" draggable={false} />
                <img src={avatarUrl('adventurer', 'Arjun Verma')} alt="" className="h-32 w-32 sm:h-36 sm:w-36" draggable={false} />
                <span className="fade-in-late absolute inset-x-0 bottom-2 mx-auto w-max animate-heartbeat text-xl">💘</span>
              </div>
              <figcaption className="fade-in-late mt-3 flex items-center justify-between gap-2 px-1">
                <div>
                  <span className="font-display text-lg font-black leading-none">Priya × Arjun</span>
                  <p className="mt-0.5 text-xs text-carbon/60">met on Mulaqat · first chai @ Datre</p>
                </div>
                <span className="sticker stamp-in shrink-0 text-xs" style={{ '--d': '1.5s', '--stamp-rot': '-3deg' }}>
                  92% vibe
                </span>
              </figcaption>
            </figure>

            <span
              className="stamp-in absolute -bottom-4 -left-5 -rotate-3 bg-berry px-3 py-1 text-sm font-bold text-milk shadow-sticker"
              style={{ '--d': '1.75s', '--stamp-rot': '-3deg' }}
            >
              spotted @ MediSquare 👀
            </span>
          </div>
        </div>
      </section>
      </div>

      <PlacesTicker />

      {/* Stats strip */}
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
          <h2 className="font-display text-4xl font-black sm:text-5xl">
            How a <em className="text-berry">mulaqat</em> happens
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <Reveal delay={0}>
            <Ticket number="01" title="Take the vibe check" accent="text-flame">
              Five delightfully unserious questions — no &quot;describe yourself in three words&quot;.
              We figure out who gets your 2 AM memes.
            </Ticket>
          </Reveal>
          <Reveal delay={130}>
            <Ticket number="02" title="Swipe the campus" accent="text-honey">
              Every profile is a Medicaps student. Your vibe % shows up before you swipe —
              compatibility over face value.
            </Ticket>
          </Reveal>
          <Reveal delay={260}>
            <Ticket number="03" title="Get spotted" accent="text-berry">
              Locked eyes with someone at MediSquare? Post it anonymously on the Spotted wall
              and let fate (and the reactions) do the rest.
            </Ticket>
          </Reveal>
        </div>
      </section>

      {/* Interactive vibe teaser */}
      <section className="border-y border-paper/10 bg-coal/60">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <Reveal>
            <span className="sticker text-sm">try one. right now. no signup.</span>
            <h2 className="mt-6 font-display text-3xl font-black sm:text-4xl">{teaser.q}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {teaser.options.map((option, i) => (
                <button
                  key={option}
                  onClick={() => setPicked(i)}
                  className={`rounded-xl border-2 px-5 py-4 text-left font-bold transition ${
                    picked === i
                      ? 'border-flame bg-flame/15 text-flame'
                      : 'border-paper/15 hover:border-paper/40'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </Reveal>
          {picked !== null && (
            <p className="mt-6 animate-fade-up text-faded">
              Noted 📝 — somewhere on campus, someone picked exactly the same thing.{' '}
              <Link to="/register" className="font-bold text-honey underline underline-offset-4">
                Go find them →
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Why we're different */}
      <section className="mx-auto max-w-5xl px-4 py-24">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-black sm:text-5xl">
            Not another <span className="outline-text">dating app</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-paper/15">
            <div className="grid grid-cols-2 border-b border-paper/15 bg-coal text-center font-display text-xl font-black sm:text-2xl">
              <p className="border-r border-paper/15 py-4 text-faded line-through decoration-flame/70">other apps</p>
              <p className="py-4 text-honey">Mulaqat</p>
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
                The <em className="text-flame">Spotted</em> wall 👀
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
                  <span className="tape -top-3 left-6" />
                  <p className="font-medium leading-relaxed">“{s.text}”</p>
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
          <Link to="/register" className="btn-primary mt-9 text-lg">
            Create your profile — it&apos;s free 💌
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="overflow-hidden border-t border-paper/10 pb-10 pt-14">
        <p className="select-none whitespace-nowrap text-center font-display text-[18vw] font-black leading-none text-paper/5">
          MULAQAT
        </p>
        <p className="mt-6 text-center text-sm text-faded">
          Made with <span className="text-flame">♥</span> for Medi-Caps University, Indore —
          from MediSquare to the Bus Stand and everywhere in between.
        </p>
        <p className="mt-2 text-center text-xs text-faded/50">
          Be kind. Be respectful. The Spotted wall sees everything.
        </p>
      </footer>
    </div>
  );
}
