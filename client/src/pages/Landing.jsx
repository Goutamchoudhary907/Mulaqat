import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VIBE_QUESTIONS, avatarUrl } from '../lib/constants';
import ThemeToggle from '../components/ThemeToggle';

const MARQUEE_ITEMS = [
  'MEDI-CAPS UNIVERSITY × INDORE',
  'MATCH BY VIBE, NOT JUST PHOTOS',
  'THE SPOTTED WALL IS ALWAYS WATCHING 👀',
  'CAMPUS-ONLY. ALWAYS.',
  'FROM AB BLOCK TO 56 DUKAN',
  'CHAI DATES > COFFEE DATES',
];

function Marquee() {
  const strip = MARQUEE_ITEMS.map((item) => `${item}  ✦  `).join('');
  return (
    <div className="overflow-hidden border-b border-ink/20 bg-honey py-2 text-ink">
      <div className="flex w-max animate-marquee whitespace-nowrap font-bold tracking-widest">
        <span>{strip}</span>
        <span>{strip}</span>
      </div>
    </div>
  );
}

function Polaroid({ seed, style, name, caption, className, rot }) {
  return (
    <figure
      className={`absolute w-44 rounded-md bg-cream p-2 pb-4 text-carbon shadow-lifted sm:w-52 ${className}`}
      style={{ '--rot': rot }}
    >
      <span className="tape -top-3 left-1/2 -translate-x-1/2" />
      <div className="flex h-36 items-center justify-center rounded-sm bg-carbon/90 sm:h-44">
        <img src={avatarUrl(style, seed)} alt={name} className="h-28 w-28 sm:h-36 sm:w-36" />
      </div>
      <figcaption className="mt-2 px-1">
        <span className="font-display text-base font-black leading-none">{name}</span>
        <p className="mt-0.5 text-xs leading-snug text-carbon/70">{caption}</p>
      </figcaption>
    </figure>
  );
}

