
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User } from '../types';
import { apiRequest } from '../services/apiService';

interface WalletContextType {
  walletId: string | null;
  user: User | null;
  balance: number;
  isReady: boolean;
  requestAccess: (name: string, phone: string) => void;
  requestFund: (amount: number, method: string) => void;
  logout: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const OWNER_WHATSAPP = "8801300172795";

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('wp_user_profile');
    const savedId = localStorage.getItem('wp_wallet_id');
    
    if (savedUser && savedId) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setWalletId(savedId);
      
      const savedBal = localStorage.getItem(`wp_bal_${savedId}`);
      setBalance(savedBal ? parseFloat(savedBal) : 0);
      
      // Start status polling (optional/fallback)
      startStatusPolling(savedId);
    }
    setIsReady(true);

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  const startStatusPolling = (id: string) => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    
    const checkStatus = async () => {
      try {
        const data = await apiRequest(`/wallet/status/${id}`);
        setBalance(data.balance);
        localStorage.setItem(`wp_bal_${id}`, data.balance.toString());
        
        setUser(prev => {
          if (!prev) return null;
          const updated = { ...prev, authorized: data.authorized };
          localStorage.setItem('wp_user_profile', JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        // Fallback to local storage if API is not available
        const savedBal = localStorage.getItem(`wp_bal_${id}`);
        if (savedBal) setBalance(parseFloat(savedBal));
      }
    };

    checkStatus();
    pollTimer.current = setInterval(checkStatus, 10000); // Check every 10 seconds
  };

  const requestAccess = async (name: string, phone: string) => {
    const id = 'WP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const newUser: User = {
      id,
      name,
      phone,
      authorized: false,
      registeredAt: Date.now()
    };
    
    localStorage.setItem('wp_user_profile', JSON.stringify(newUser));
    localStorage.setItem('wp_wallet_id', id);
    setUser(newUser);
    setWalletId(id);

    try {
      await apiRequest('/wallet/sync', {
        method: 'POST',
        body: JSON.stringify({ walletId: id, name, phone })
      });
      startStatusPolling(id);
    } catch (e) {
      console.warn("Server offline, profile saved locally.");
    }

    const message = `Hello WorldPath Authority, I want to access the site.%0A%0A*Profile Details*%0AName: ${name}%0APhone: ${phone}%0AWallet ID: ${id}%0A%0APlease authorize my account.`;
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${message}`, '_blank');
  };

  const requestFund = (amount: number, method: string) => {
    if (!user || !walletId) return;

    const message = `Hello WorldPath Authority, I want to add funds to my Neural Wallet.%0A%0A*Deposit Request*%0AName: ${user.name}%0AWallet ID: ${walletId}%0AAmount: ${amount} BDT%0AMethod: ${method}%0A%0APlease confirm the transaction and update my balance.`;
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${message}`, '_blank');
  };

  const logout = () => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    localStorage.removeItem('wp_user_profile');
    localStorage.removeItem('wp_wallet_id');
    setUser(null);
    setWalletId(null);
    setBalance(0);
  };

  return (
    <WalletContext.Provider value={{ walletId, user, balance, isReady, requestAccess, requestFund, logout }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
