import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import SwipeDeck from '../components/SwipeDeck';
import MatchOverlay from '../components/MatchOverlay';

export default function Discover() {
  const { setAdmirers, admirers } = useAuth();
  const [deck, setDeck] = useState([]);
  const [myVibe, setMyVibe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    api
      .get('/match/discover')
      .then(({ data }) => {
        setDeck(data.deck);
        setMyVibe(data.myVibe);
        setAdmirers(data.admirers);
      })
      .finally(() => setLoading(false));
  }, [setAdmirers]);

  const handleSwipe = async (action, card) => {
    setDeck((d) => d.filter((c) => c._id !== card._id));
    try {
      if (action === 'like') {
        const { data } = await api.post(`/match/like/${card._id}`);
        if (data.matched) setMatch(data);
      } else {
        await api.post(`/match/pass/${card._id}`);
      }
    } catch {
      /* swipe is fire-and-forget */
    }
  };

  return (
    <main className="dotgrid mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 pt-5 pb-24 md:pb-8">
      {/* Header */}
      <div className="cream-panel on-cream mb-4 flex shrink-0 items-center justify-between px-5 py-3">
        <h1 className="font-display text-2xl font-black leading-tight" style={{ color: 'rgb(21 16 13)' }}>
          Who&apos;s on campus
        </h1>
        {admirers > 0 && (
          <span
            className="sticker sticker-berry shrink-0 text-xs"
            style={{ '--stamp-rot': '1deg' }}
          >
            {admirers} like{admirers === 1 ? '' : 's'} you
          </span>
        )}
      </div>

      {/* Deck area */}
      <div className="flex flex-1 items-start justify-center md:items-center">
        {loading ? (
          <div className="flex h-full items-center justify-center pt-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-paper/10 border-t-flame" />
          </div>
        ) : deck.length > 0 ? (
          <SwipeDeck deck={deck} myVibe={myVibe} onSwipe={handleSwipe} />
        ) : (
          <div className="card-elevated mx-auto max-w-md p-10 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'var(--honey-soft)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--c-honey))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 className="font-display text-2xl font-black">You&apos;ve seen everyone</h2>
            <p className="mt-2 text-faded">
              Campus isn&apos;t <em>that</em> big. New students join all the time — meanwhile,
              the Spotted wall is always entertaining.
            </p>
            <Link to="/spotted" className="btn-primary mt-6 inline-block">Visit the Spotted wall</Link>
          </div>
        )}
      </div>

      <MatchOverlay match={match} onClose={() => setMatch(null)} />
    </main>
  );
}
