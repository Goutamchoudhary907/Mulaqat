import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { clockTime, timeAgo } from '../lib/util';

export default function Chat() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, onlineIds, getSocket } = useAuth();

  const [convos, setConvos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);

  const bottomRef = useRef(null);
  const roomRef = useRef(roomId);
  const typingTimer = useRef(null);
  const lastTypingSent = useRef(0);

  roomRef.current = roomId;
  const active = convos.find((c) => c.roomId === roomId);

  // Load conversation list once.
  useEffect(() => {
    api.get('/match/matches').then(({ data }) => setConvos(data));
  }, []);

  // Load history + join the socket room whenever the open chat changes.
  useEffect(() => {
    setMessages([]);
    setPartnerTyping(false);
    if (!roomId) return;
    api.get(`/messages/${roomId}`).then(({ data }) => setMessages(data));
    getSocket()?.emit('join_room', roomId);
  }, [roomId, getSocket]);

  // Live events.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onMessage = (msg) => {
      if (msg.roomId === roomRef.current) {
        setMessages((m) => [...m, msg]);
        setPartnerTyping(false);
      }
      // Keep the sidebar previews fresh.
      setConvos((list) =>
        [...list]
          .map((c) => (c.roomId === msg.roomId ? { ...c, lastMessage: msg } : c))
          .sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0))
      );
    };

    const onTyping = ({ roomId: r }) => {
      if (r !== roomRef.current) return;
      setPartnerTyping(true);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setPartnerTyping(false), 2200);
    };

    socket.on('new_message', onMessage);
    socket.on('typing', onTyping);
    return () => {
      socket.off('new_message', onMessage);
      socket.off('typing', onTyping);
    };
  }, [getSocket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  const send = (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !roomId) return;
    getSocket()?.emit('send_message', { roomId, text: body });
    setText('');
  };

  const handleTyping = (value) => {
    setText(value);
    const now = Date.now();
    if (now - lastTypingSent.current > 1200) {
      lastTypingSent.current = now;
      getSocket()?.emit('typing', roomId);
    }
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl md:h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside
        className={`w-full shrink-0 border-r border-paper/10 md:block md:w-80 ${roomId ? 'hidden' : 'block'}`}
      >
        <div className="border-b border-paper/10 p-4">
          <h1 className="font-display text-2xl font-black">
            Chats<span className="text-flame">.</span>
          </h1>
        </div>
        <div className="nice-scroll h-[calc(100%-4.5rem)] overflow-y-auto">
          {convos.length === 0 && (
            <p className="p-6 text-sm text-faded">
              No conversations yet.{' '}
              <Link to="/discover" className="font-bold text-honey underline">Match with someone</Link>{' '}
              to unlock the chat.
            </p>
          )}
          {convos.map((c) => (
            <button
              key={c.roomId}
              onClick={() => navigate(`/chat/${c.roomId}`)}
              className={`flex w-full items-center gap-3 border-b border-paper/5 p-4 text-left transition hover:bg-paper/5 ${
                c.roomId === roomId ? 'bg-paper/10' : ''
              }`}
            >
              <Avatar user={c.user} online={onlineIds.includes(String(c.user._id))} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-bold">{c.user.name}</p>
                  {c.lastMessage && (
                    <span className="shrink-0 text-[11px] text-faded/70">{timeAgo(c.lastMessage.createdAt)}</span>
                  )}
                </div>
                <p className="truncate text-sm text-faded">
                  {c.lastMessage ? c.lastMessage.text : `${c.compatibility}% vibe — say hi! 👋`}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat window */}
      <section className={`min-w-0 flex-1 flex-col md:flex ${roomId ? 'flex' : 'hidden'}`}>
        {!active ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <p className="text-6xl">💬</p>
            <h2 className="mt-4 font-display text-2xl font-black">Pick a conversation</h2>
            <p className="mt-2 max-w-xs text-faded">
              Your matches are listed on the left. The first message is always the bravest one.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-paper/10 p-3">
              <button onClick={() => navigate('/chat')} className="px-2 text-xl md:hidden" title="Back">←</button>
              <Avatar user={active.user} online={onlineIds.includes(String(active.user._id))} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-black">{active.user.name}</p>
                <p className="text-xs text-faded">
                  {onlineIds.includes(String(active.user._id)) ? (
                    <span className="text-emerald-400">● online now</span>
                  ) : (
                    `${active.user.branch} · ${active.user.year}`
                  )}
                </p>
              </div>
              <span className="sticker hidden text-xs sm:inline-block">{active.compatibility}% vibe</span>
            </div>

            {/* Messages */}
            <div className="nice-scroll dotgrid flex-1 space-y-2 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="mx-auto mt-8 max-w-xs rounded-xl border border-dashed border-honey/40 bg-honey/10 p-4 text-center text-sm text-faded">
                  <p className="font-bold text-honey">Icebreaker, on the house 🧊</p>
                  <p className="mt-1">
                    “Okay important question — canteen samosa or 56 Dukan? Choose wisely.”
                  </p>
                </div>
              )}
              {messages.map((msg) => {
                const mine = String(msg.sender) === String(user._id);
                return (
                  <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        mine
                          ? 'rounded-br-sm bg-flame text-milk'
                          : 'rounded-bl-sm border border-paper/10 bg-coal'
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                      <p className={`mt-0.5 text-right text-[10px] ${mine ? 'text-milk/70' : 'text-faded/70'}`}>
                        {clockTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {partnerTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-paper/10 bg-coal px-4 py-2 text-faded">
                    <span className="animate-pulse">typing…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <form onSubmit={send} className="flex gap-2 border-t border-paper/10 p-3">
              <input
                className="field flex-1"
                placeholder={`Message ${active.user.name.split(' ')[0]}…`}
                value={text}
                onChange={(e) => handleTyping(e.target.value)}
                maxLength={1000}
              />
              <button type="submit" className="btn-primary px-5" disabled={!text.trim()}>
                Send
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
