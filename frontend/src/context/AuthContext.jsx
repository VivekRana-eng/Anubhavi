import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const DEFAULT_SHO_USER = {
  id: "USER-SHO-01",
  name: "Insp. Raj Kumar",
  email: "sho@anubhavi.com",
  role: "SHO",
  rank: "Inspector",
  police_id: "POL-SHO-041",
  police_station_id: "PS-MODEL-TOWN-01"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('anubhavi_user');
    return savedUser ? JSON.parse(savedUser) : DEFAULT_SHO_USER;
  });
  const [token, setToken] = useState(() => localStorage.getItem('anubhavi_token') || 'ANUBHAVI_DEFAULT_SHO_TOKEN');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('anubhavi_token', data.access_token);
      localStorage.setItem('anubhavi_user', JSON.stringify(data.user));
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(DEFAULT_SHO_USER);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: true, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
