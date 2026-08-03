import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthUser } from './auth-context';

const AUTH_KEY = 'bike-shop-auth';

function getStoredAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredAuth);

  useEffect(() => {
    const handler = () => setUser(getStoredAuth());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = async (email: string, _password: string) => {
    const authUser: AuthUser = {
      email,
      name: email.split('@')[0],
      token: `mock-token-${Date.now()}`,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}