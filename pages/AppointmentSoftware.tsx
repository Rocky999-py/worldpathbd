
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { COUNTRIES } from '../constants';
import { apiRequest } from '../services/apiService';
import { useWallet } from '../context/WalletContext';
import { Link } from 'react-router-dom';

interface SoftwareInquiry {
  _id: string;
  timestamp: string;
  name: string;
  portal: string;
  country: string;
  plan: string;
  status: 'Pending' | 'Active';
}

const AppointmentSoftware: React.FC = () => {
  const { lang, t } = useLanguage();
  const { walletId, balance } = useWallet();
  const [submissionState, setSubmissionState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [history, setHistory] = useState<SoftwareInquiry[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '', portal: '', countryId: '', plan: 'Basic' });

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiRequest('/public/recent-inquiries');
      setHistory(data);
    } catch (err) {
      console.warn("Feed disconnected");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (balance < 100) {
      alert("Insufficient funds in Neural Wallet. Please add minimum 100 BDT to initialize deployment.");
      return;
    }
    setSubmissionState('processing');

    try {
      const selectedCountry = COUNTRIES.find(c => c.id === formData.countryId);
      await apiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          walletId,
          country: selectedCountry?.name[lang] || 'Unknown',
        }),
      });
      
      setSubmissionState('success');
      fetchHistory();
    } catch (err: any) {
      alert(`Fault: ${err.message}`);
      setSubmissionState('idle');
    }
  };

  const plans = [
    { id: 'Basic', name: 'Essential', price: '1,650€' },
    { id: 'Standard', name: 'Pro Booker', price: '2,850€' },
    { id: 'Premium', name: 'Unlimited', price: '8,000€' }
  ];

  return (
    <div className={`min-h-screen py-16 md:py-32 ${lang === 'bn' ? 'bengali' : ''}`}>
      <section className="container mx-auto px-6 text-center mb-20 md:mb-32">
        <div className="inline-flex items-center gap-3 bg-amber-500/10 text-amber-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 border border-amber-500/20">
          <i className="fa-solid fa-bolt animate-pulse"></i> High-Accuracy Engine
        </div>
        <h1 className="text-5xl md:text-[100px] font-black text-white mb-8 tracking-tighter leading-none uppercase">
          SLOT <span className="gold-gradient">AUTOMATOR.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">Enterprise Deployment Module v4.2 • 2025</p>
      </section>

      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
        
        {/* Main Control Panel */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-[40px] md:rounded-[64px] p-8 md:p-20 shadow-2xl border border-white/5 min-h-[600px] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -z-10"></div>
            
            {submissionState === 'idle' && (
              <form onSubmit={handleSubmit} className="space-y-10 md:space-y-14 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Deployment Operator</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 md:p-6 rounded-2xl md:rounded-[28px] bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold placeholder:text-slate-700" placeholder="Your Full Name" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Secure Contact (WA)</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-5 md:p-6 rounded-2xl md:rounded-[28px] bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold placeholder:text-slate-700" placeholder="+8801..." />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Target Architecture</label>
                    <select required value={formData.portal} onChange={e => setFormData({...formData, portal: e.target.value})} className="w-full p-5 md:p-6 rounded-2xl md:rounded-[28px] bg-slate-900 border border-white/10 text-white outline-none focus:border-amber-500 transition-all appearance-none font-bold">
                      <option value="">Select Portal</option>
                      <option value="VFS Global">VFS Global (All Countries)</option>
                      <option value="BLS International">BLS International (Spain)</option>
                      <option value="TLScontact">TLScontact (UK/FR)</option>
                      <option value="UKVI">UKVI Priority Service</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Engagement Tier</label>
                    <select required value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})} className="w-full p-5 md:p-6 rounded-2xl md:rounded-[28px] bg-slate-900 border border-white/10 text-white outline-none focus:border-amber-500 transition-all appearance-none font-bold">
                      {plans.map(p => <option key={p.id} value={p.id}>{p.name} Logic — {p.price}</option>)}
                    </select>
                  </div>
                </div>

                {/* Real-time Wallet Sync */}
                <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[32px] md:rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">Initialization Fee</div>
                    <div className="text-3xl font-black text-white tracking-tighter">100.00 <span className="text-amber-500 text-sm">BDT</span></div>
                  </div>
                  <div className="w-px h-12 bg-white/5 hidden md:block"></div>
                  <div className="text-center md:text-right">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural Wallet Balance</div>
                    <div className="text-3xl font-black text-white tracking-tighter">{balance.toLocaleString()} <span className="text-amber-500 text-sm">BDT</span></div>
                  </div>
                </div>

                <div className="pt-4">
                  {balance >= 100 ? (
                    <button type="submit" className="w-full py-8 md:py-10 rounded-[32px] md:rounded-[48px] gold-button text-black font-black text-xl md:text-2xl shadow-2xl active:scale-95">
                      INITIALIZE CORE DEPLOYMENT
                    </button>
                  ) : (
                    <Link to="/add-fund" className="w-full py-8 md:py-10 rounded-[32px] md:rounded-[48px] bg-blue-600 text-white font-black text-xl md:text-2xl hover:bg-white hover:text-blue-600 text-center transition-all shadow-2xl flex items-center justify-center gap-4">
                      <i className="fa-solid fa-wallet"></i> TOP UP TO INITIALIZE
                    </Link>
                  )}
                  <p className="text-center mt-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">100% Secure SSL Bridge Protocol</p>
                </div>
              </form>
            )}

            {submissionState === 'processing' && (
              <div className="text-center py-24 md:py-40 animate-pulse">
                <div className="w-32 h-32 border-4 border-t-amber-500 border-white/5 rounded-full animate-spin mx-auto mb-12 shadow-[0_0_50px_rgba(251,191,36,0.1)]"></div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-[0.3em]">Analyzing_Node...</h2>
                <p className="text-amber-500 mt-6 font-black text-xs uppercase tracking-widest">Bypassing Portal Latency</p>
              </div>
            )}
            
            {submissionState === 'success' && (
              <div className="text-center py-24 md:py-40 animate-fade-in">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-10 shadow-2xl border-4 border-white/10">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">Command <br />Confirmed.</h2>
                <p className="text-slate-400 mb-12 font-medium text-lg">Ticket linked to Wallet: {walletId}</p>
                <button onClick={() => setSubmissionState('idle')} className="px-12 py-5 rounded-2xl border border-white/10 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                  Launch New Deployment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Real-time System Feed */}
        <div className="lg:col-span-4 h-full">
           <div className="glass-panel border border-white/5 rounded-[40px] md:rounded-[56px] p-8 md:p-12 shadow-2xl h-full flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">System_Feed</h3>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Global Network Sync</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
              </div>

              <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[700px]">
                {history.length > 0 ? history.map((item, idx) => (
                  <div key={item._id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 hover:bg-white/[0.08] transition-all group animate-in slide-in-from-right duration-500" style={{animationDelay: `${idx * 100}ms`}}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">{item.portal}</div>
                      <div className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        {item.status}
                      </div>
                    </div>
                    <div className="text-base font-bold text-white mb-2 line-clamp-1">{item.name}</div>
                    <div className="flex items-center justify-between">
                       <div className="text-[9px] font-black text-slate-500 uppercase mono">{item.country}</div>
                       <div className="text-[8px] font-black text-slate-700 mono">{new Date(item.timestamp).toLocaleString([], {hour:'2-digit', minute:'2-digit'})}</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 opacity-20">
                     <i className="fa-solid fa-microchip text-4xl mb-6"></i>
                     <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Live Node Data</p>
                  </div>
                )}
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/5 text-center">
                 <div className="inline-block px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-[8px] font-black text-blue-400 uppercase tracking-[0.4em]">
                    End-to-End Encryption Active
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSoftware;
