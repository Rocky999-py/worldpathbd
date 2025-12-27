
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  walletId: string | null;
  balance: number;
  addFund: (amount: number) => Promise<string>; // Returns redirect URL
  isReady: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize or retrieve Guest Wallet ID
    let id = localStorage.getItem('wp_wallet_id');
    if (!id) {
      id = 'WP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem('wp_wallet_id', id);
    }
    setWalletId(id);
    fetchBalance(id);
    setIsReady(true);
  }, []);

  const fetchBalance = async (id: string) => {
    try {
      // In production, fetch actual balance from DB via walletId
      const savedBalance = localStorage.getItem(`wp_bal_${id}`);
      setBalance(savedBalance ? parseFloat(savedBalance) : 0);
    } catch (e) {
      console.error("Balance sync failed");
    }
  };

  const addFund = async (amount: number): Promise<string> => {
    // In production, this calls the backend SSLCommerz Init endpoint
    // For now, we simulate the redirect to the gateway
    console.log(`Initializing payment for ${amount} BDT for wallet ${walletId}`);
    
    // Simulate a successful payment update for demo purposes
    // In real app, this happens via the /success webhook
    const newBal = balance + amount;
    setBalance(newBal);
    localStorage.setItem(`wp_bal_${walletId}`, newBal.toString());
    
    return "#/payment-processing"; // Placeholder redirect
  };

  return (
    <WalletContext.Provider value={{ walletId, balance, addFund, isReady }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
