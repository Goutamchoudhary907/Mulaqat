import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Spotted from './pages/Spotted';
import Profile from './pages/Profile';

function ScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <span className="animate-heartbeat text-5xl">💌</span>
    </div>
  );
}

/** Wraps app pages: requires login, adds navbar + mobile tab-bar spacing.
   Profile completeness is NOT required here — only Discover locks itself until
   the vibe check is done, so a fresh user can still browse Spotted & Profile. */
function Protected({ children }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  if (loading) return <ScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  const inConversation = /^\/chat\/.+/.test(pathname);
  return (
    <div className={`grain min-h-screen bg-ink ${inConversation ? '' : 'pb-20 md:pb-0'}`}>
      <Navbar />
      {children}
    </div>
  );
}

/** Login/register/landing redirect to the app when already signed in.
   Always lands on Discover — which itself prompts to finish the profile if needed. */
function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <ScreenLoader />;
  if (user) return <Navigate to="/discover" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GuestOnly><Landing /></GuestOnly>} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
          <Route path="/discover" element={<Protected><Discover /></Protected>} />
          <Route path="/matches" element={<Protected><Matches /></Protected>} />
          <Route path="/chat" element={<Protected><Chat /></Protected>} />
          <Route path="/chat/:roomId" element={<Protected><Chat /></Protected>} />
          <Route path="/spotted" element={<Protected><Spotted /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
