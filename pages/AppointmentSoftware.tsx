
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { COUNTRIES } from '../constants';

interface SoftwareInquiry {
  id: string;
  timestamp: number;
  name: string;
  portal: string;
  country: string;
  plan: string;
  status: 'Pending' | 'Active';
}

const AppointmentSoftware: React.FC = () => {
  const { lang, t } = useLanguage();
  const [submissionState, setSubmissionState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [history, setHistory] = useState<SoftwareInquiry[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '', portal: '', countryId: '', plan: 'Basic' });

  useEffect(() => {
    const saved = localStorage.getItem('software_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionState('processing');

    setTimeout(() => {
      const selectedCountry = COUNTRIES.find(c => c.id === formData.countryId);
      const newInquiry: SoftwareInquiry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        name: formData.name,
        portal: formData.portal,
        country: selectedCountry?.name[lang] || 'Unknown',
        plan: formData.plan,
        status: 'Pending'
      };
      const updatedHistory = [newInquiry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('software_history', JSON.stringify(updatedHistory));
      setSubmissionState('success');
    }, 4000);
  };

  const plans = [
    {
      id: 'Basic',
      name: lang === 'en' ? 'Essential' : 'কোর ফেজ',
      price: '1,650€ — 2,650€',
      features: [
        lang === 'en' ? '2 Months Free Support' : '২ মাস ফ্রি আপগ্রেড',
        lang === 'en' ? 'Regular Site Access' : 'স্ট্যান্ডার্ড পোর্টাল বাইপাস',
        lang === 'en' ? 'For 1 Agent' : 'সিঙ্গেল ইউজার নোড'
      ],
      glow: 'shadow-blue-500/20'
    },
    {
      id: 'Standard',
      name: lang === 'en' ? 'Pro Booker' : 'নিউরাল সার্জ',
      price: '2,850€ — 5,000€',
      features: [
        lang === 'en' ? '4 Months Free Support' : '৪ মাস ফ্রি আপগ্রেড',
        lang === 'en' ? 'Anti-Block Features' : 'উন্নত বট ডিটেকশন শিল্ড',
        lang === 'en' ? 'Faster Booking Speed' : 'মাল্টি-সেশন স্কেলিং'
      ],
      glow: 'shadow-amber-500/40 border-amber-500/30',
      popular: true
    },
    {
      id: 'Premium',
      name: lang === 'en' ? 'Unlimited' : 'ইনফিনিট এক্সেস',
      price: '8,000€ — 10,000€',
      features: [
        lang === 'en' ? '1 Year Full Support' : '১ বছর ফুল সাপোর্ট ফ্রি',
        lang === 'en' ? 'Your Own Expert Tech' : 'ডেডিকেটেড নিউরাল ইঞ্জিনিয়ার',
        lang === 'en' ? 'Multiple Bookings at Once' : 'আনলিমিটেড পোর্টাল নোড'
      ],
      glow: 'shadow-rose-500/20'
    }
  ];

  return (
    <div className={`min-h-screen py-20 ${lang === 'bn' ? 'bengali' : ''}`}>
      {/* Hero */}
      <section className="container mx-auto px-6 text-center mb-32">
        <div className="inline-flex items-center gap-3 bg-amber-500/10 text-amber-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 gold-border shadow-[0_0_20px_rgba(251,191,36,0.1)]">
          <i className="fa-solid fa-crown animate-pulse"></i>
          {lang === 'en' ? 'Premium Booking Tool' : 'এন্টারপ্রাইজ নিউরাল কোর'}
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none uppercase">
          APPOINTMENT <span className="gold-gradient">BOOKER.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-16 leading-relaxed">
          {t('softwareSub')}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <div className="glass-panel px-10 py-6 rounded-[32px] border border-white/10 shadow-2xl">
            <div className="text-[10px] font-black uppercase text-amber-500/60 tracking-widest mb-1">{t('automationPossibility')}</div>
            <div className="text-2xl font-black text-white">100% Works</div>
          </div>
          <div className="glass-panel px-10 py-6 rounded-[32px] border border-white/10 shadow-2xl">
            <div className="text-[10px] font-black uppercase text-blue-400/60 tracking-widest mb-1">{t('milestonePayment')}</div>
            <div className="text-2xl font-black text-blue-400">Low Advance</div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Panel */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-[64px] p-12 md:p-20 shadow-2xl border border-white/5 relative overflow-hidden min-h-[700px] flex flex-col justify-center">
            
            {submissionState === 'idle' && (
              <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-4">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold" 
                      placeholder="Your Name" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-4">Phone Number</label>
                    <input 
                      required 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold" 
                      placeholder="+8801..." 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-4">{t('selectCountry')}</label>
                    <select 
                      required 
                      value={formData.countryId}
                      onChange={(e) => setFormData({...formData, countryId: e.target.value})}
                      className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Select Country</option>
                      {COUNTRIES.map(c => (
                        <option key={c.id} value={c.id} className="bg-slate-900">{c.name[lang]} (from BD)</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-4">Booking Portal</label>
                    <select 
                      required 
                      value={formData.portal}
                      onChange={(e) => setFormData({...formData, portal: e.target.value})}
                      className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Select Website</option>
                      <option value="VFS Global" className="bg-slate-900">VFS Global</option>
                      <option value="BLS International" className="bg-slate-900">BLS International</option>
                      <option value="UKVI" className="bg-slate-900">UKVI Portal</option>
                      <option value="Direct Embassy" className="bg-slate-900">Embassy Direct</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-4">Pick a Service Plan</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map(plan => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setFormData({...formData, plan: plan.id})}
                        className={`p-6 rounded-[32px] border-2 transition-all text-left relative overflow-hidden group ${
                          formData.plan === plan.id 
                            ? 'border-amber-500 bg-amber-500/10 shadow-xl' 
                            : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="text-xs font-black text-white mb-1 uppercase">{plan.name}</div>
                        <div className="text-[10px] font-bold text-amber-500 mb-4">{plan.price}</div>
                        <div className="space-y-1">
                          {plan.features.map((f, i) => (
                            <div key={i} className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">• {f}</div>
                          ))}
                        </div>
                        {formData.plan === plan.id && (
                          <div className="absolute top-4 right-4 text-amber-500 animate-pulse">
                            <i className="fa-solid fa-circle-check"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">{t('milestonePayment')}</div>
                    <p className="text-sm font-bold text-white max-w-xs">{t('milestoneDesc')}</p>
                  </div>
                  <button type="submit" className="px-12 py-6 rounded-[24px] bg-white text-black font-black text-xl hover:bg-amber-500 transition-all shadow-2xl active:scale-95 uppercase">
                    Get Started
                  </button>
                </div>
              </form>
            )}

            {submissionState === 'processing' && (
              <div className="text-center animate-fade-in relative z-10">
                <div className="w-32 h-32 border-4 border-t-amber-500 border-white/5 rounded-full animate-spin mx-auto mb-10 shadow-[0_0_30px_rgba(251,191,36,0.1)]"></div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">{t('processingProposal')}</h2>
                <p className="text-amber-500/60 font-bold tracking-widest italic">{t('analyzingPortal')}</p>
              </div>
            )}

            {submissionState === 'success' && (
              <div className="text-center animate-fade-in relative z-10">
                <div className="w-24 h-24 bg-amber-500 text-black rounded-full flex items-center justify-center text-4xl mx-auto mb-10 shadow-[0_0_50px_rgba(251,191,36,0.3)]">
                  <i className="fa-solid fa-check-double"></i>
                </div>
                <h2 className="text-5xl font-black text-white mb-8 tracking-tighter uppercase">{t('welcomeSuccess')}</h2>
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] mb-10 shadow-inner max-w-2xl mx-auto">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4">{t('automationPossibility')}: 100%</p>
                  <p className="text-2xl font-black text-white leading-tight mb-4">{t('successTimeline')}</p>
                  <p className="text-blue-400 font-bold text-sm italic">{t('contactSoon')}</p>
                </div>
                <button 
                  onClick={() => setSubmissionState('idle')}
                  className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] hover:text-amber-500 transition-colors"
                >
                  Start New Inquiry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Log */}
        <div className="lg:col-span-4">
          <div className="glass-panel border border-white/5 rounded-[64px] p-10 shadow-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-black text-white tracking-tighter uppercase">RECENT_ORDERS</h3>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-base font-black mono">
                {history.length}
              </div>
            </div>

            <div className="flex-grow space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {history.length > 0 ? (
                history.map((item) => (
                  <div key={item.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] hover:bg-amber-500/[0.03] transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="max-w-[70%]">
                        <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 truncate">{item.portal} • {item.country}</div>
                        <div className="text-sm font-bold text-white truncate">{item.name}</div>
                      </div>
                      <div className="text-[9px] text-slate-600 font-black mono uppercase">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{item.plan} Plan</div>
                      <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded-lg border border-blue-400/20">
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-20">
                  <i className="fa-solid fa-list-check text-6xl mb-6"></i>
                  <p className="text-[10px] font-black tracking-widest uppercase">No Orders Yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSoftware;
