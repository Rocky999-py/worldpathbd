
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COUNTRIES } from '../constants';
import { VisaDetail } from '../types';
import { getVisaGuideDetails } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

const VisaGuide: React.FC = () => {
  const { countryId, visaType } = useParams<{ countryId: string; visaType: string }>();
  const [details, setDetails] = useState<VisaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { lang, t } = useLanguage();

  const country = COUNTRIES.find(c => c.id === countryId);

  useEffect(() => {
    const fetchDetails = async () => {
      if (country && visaType) {
        setLoading(true);
        setError(false);
        try {
          const data = await getVisaGuideDetails(country.name.en, visaType);
          setDetails(data);
        } catch (err) {
          console.error(err);
          setError(true);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetails();
  }, [country, visaType]);

  if (!country) return <div className="text-center py-40 text-slate-500 font-black tracking-widest uppercase">System_Failure: Node_Missing</div>;

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-40 text-center">
        <div className="w-32 h-32 bg-blue-600/10 rounded-[40px] border border-blue-600/20 flex items-center justify-center mx-auto mb-12 shadow-[0_0_30px_rgba(59,130,246,0.1)] floating">
          <i className="fa-solid fa-atom text-5xl text-blue-500 animate-spin-slow"></i>
        </div>
        <h2 className={`text-5xl font-black text-white mb-6 tracking-tighter uppercase ${lang === 'bn' ? 'bengali' : ''}`}>{t('scanning')}</h2>
        <p className={`text-slate-500 font-black uppercase tracking-[0.3em] max-w-md mx-auto text-xs ${lang === 'bn' ? 'bengali' : ''}`}>
          {t('retrieving')}
        </p>
      </div>
    );
  }

  if (error || !details) return (
    <div className="container mx-auto px-6 py-40 text-center">
      <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
        <i className="fa-solid fa-triangle-exclamation text-4xl text-rose-500"></i>
      </div>
      <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">Protocol Fault</h2>
      <button onClick={() => window.location.reload()} className="bg-white text-black px-12 py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all">
        REBOOT_DIAGNOSTICS
      </button>
    </div>
  );

  const statusColors = {
    Open: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    Restricted: 'text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
    Busy: 'text-amber-400 border-amber-500/20 bg-amber-500/5 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
  };

  return (
    <div className={`container mx-auto px-6 py-12 max-w-7xl animate-fade-in ${lang === 'bn' ? 'bengali' : ''}`}>
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <Link to="/" className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition group">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-400/20 transition-all">
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          {t('changeSelection')}
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <div className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-4 ${statusColors[details.currentStatus.status]}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${details.currentStatus.status === 'Open' ? 'bg-emerald-500 animate-ping' : 'bg-current'}`}></span>
            {details.currentStatus.status} Protocol
          </div>
          <div className="glass-panel px-8 py-3 rounded-full flex items-center gap-5 border border-white/5 shadow-xl">
            <img src={`https://flagcdn.com/w80/${country.isoCode}.png`} alt={country.name.en} className="w-8 h-6 object-cover rounded shadow-lg grayscale hover:grayscale-0 transition-all" />
            <span className="text-sm font-black text-white uppercase tracking-widest">{country.name[lang]}</span>
          </div>
        </div>
      </div>

      {/* Main Roadmap Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
        <div className="lg:col-span-3 glass-panel p-12 md:p-20 rounded-[64px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
            <i className="fa-solid fa-map-location-dot text-[400px]"></i>
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight uppercase">
              {visaType} ACCESS <br />
              <span className="gold-gradient">STRATEGY.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-3xl mb-16 leading-relaxed">
              {details.currentStatus[lang]}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{t('expectedWait')}</span>
                <div className="text-3xl font-black text-white">{details.timeline[lang]}</div>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{t('estCost')}</span>
                <div className="text-3xl font-black text-blue-400">{details.costs.totalEstimatedBDT[lang]}</div>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{t('processingCenter')}</span>
                <div className="text-3xl font-black text-white">{details.costs.serviceProviderName[lang]}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 p-12 rounded-[64px] text-white shadow-2xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <i className="fa-solid fa-bolt text-[150px]"></i>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">{t('readyStart')}</h3>
            <p className="text-blue-100 text-sm font-bold leading-relaxed mb-12">
              {t('advisorHelp')}
            </p>
          </div>
          <div className="space-y-4 relative z-10">
            <Link to="/documents" className="block w-full text-center bg-white text-black py-6 rounded-[24px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl">
              {t('verifyDocs')}
            </Link>
          </div>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center gap-6 mb-16">
            <div className="w-16 h-16 rounded-[28px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl shadow-xl">
              <i className="fa-solid fa-route"></i>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{t('applicationPath')}</h2>
          </div>

          <div className="space-y-24 border-l-2 border-white/5 ml-8 pl-12">
            {details.detailedSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[73px] top-0 w-12 h-12 rounded-2xl bg-slate-900 border border-blue-600 text-blue-400 flex items-center justify-center font-black mono text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                  {idx + 1}
                </div>
                <div className="glass-panel p-10 md:p-14 rounded-[56px] border border-white/5 shadow-2xl hover:bg-white/[0.04] transition-all">
                  <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">{step.title[lang]}</h3>
                  <div className="bg-white/[0.03] p-8 rounded-[32px] mb-10 border border-white/5 shadow-inner">
                    <p className="text-slate-400 font-medium leading-relaxed">{step.action[lang]}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[32px] bg-rose-500/[0.03] border border-rose-500/10">
                      <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3">Protocol_Error</div>
                      <p className="text-sm font-bold text-slate-300 leading-snug">{step.commonProblem[lang]}</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-amber-500/[0.03] border border-amber-500/10">
                      <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">Neural_Fix</div>
                      <p className="text-sm font-bold text-slate-300 leading-snug">{step.solution[lang]}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-12 sticky top-40">
          <div className="glass-panel rounded-[48px] border border-white/5 p-12 shadow-2xl">
            <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10">{t('mandatoryDocs')}</h3>
            <div className="space-y-6">
              {details.requirements.map((req, i) => (
                <div key={i} className="flex gap-5 group items-start">
                  <div className="w-6 h-6 rounded-lg border border-white/10 flex-shrink-0 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-400/20 transition-all mt-0.5">
                    <i className="fa-solid fa-check text-[10px] text-white opacity-0 group-hover:opacity-100"></i>
                  </div>
                  <p className="text-sm font-bold text-slate-400 leading-snug group-hover:text-white transition-colors">{req[lang]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <i className="fa-solid fa-sack-dollar text-[150px]"></i>
            </div>
            <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10">{t('financialSummary')}</h3>
            <div className="space-y-6 relative z-10">
               <div className="flex justify-between items-center py-3 border-b border-white/5">
                 <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Embassy</span>
                 <span className="font-bold mono text-sm">{details.costs.embassyFee[lang]}</span>
               </div>
               <div className="flex justify-between items-center py-3 border-b border-white/5">
                 <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Center</span>
                 <span className="font-bold mono text-sm">{details.costs.serviceProviderFee[lang]}</span>
               </div>
               <div className="pt-8">
                 <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-3">Protocol Total</div>
                 <div className="text-4xl font-black gold-gradient mono tracking-tighter">{details.costs.totalEstimatedBDT[lang]}</div>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VisaGuide;
