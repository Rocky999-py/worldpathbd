
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
    <div className={`min-h-screen py-20 ${lang === 'bn' ? 'bengali' : ''}`}>
      <section className="container mx-auto px-6 text-center mb-32">
        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none uppercase">
          SLOT <span className="gold-gradient">AUTOMATOR.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">Enterprise Neural Core Deployment • 2025</p>
      </section>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-[64px] p-12 md:p-20 shadow-2xl border border-white/5 min-h-[700px] flex flex-col justify-center relative overflow-hidden">
            {submissionState === 'idle' && (
              <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Identity</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold" placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Contact Node</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold" placeholder="Phone (WhatsApp preferred)" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Mission Portal</label>
                    <select required value={formData.portal} onChange={e => setFormData({...formData, portal: e.target.value})} className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white bg-slate-900 outline-none focus:border-amber-500 transition-all appearance-none font-bold">
                      <option value="">Select Portal</option>
                      <option value="VFS Global">VFS Global</option>
                      <option value="BLS International">BLS International</option>
                      <option value="TLScontact">TLScontact</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Deployment Tier</label>
                    <select required value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})} className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white bg-slate-900 outline-none focus:border-amber-500 transition-all appearance-none font-bold">
                      {plans.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-3xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Initialization Fee</div>
                    <div className="text-xl font-black text-white">100.00 BDT</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Wallet</div>
                    <div className="text-xl font-black text-white">{balance.toLocaleString()} BDT</div>
                  </div>
                </div>

                {balance >= 100 ? (
                  <button type="submit" className="w-full py-6 rounded-[24px] bg-amber-500 text-black font-black text-xl hover:bg-white transition-all shadow-2xl active:scale-95">
                    INITIALIZE DEPLOYMENT
                  </button>
                ) : (
                  <Link to="/add-fund" className="w-full py-6 rounded-[24px] bg-blue-600 text-white font-black text-xl hover:bg-white hover:text-blue-600 text-center transition-all shadow-2xl flex items-center justify-center gap-4">
                    <i className="fa-solid fa-wallet"></i> ADD FUND TO START
                  </Link>
                )}
              </form>
            )}

            {submissionState === 'processing' && (
              <div className="text-center py-20">
                <div className="w-32 h-32 border-4 border-t-amber-500 border-white/10 rounded-full animate-spin mx-auto mb-12"></div>
                <h2 className="text-3xl font-black text-white uppercase tracking-[0.3em]">Analyzing_Node...</h2>
              </div>
            )}
            
            {submissionState === 'success' && (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-10 shadow-2xl border-4 border-white/10">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Command Confirmed</h2>
                <p className="text-slate-400 mb-10 font-medium text-lg">Process linked to Wallet ID: {walletId}</p>
                <button onClick={() => setSubmissionState('idle')} className="px-10 py-4 rounded-xl border border-white/10 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                  Launch New Command
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
           <div className="glass-panel border border-white/5 rounded-[64px] p-10 shadow-2xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">System_Feed</h3>
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {history.map(item => (
                  <div key={item._id} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <div className="text-[9px] font-black text-amber-500 uppercase mb-1">{item.portal}</div>
                    <div className="text-sm font-bold text-white mb-1">{item.name}</div>
                    <div className="text-[8px] font-black text-slate-600 mono uppercase">{new Date(item.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSoftware;