function Ticket({ number, title, children, accent }) {
  return (
    <div className="relative rounded-2xl border-2 border-dashed border-paper/25 bg-coal p-6 transition hover:-translate-y-1 hover:border-paper/50">
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
  { text: 'To the girl in the blue kurti who laughed at my canteen tray disaster — you made a bad Monday good.', who: 'Caffeinated Sparrow', spot: 'Canteen', rot: '-rotate-2' },
  { text: "We've shared the library table four times now. I bring extra pens hoping you'll forget yours.", who: 'Backbench Fox', spot: 'Library', rot: 'rotate-1' },
  { text: 'You: red Activa, always parked crooked. Me: judging, but also kinda charmed.', who: 'Lowkey Panda', spot: 'Parking', rot: '-rotate-1' },
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
      <Marquee />

      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-display text-3xl font-black italic tracking-tight">
          Mulaqat<span className="text-flame">.</span>
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="btn-ghost px-5 py-2 text-sm">Log in</Link>
          <Link to="/register" className="btn-primary px-5 py-2 text-sm">Join free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="dotgrid relative mx-auto max-w-6xl px-4 pb-28 pt-10 md:pt-16">
        <div className="relative z-10 max-w-2xl">
          <span className="sticker text-sm">मुलाक़ात (n.) — an encounter, a meeting</span>
          <h1 className="mt-6 font-display text-5xl font-black leading-[1.02] sm:text-7xl">
            Somewhere between{' '}
            <em className="text-flame">AB&nbsp;Block</em> and the{' '}
            <em className="text-honey">chai&nbsp;line</em>, your person is waiting.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-faded">
            Mulaqat is Medi-Caps University&apos;s own corner of the internet — for crushes,
            confessions and conversations that start with a <strong className="text-paper">vibe</strong>,
            not a bio. No randoms. No bots. Just campus.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register" className="btn-primary text-lg">Start your story →</Link>
            <Link to="/login" className="btn-ghost">I have an account</Link>
          </div>
          <p className="mt-4 text-sm text-faded/70">
            Free forever for Medicaps students · Anonymous until you choose not to be
          </p>
        </div>

        {/* Floating polaroid collage */}
        <div className="relative mt-16 h-72 md:absolute md:right-0 md:top-16 md:mt-0 md:h-auto md:w-[420px]">
          <Polaroid seed="Priya Sharma" style="lorelei" name="Priya, CSE '27" caption="chai > coffee. fight me." className="left-2 top-0 animate-float-slow md:left-0 md:top-4" rot="-6deg" />
          <Polaroid seed="Arjun Verma" style="adventurer" name="Arjun, Mech '26" caption="will write you bad poetry" className="left-1/2 top-10 -translate-x-1/4 animate-float-slower md:left-44 md:top-40" rot="5deg" />
          <span className="sticker absolute right-2 top-2 z-10 animate-float-slow text-sm md:-right-2 md:top-0" style={{ '--rot': '8deg' }}>
            92% VIBE ✦
          </span>
          <span className="absolute bottom-0 right-6 z-10 -rotate-6 bg-berry px-3 py-1 font-bold text-milk shadow-sticker md:bottom-8">
            spotted @ canteen 👀
          </span>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-paper/10 bg-coal/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
          {[
            ['5 questions', 'is all the vibe check takes'],
            ['0 randoms', 'campus-only, always'],
            ['24/7', 'the Spotted wall never sleeps'],
            ['∞', 'canteen dates waiting to happen'],
          ].map(([big, small]) => (
            <div key={small}>
              <p className="font-display text-4xl font-black text-honey">{big}</p>
              <p className="mt-1 text-sm text-faded">{small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="font-display text-4xl font-black sm:text-5xl">
          How a <em className="text-berry">mulaqat</em> happens
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <Ticket number="01" title="Take the vibe check" accent="text-flame">
            Five delightfully unserious questions — no &quot;describe yourself in three words&quot;.
            We figure out who gets your 2 AM memes.
          </Ticket>
          <Ticket number="02" title="Swipe the campus" accent="text-honey">
            Every profile is a Medicaps student. Your vibe % shows up before you swipe —
            compatibility over face value.
          </Ticket>
          <Ticket number="03" title="Get spotted" accent="text-berry">
            Locked eyes with someone at the canteen? Post it anonymously on the Spotted wall
            and let fate (and the reactions) do the rest.
          </Ticket>
        </div>
      </section>

      {/* Interactive vibe teaser */}
      <section className="border-y border-paper/10 bg-coal/60">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <span className="sticker text-sm">try one. right now. no signup.</span>
          <h2 className="mt-6 font-display text-3xl font-black sm:text-4xl">{teaser.q}</h2>
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
        <h2 className="text-center font-display text-4xl font-black sm:text-5xl">
          Not another <span className="outline-text">dating app</span>
        </h2>
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
      </section>

      {/* Spotted wall preview */}
      <section className="border-y border-paper/10 bg-coal/60">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-black sm:text-5xl">
              The <em className="text-flame">Spotted</em> wall 👀
            </h2>
            <p className="max-w-sm text-faded">
              Anonymous campus confessions. Half noticeboard, half rom-com plot device.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SPOTTED_SAMPLES.map((s) => (
              <blockquote key={s.who} className={`rounded-xl bg-cream p-5 text-carbon shadow-lifted ${s.rot}`}>
                <span className="tape -top-3 left-6" />
                <p className="font-medium leading-relaxed">“{s.text}”</p>
                <footer className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-bold">— {s.who}</span>
                  <span className="rounded-full bg-carbon/10 px-2 py-0.5 text-xs font-bold">@ {s.spot}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="dotgrid mx-auto max-w-4xl px-4 py-28 text-center">
        <h2 className="font-display text-4xl font-black leading-tight sm:text-6xl">
          Your story could start <em className="text-honey">this semester</em>.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-faded">
          The vibe check takes two minutes. The right mulaqat lasts a lot longer.
        </p>
        <Link to="/register" className="btn-primary mt-9 text-lg">
          Create your profile — it&apos;s free 💌
        </Link>
      </section>

      {/* Footer */}
      <footer className="overflow-hidden border-t border-paper/10 pb-10 pt-14">
        <p className="select-none whitespace-nowrap text-center font-display text-[18vw] font-black leading-none text-paper/5">
          MULAQAT
        </p>
        <p className="mt-6 text-center text-sm text-faded">
          Made with <span className="text-flame">♥</span> for Medi-Caps University, Indore —
          from AB Block to the bus stand and everywhere in between.
        </p>
        <p className="mt-2 text-center text-xs text-faded/50">
          Be kind. Be respectful. The Spotted wall sees everything.
        </p>
      </footer>
    </div>
  );
}
