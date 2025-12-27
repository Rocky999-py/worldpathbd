
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useWallet } from '../context/WalletContext';
import MessengerChat from './MessengerChat';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { walletId, balance, user, logout } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navItems = [
    { path: '/', label: t('explore'), icon: 'fa-compass' },
    { path: '/documents', label: t('vault'), icon: 'fa-file-shield' },
    { path: '/booking-software', label: t('slotAutomator'), icon: 'fa-calendar-check' },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500/30 selection:text-white relative">
      <header className="glass-panel sticky top-0 z-[100] border-b border-white/5 backdrop-blur-3xl">
        <div className="container mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
                <div className="absolute inset-0 bg-blue-600 rounded-xl md:rounded-2xl rotate-6 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                <div className="absolute inset-0 bg-slate-950 rounded-xl md:rounded-2xl border border-amber-500/30 flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
                   <i className="fa-solid fa-earth-asia text-amber-500 text-base md:text-xl"></i>
                </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-black tracking-tighter text-white uppercase">WORLDPATH <span className="gold-gradient">BD</span></h1>
              <span className="text-[8px] text-blue-400 font-black uppercase tracking-[0.2em] mono block opacity-70">NEURAL ACCESS</span>
            </div>
          </Link>
          
          {user && (
            <nav className="hidden lg:flex gap-2 items-center">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
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
          )}

          <div className="flex items-center gap-3 md:gap-6">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 md:gap-4 bg-white/[0.03] border border-white/10 p-1.5 md:p-2 pl-3 md:pl-4 rounded-xl md:rounded-2xl hover:border-amber-500/50 transition-all group"
                >
                  <div className="text-right">
                    <div className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{user.name}</div>
                    <div className="text-xs font-black text-white uppercase tracking-tighter">
                      {balance.toLocaleString()} <span className="text-amber-500 text-[10px]">BDT</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500 rounded-lg md:rounded-xl flex items-center justify-center text-black shadow-lg group-hover:bg-white transition-all">
                    <i className="fa-solid fa-user-ninja text-[12px]"></i>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-4 w-64 glass-panel rounded-3xl border border-white/10 p-4 shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-white/5 mb-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Wallet Node</p>
                       <p className="text-sm font-bold text-white">{walletId}</p>
                    </div>
                    <div className="p-4 border-b border-white/5 mb-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Authorized Phone</p>
                       <p className="text-sm font-bold text-white">{user.phone}</p>
                    </div>
                    <Link to="/add-fund" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase text-amber-500 transition-all">
                      <i className="fa-solid fa-plus-circle"></i> Add Neural Funds
                    </Link>
                    <button onClick={() => {logout(); setShowProfileMenu(false);}} className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-rose-500/10 text-[10px] font-black uppercase text-rose-500 transition-all">
                      <i className="fa-solid fa-power-off"></i> Terminate Link
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="gold-button px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Authorize Access
              </Link>
            )}

            <div className="hidden sm:flex bg-white/5 p-1 rounded-xl border border-white/10 h-10">
              <button onClick={() => setLang('en')} className={`px-2 md:px-3 rounded-lg text-[9px] font-black ${lang === 'en' ? 'bg-white/10 text-white' : 'text-slate-600'}`}>EN</button>
              <button onClick={() => setLang('bn')} className={`px-2 md:px-3 rounded-lg text-[9px] font-black bengali ${lang === 'bn' ? 'bg-white/10 text-white' : 'text-slate-600'}`}>বাং</button>
            </div>

            {user && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white text-lg"
              >
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && user && (
          <div className="lg:hidden bg-slate-950 border-t border-white/5 animate-in slide-in-from-top duration-300">
            <div className="p-6 space-y-4">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase text-slate-300 tracking-widest"
                >
                  <i className={`fa-solid ${item.icon} text-amber-500`}></i>
                  {item.label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button onClick={() => {setLang('en'); setMobileMenuOpen(false);}} className={`py-3 rounded-xl font-black text-[10px] uppercase border ${lang === 'en' ? 'bg-white text-black border-white' : 'border-white/10 text-slate-500'}`}>English</button>
                <button onClick={() => {setLang('bn'); setMobileMenuOpen(false);}} className={`py-3 rounded-xl font-black text-[10px] uppercase bengali border ${lang === 'bn' ? 'bg-white text-black border-white' : 'border-white/10 text-slate-500'}`}>বাংলা</button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow relative">
        {children}
        <MessengerChat />
      </main>

      <footer className="py-16 md:py-24 bg-slate-950 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-6">WORLDPATH <span className="gold-gradient">BD</span></h2>
            <p className="text-slate-500 text-sm max-w-sm font-medium mb-10 leading-relaxed">
              Leading the digital frontier of visa intelligence and high-accuracy appointment automation for Bangladeshi citizens worldwide.
            </p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'linkedin', 'whatsapp'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500 transition-all">
                  <i className={`fa-brands fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {navItems.map(item => (
                <li key={item.path}><Link to={item.path} className="text-sm font-bold text-slate-500 hover:text-white transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/author" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Authority Access</Link></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Terms of Protocol</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Privacy Neural Link</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em]">© 2025 WorldPath BD Architecture. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
