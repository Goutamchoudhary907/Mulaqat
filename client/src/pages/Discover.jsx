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
      /* swipe is fire-and-forget; worst case the card reappears next visit */
    }
  };

  return (
    <main className="dotgrid mx-auto max-w-6xl px-4 pb-32 pt-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-black">
            Tonight&apos;s <em className="text-flame">deck</em>
          </h1>
          <p className="mt-1 text-sm text-faded">Sorted by vibe %, highest first. Drag or use the buttons.</p>
        </div>
        {admirers > 0 && (
          <span className="rotate-1 bg-berry px-3 py-1.5 text-sm font-bold text-paper shadow-sticker">
            🔥 {admirers} {admirers === 1 ? 'person has' : 'people have'} liked you — find them!
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <span className="animate-heartbeat text-5xl">💌</span>
        </div>
      ) : deck.length > 0 ? (
        <SwipeDeck deck={deck} myVibe={myVibe} onSwipe={handleSwipe} />
      ) : (
        <div className="card-paper mx-auto max-w-md p-10 text-center">
          <p className="text-5xl">🫖</p>
          <h2 className="mt-4 font-display text-2xl font-black">You&apos;ve seen everyone for now</h2>
          <p className="mt-2 text-faded">
            Campus isn&apos;t <em>that</em> big. New students join all the time — meanwhile,
            the Spotted wall is always entertaining.
          </p>
          <Link to="/spotted" className="btn-primary mt-6">Visit the Spotted wall 👀</Link>
        </div>
      )}

      <MatchOverlay match={match} onClose={() => setMatch(null)} />
    </main>
  );
}
