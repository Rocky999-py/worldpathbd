
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pin: string) => boolean;
  register: (user: Omit<User, 'id' | 'registeredAt'>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('worldpath_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, pin: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('worldpath_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.pin === pin);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('worldpath_session', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id' | 'registeredAt'>) => {
    const users: User[] = JSON.parse(localStorage.getItem('worldpath_users') || '[]');
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      registeredAt: Date.now(),
    };
    users.push(newUser);
    localStorage.setItem('worldpath_users', JSON.stringify(users));
    // After registration, we prompt to pay/login
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('worldpath_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
