
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES, VISA_TYPES } from '../constants';
import { Country, VisaType, Region } from '../types';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);
  const [activeRegion, setActiveRegion] = useState<Region>('All');
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

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
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-40 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-amber-500/10 text-amber-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-amber-500/20 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            <i className="fa-solid fa-microchip animate-pulse"></i>
            Neural Sync Verified • 2025
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.9]">
            GLOBAL ACCESS <br />
            <span className="gold-gradient">REDEFINED.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
            {t('heroSub')}
          </p>
        </div>
      </section>

      {/* Main Selection Area */}
      <section className="container mx-auto px-6 -mt-32 pb-32">
        <div className="glass-panel rounded-[64px] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Country Selector */}
            <div className="p-10 lg:p-20 border-b lg:border-b-0 lg:border-r border-amber-500/10 bg-slate-900/40">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{t('destination')}</h2>
                  <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-widest">{t('origin')}</p>
                </div>
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-black text-2xl text-amber-500 mono">01</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      activeRegion === region 
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                        : 'bg-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {filteredCountries.map(country => (
                  <button
                    key={country.id}
                    onClick={() => setSelectedCountry(country)}
                    className={`group relative p-6 rounded-[32px] transition-all duration-500 border-2 ${
                      selectedCountry?.id === country.id 
                        ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(251,191,36,0.15)]' 
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="mb-4 relative">
                      <img 
                        src={`https://flagcdn.com/w160/${country.isoCode}.png`} 
                        alt={country.name.en} 
                        className="w-16 h-12 object-cover rounded-lg shadow-2xl group-hover:scale-110 transition-transform filter brightness-75 group-hover:brightness-100"
                      />
                    </div>
                    <div className="font-bold text-sm text-white leading-tight">{country.name[lang]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visa Selector */}
            <div className="p-10 lg:p-20 bg-amber-500/[0.02]">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{t('visaType')}</h2>
                  <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-widest">{t('travelPurpose')}</p>
                </div>
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-black text-2xl text-amber-500 mono">02</div>
              </div>

              <div className="space-y-3">
                {VISA_TYPES.map(v => (
                  <button
                    key={v.type}
                    onClick={() => setSelectedVisa(v.type)}
                    className={`w-full p-5 rounded-[32px] transition-all duration-500 flex items-center gap-6 border-2 ${
                      selectedVisa === v.type 
                        ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_30px_rgba(251,191,36,0.1)]' 
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
                      selectedVisa === v.type ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-white/5 text-slate-500'
                    }`}>
                      <i className={`fa-solid ${v.icon}`}></i>
                    </div>
                    <div className="text-left flex-grow">
                      <div className="font-bold text-white text-lg mb-0.5">{v.label[lang]}</div>
                      <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{v.type}</div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                disabled={!selectedCountry || !selectedVisa}
                onClick={handleStart}
                className={`w-full mt-12 py-8 rounded-[32px] font-black text-2xl transition-all flex items-center justify-center gap-4 group ${
                  selectedCountry && selectedVisa
                    ? 'gold-button shadow-[0_0_50px_rgba(251,191,36,0.1)]'
                    : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                }`}
              >
                <span>{t('generateRoadmap')}</span>
                <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/5 blur-[150px] rounded-full -z-20 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-amber-500/5 blur-[150px] rounded-full -z-20 pointer-events-none"></div>
    </div>
  );
};

export default Home;
