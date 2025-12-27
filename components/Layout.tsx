
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useWallet } from '../context/WalletContext';
import MessengerChat from './MessengerChat';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { walletId, balance } = useWallet();
  
  const navItems = [
    { path: '/', label: t('explore'), icon: 'fa-compass' },
    { path: '/documents', label: t('vault'), icon: 'fa-file-shield' },
    { path: '/booking-software', label: t('slotAutomator'), icon: 'fa-calendar-check' },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500/30 selection:text-white">
      <header className="glass-panel sticky top-0 z-50 border-b border-white/5">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                <div className="absolute inset-0 bg-slate-950 rounded-2xl border border-amber-500/30 flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
                   <div className="relative">
                      <i className="fa-solid fa-earth-asia text-amber-500 text-xl"></i>
                   </div>
                </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">WORLDPATH <span className="gold-gradient">BD</span></h1>
              <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mono block">SECURE GLOBAL NODE</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex gap-2 items-center">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                  location.pathname === item.path 
                    ? 'bg-amber-500/10 text-white border-amber-500/40' 
                    : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-xs`}></i>
                <span className={lang === 'bn' ? 'bengali' : ''}>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link 
              to="/add-fund"
              className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-2 pl-4 rounded-2xl hover:border-amber-500/50 transition-all group"
            >
              <div className="text-right">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Wallet ID: {walletId}</div>
                <div className="text-xs font-black text-white uppercase tracking-tighter">
                  {balance.toLocaleString()} <span className="text-amber-500">BDT</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black shadow-lg group-hover:bg-white transition-all">
                <i className="fa-solid fa-plus text-xs"></i>
              </div>
            </Link>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 h-10">
              <button onClick={() => setLang('en')} className={`px-3 rounded-lg text-[9px] font-black ${lang === 'en' ? 'bg-white/10 text-white' : 'text-slate-600'}`}>EN</button>
              <button onClick={() => setLang('bn')} className={`px-3 rounded-lg text-[9px] font-black bengali ${lang === 'bn' ? 'bg-white/10 text-white' : 'text-slate-600'}`}>বাং</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow relative">
        {children}
        <MessengerChat />
      </main>

      <footer className="py-20 bg-slate-950 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">WORLDPATH <span className="gold-gradient">BD</span></h2>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">Decentralized Visa Intelligence • 2025</p>
          </div>
          <Link to="/author" className="text-[10px] font-black text-slate-700 hover:text-amber-500 transition-colors uppercase tracking-widest border border-white/5 px-6 py-3 rounded-xl">Authority Panel</Link>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
