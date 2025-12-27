
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiRequest } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  login: (email: string, pin: string) => Promise<boolean>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('worldpath_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pin: string) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, pin }),
      });
      localStorage.setItem('worldpath_token', data.token);
      localStorage.setItem('worldpath_session', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const register = async (userData: any) => {
    await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('worldpath_session');
    localStorage.removeItem('worldpath_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
