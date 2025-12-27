
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES, VISA_TYPES } from '../constants';
import { Country, VisaType, Region } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useWallet } from '../context/WalletContext';

const Home: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);
  const [activeRegion, setActiveRegion] = useState<Region>('All');
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { user } = useWallet();

  const filteredCountries = useMemo(() => {
    if (activeRegion === 'All') return COUNTRIES;
    return COUNTRIES.filter(c => c.region === activeRegion);
  }, [activeRegion]);

  const handleStart = () => {
    if (selectedCountry && selectedVisa) {
      navigate(`/guide/${selectedCountry.id}/${selectedVisa}`);
    }
  };

  const regions: Region[] = ['All', 'Europe', 'Americas', 'Asia', 'Oceania', 'Middle East'];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Content */}
      <section className="container mx-auto px-6 pt-24 pb-16 md:pt-40 md:pb-32 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          
          {user && !user.authorized && (
            <div className="max-w-xl mx-auto bg-amber-500/10 border border-amber-500/40 p-6 rounded-[32px] mb-12 flex items-center gap-6 animate-pulse">
               <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black flex-shrink-0">
                  <i className="fa-solid fa-shield-clock"></i>
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Access: Pending Verification</p>
                  <p className="text-xs text-white font-medium leading-relaxed">Your profile is registered. Premium features like 'Slot Automator' will activate once verified via WhatsApp.</p>
               </div>
            </div>
          )}

          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-blue-500/20 animate-float">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t('intel')}
          </div>
          
          <h1 className="text-5xl md:text-[120px] font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase">
            Global <span className="gold-gradient">Intelligence</span> <br className="hidden md:block" />
            Node.
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium opacity-80">
            {t('heroSub')}
          </p>
        </div>
      </section>

      {/* Modern Interaction Core */}
      <section className="container mx-auto px-4 pb-32">
        <div className="glass-panel rounded-[48px] md:rounded-[80px] overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* 01: Destination Discovery */}
            <div className="flex-1 p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-900/20">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-500">01</div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{t('destination')}</h2>
                </div>
              </div>

              {/* Region Filter Pill */}
              <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeRegion === region 
                        ? 'bg-white text-slate-950 shadow-xl' 
                        : 'bg-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCountries.map(country => (
                  <button
                    key={country.id}
                    onClick={() => setSelectedCountry(country)}
                    className={`group relative p-4 md:p-6 rounded-[28px] md:rounded-[40px] transition-all duration-300 border-2 text-left flex flex-col items-center sm:items-start ${
                      selectedCountry?.id === country.id 
                        ? 'border-amber-500 bg-amber-500/10 shadow-2xl' 
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <img 
                      src={`https://flagcdn.com/w160/${country.isoCode}.png`} 
                      alt={`${country.name.en} Flag`} 
                      className="w-12 h-9 md:w-16 md:h-12 object-cover rounded-lg shadow-xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <span className="font-bold text-xs md:text-sm text-white line-clamp-1">{country.name[lang]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 02: Visa Specification */}
            <div className="flex-1 p-8 md:p-16 bg-blue-600/[0.02]">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-black text-blue-400">02</div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{t('visaType')}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                {VISA_TYPES.map(v => (
                  <button
                    key={v.type}
                    onClick={() => setSelectedVisa(v.type)}
                    className={`group p-5 rounded-[28px] md:rounded-[36px] transition-all duration-300 flex items-center gap-5 border-2 ${
                      selectedVisa === v.type 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${
                      selectedVisa === v.type ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'
                    }`}>
                      <i className={`fa-solid ${v.icon}`}></i>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white text-base md:text-lg">{v.label[lang]}</div>
                      <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{v.type}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-12">
                <button
                  disabled={!selectedCountry || !selectedVisa}
                  onClick={handleStart}
                  className={`w-full py-7 md:py-10 rounded-[32px] md:rounded-[48px] font-black text-xl md:text-2xl uppercase tracking-tighter transition-all flex items-center justify-center gap-4 group ${
                    selectedCountry && selectedVisa
                      ? 'gold-button'
                      : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <span>{t('generateRoadmap')}</span>
                  <i className="fa-solid fa-bolt-lightning text-lg group-hover:scale-125 transition-transform"></i>
                </button>
                <p className="text-center mt-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{t('verifiedEmbassy')}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Aesthetic Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-blue-600/10 blur-[150px] rounded-full -z-20"></div>
      <div className="absolute bottom-0 left-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-amber-500/5 blur-[150px] rounded-full -z-20"></div>
    </div>
  );
};

export default Home;
