import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../lib/api';
import { API_URL, VIBE_COUNT } from '../lib/constants';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admirers, setAdmirers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [onlineIds, setOnlineIds] = useState([]);
  const socketRef = useRef(null);

  const connectSocket = (token) => {
    if (socketRef.current) socketRef.current.disconnect();
    // Empty API_URL → connect to same origin (prod, and dev via Vite ws proxy).
    const socket = io(API_URL || undefined, { auth: { token } });
    socket.on('presence', (ids) => setOnlineIds(ids));
    socketRef.current = socket;
  };

  useEffect(() => {
    const token = localStorage.getItem('mulaqat_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        setAdmirers(data.admirers);
        connectSocket(token);
      })
      .catch(() => localStorage.removeItem('mulaqat_token'))
      .finally(() => setLoading(false));

    return () => socketRef.current?.disconnect();
  }, []);

  const saveSession = ({ token, user }) => {
    localStorage.setItem('mulaqat_token', token);
    setUser(user);
    connectSocket(token);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem('mulaqat_token');
    socketRef.current?.disconnect();
    socketRef.current = null;
    setUser(null);
    setAdmirers(0);
  };

  // Matching needs the 5 vibe answers — until then Discover stays locked,
  // but the rest of the app (Spotted, Profile, etc.) is open.
  const profileComplete =
    Array.isArray(user?.vibe) && user.vibe.length === VIBE_COUNT && user.vibe.every((v) => v !== null && v !== undefined);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        admirers,
        setAdmirers,
        loading,
        profileComplete,
        login,
        register,
        logout,
        onlineIds,
        getSocket: () => socketRef.current,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
