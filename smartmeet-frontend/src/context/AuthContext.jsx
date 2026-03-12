import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, clearToken, saveToken, auth as authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then((data) => setUser(data.user))
      .catch(clearToken)
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    saveToken(token);
    setUser(userData);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
