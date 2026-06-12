# Mulaqat 💌

**Medi-Caps University's own meeting place** — a campus-only dating app where students match by *vibe*, chat in real time, and confess anonymously on the Spotted wall.

> मुलाक़ात (n.) — an encounter, a meeting.

## What makes it different

- **Vibe-first matching** — five playful campus questions at signup; every profile shows a compatibility % *before* you swipe.
- **The Spotted wall 👀** — anonymous "saw you at the canteen" confessions with ❤️ / 👀 reactions, posted under random aliases like *Caffeinated Sparrow*.
- **Secret admirers counter** — see *how many* people liked you, never who, until you find them yourself.
- **Hand-drawn avatars** — everyone starts with an illustrated avatar. Vibes first, photos when you decide.
- **Real-time chat** — Socket.io messaging with typing indicators and online presence.

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18 + Vite + Tailwind CSS (`client/`) |
| Backend  | Node + Express, MVC architecture (`server/`) |
| Database | MongoDB via Mongoose (set `MONGO_URI` in `server/.env`) |
| Realtime | Socket.io |
| Auth     | JWT + bcrypt |

## Running it

Two terminals:

```bash
# Terminal 1 — API + realtime server (http://localhost:5000)
cd server
npm install
npm run dev

# Terminal 2 — React app (http://localhost:5173)
cd client
npm install
npm run dev
```

Then open **http://localhost:5173**.

### Database

A real MongoDB instance is **required**. Set the connection string in `server/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/mulaqat   # local install
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/mulaqat   # MongoDB Atlas
```

The server exits with a clear error if it can't reach the database.

> Note: `server/.mongo-data/` contains data from the old embedded-MongoDB setup.
> It is kept for reference/migration and is no longer used by the app.

### Sample data

On first boot with an empty database, the server seeds **14 sample Medicaps students**
and a few Spotted confessions so the swipe deck isn't empty (disable with
`SEED_ON_EMPTY=false` in `server/.env`).

Log in as any sample student to test matching/chat from both sides:

- Email: `priya@medicaps.ac.in` (or `arjun@`, `sana@`, `rohan@`, `ananya@`… `@medicaps.ac.in`)
- Password: `medicaps123`

Tip: open one account in a normal window and another in an incognito window — like each
other, match, and watch the chat update live.

## Project structure

```
server/                 # MVC backend
├── config/db.js        # MongoDB connection (MONGO_URI required)
├── models/             # User, Message, Confession
├── controllers/        # auth, users, match, messages, confessions
├── routes/             # one router per resource
├── middleware/auth.js  # JWT guard
├── socket/socket.js    # realtime: chat, typing, presence
├── utils/helpers.js    # compatibility scoring, room ids, aliases
└── seed.js             # sample campus data

client/                 # React frontend
├── src/components/     # Navbar, SwipeDeck, MatchOverlay, Avatar
├── src/pages/          # Landing, Login, Register, Discover, Matches, Chat, Spotted, Profile
├── src/context/        # AuthContext (session + socket + presence)
└── src/lib/            # api client, constants, vibe questions, utils
```

---

Made with ♥ for Medi-Caps University, Indore — from AB Block to the bus stand and everywhere in between.
