
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Auth: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isRequesting, setIsRequesting] = useState(false);
  const { requestAccess, user } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequesting(true);
    requestAccess(formData.name, formData.phone);
    // After triggering WhatsApp, we allow them into the site with a "Profile Created" state
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="glass-panel w-full max-w-xl p-10 md:p-16 rounded-[48px] z-10 relative">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-[28px] flex items-center justify-center mx-auto text-amber-500 text-3xl mb-6 shadow-xl shadow-amber-500/5">
            <i className="fa-solid fa-key-skeleton-left-right"></i>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">ACCESS <span className="gold-gradient">PORTAL.</span></h1>
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Secure WhatsApp Authorization Bridge</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Identity</label>
            <input 
              required 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold placeholder:text-slate-700" 
              placeholder="Ex: Md. Rahim Ali"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">WhatsApp Connection</label>
            <input 
              required 
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all font-bold placeholder:text-slate-700" 
              placeholder="+8801..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-7 rounded-[32px] gold-button text-black font-black text-xl shadow-2xl active:scale-95 flex items-center justify-center gap-4 group"
            >
              <span>{isRequesting ? 'INITIATING...' : 'ACCESS VIA WHATSAPP'}</span>
              <i className="fa-brands fa-whatsapp text-2xl group-hover:scale-110 transition-transform"></i>
            </button>
            <p className="text-center mt-8 text-[9px] text-slate-600 font-bold leading-relaxed uppercase tracking-widest">
              By clicking Access, you will send your profile details to our authority for secure validation.
            </p>
          </div>
        </form>
      </div>

      {/* Aesthetic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10"></div>
    </div>
  );
};

export default Auth;
