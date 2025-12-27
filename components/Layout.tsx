
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import MessengerChat from './MessengerChat';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  
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
            {/* Creative Logo */}
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                <div className="absolute inset-0 bg-slate-950 rounded-2xl border border-amber-500/30 flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
                   <div className="relative">
                      <i className="fa-solid fa-earth-asia text-amber-500 text-xl"></i>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                         <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      </div>
                   </div>
                </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">WORLDPATH <span className="gold-gradient">BD</span></h1>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mono">SMART SYSTEM 2025</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </Link>
          
          <nav className="hidden lg:flex gap-2 items-center">
            {user && navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                  location.pathname === item.path 
                    ? 'bg-amber-500/10 text-white border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.1)]' 
                    : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-xs`}></i>
                <span className={lang === 'bn' ? 'bengali' : ''}>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${lang === 'en' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-600'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('bn')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all bengali ${lang === 'bn' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-600'}`}
              >
                বাং
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-black text-white uppercase tracking-widest">{user.name}</div>
                  <div className="text-[8px] font-bold text-amber-500 uppercase tracking-[0.2em]">{user.type === 'Agency' ? 'Partner' : 'Member'}</div>
                </div>
                <button 
                  onClick={logout}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                  title="Logout"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow relative">
        {children}
        {user && <MessengerChat />}
      </main>

      <footer className="py-20 bg-slate-950 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="text-center lg:text-left max-w-xl">
              <h2 className="text-2xl font-black text-white mb-4 tracking-tighter">WORLDPATH <span className="gold-gradient">BD</span></h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed">
                Helping Bangladeshi travelers reach their dreams with smart tools and clear steps.
              </p>
            </div>
            <div className="flex gap-4">
               {['Facebook', 'Youtube', 'Whatsapp'].map(platform => (
                 <a key={platform} href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                   <i className={`fa-brands fa-${platform.toLowerCase()} text-lg`}></i>
                 </a>
               ))}
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
            <span>&copy; 2025 WorldPath BD System</span>
            <span className="gold-gradient">Trusted Visa Partner</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
