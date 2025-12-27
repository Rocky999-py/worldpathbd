
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [regType, setRegType] = useState<'Individual' | 'Agency'>('Individual');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pin: '',
    confirmPin: '',
    purpose: '',
    rlNumber: '',
    website: ''
  });
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  
  const { login, register } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (login(formData.email, formData.pin)) {
        navigate('/');
      } else {
        setError(lang === 'en' ? 'Wrong email or PIN.' : 'ভুল ইমেইল বা পিন।');
      }
    } else {
      if (formData.pin !== formData.confirmPin) {
        setError(lang === 'en' ? 'PINs do not match.' : 'পিন মেলেনি।');
        return;
      }
      setShowPayment(true);
    }
  };

  const confirmRegistration = () => {
    register({
      name: formData.name,
      email: formData.email,
      pin: formData.pin,
      type: regType,
      purpose: formData.purpose,
      rlNumber: regType === 'Agency' ? formData.rlNumber : undefined,
      website: regType === 'Agency' ? formData.website : undefined
    });
    setIsVerificationSent(true);
    setShowPayment(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="glass-panel w-full max-w-2xl p-10 md:p-16 rounded-[48px] z-10 relative">
        
        {isVerificationSent ? (
          <div className="text-center animate-fade-in space-y-8">
            <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/30 rounded-[32px] flex items-center justify-center mx-auto text-amber-500 text-3xl shadow-xl shadow-amber-500/10 floating">
              <i className="fa-solid fa-paper-plane animate-pulse"></i>
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
              {lang === 'en' ? 'Signup Successful' : 'নিবন্ধন সম্পন্ন হয়েছে'}
            </h3>
            <div className="bg-white/5 border border-amber-500/10 p-10 rounded-[40px] shadow-inner">
              <p className="text-lg font-bold text-amber-500 mb-4 uppercase tracking-widest">
                {lang === 'en' ? 'Please Check Your Email' : 'আপনার ইমেইল চেক করুন'}
              </p>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                {lang === 'en' 
                  ? 'We have sent a confirmation to your email. Our team is now checking your account. Please wait for a few minutes while we set things up for you.'
                  : 'আমরা আপনার ইমেইলে একটি প্রসেসিং কনফার্মেশন পাঠিয়েছি। আপনার অ্যাকাউন্টটি বর্তমানে আমাদের সার্ভার দ্বারা চূড়ান্ত অনুমোদনের অপেক্ষায় রয়েছে। অনুগ্রহ করে অপেক্ষা করুন।'}
              </p>
            </div>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] animate-pulse">
              {lang === 'en' ? 'Status: Waiting for Server...' : 'স্ট্যাটাস: সার্ভার কনফার্মেশনের জন্য অপেক্ষা করা হচ্ছে...'}
            </p>
            <button 
              onClick={() => {
                setIsVerificationSent(false);
                setIsLogin(true);
              }}
              className="w-full py-6 rounded-2xl bg-amber-500 text-slate-950 font-black uppercase tracking-[0.4em] text-xs hover:bg-white transition-all shadow-xl"
            >
              {lang === 'en' ? 'Go to Login' : 'লগইন-এ ফিরে যান'}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                {isLogin 
                  ? (lang === 'en' ? 'Welcome Back' : 'স্বাগতম') 
                  : (lang === 'en' ? 'Join Us' : 'যোগ দিন')}
              </h2>
              <p className="text-amber-500 font-bold tracking-widest text-[10px] uppercase">
                {isLogin 
                  ? (lang === 'en' ? 'Sign in to your account' : 'লগইন করুন')
                  : (lang === 'en' ? 'Create a new account' : 'নতুন অ্যাকাউন্ট খুলুন')}
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {!showPayment ? (
              <form onSubmit={handleAuth} className="space-y-6">
                {!isLogin && (
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-8">
                    <button 
                      type="button"
                      onClick={() => setRegType('Individual')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${regType === 'Individual' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500'}`}
                    >
                      Individual
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRegType('Agency')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${regType === 'Agency' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500'}`}
                    >
                      Travel Agent
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold" 
                        placeholder="Your Name"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold" 
                      placeholder="yourname@mail.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">6-Digit PIN</label>
                    <input 
                      required 
                      type="password" 
                      maxLength={6}
                      value={formData.pin}
                      onChange={e => setFormData({...formData, pin: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold tracking-[0.5em]" 
                      placeholder="••••••"
                    />
                  </div>
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Re-type PIN</label>
                      <input 
                        required 
                        type="password" 
                        maxLength={6}
                        value={formData.confirmPin}
                        onChange={e => setFormData({...formData, confirmPin: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold tracking-[0.5em]" 
                        placeholder="••••••"
                      />
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Why are you joining?</label>
                    <textarea 
                      required 
                      value={formData.purpose}
                      onChange={e => setFormData({...formData, purpose: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold resize-none" 
                      placeholder="Tell us a bit about your travel plans..."
                      rows={3}
                    />
                  </div>
                )}

                {!isLogin && regType === 'Agency' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Office Number (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.rlNumber}
                        onChange={e => setFormData({...formData, rlNumber: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold" 
                        placeholder="RL-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Website (Optional)</label>
                      <input 
                        type="url" 
                        value={formData.website}
                        onChange={e => setFormData({...formData, website: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold" 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-6 rounded-2xl bg-amber-500 text-slate-950 font-black uppercase tracking-[0.4em] text-xs hover:bg-white transition-all shadow-xl shadow-amber-500/10"
                >
                  {isLogin ? 'Sign In Now' : 'Create My Account'}
                </button>

                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-slate-500 hover:text-amber-500 transition-colors text-[10px] font-black uppercase tracking-widest"
                  >
                    {isLogin ? "New here? Join us today" : "Already have an account? Sign in"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center animate-fade-in space-y-8">
                <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/30 rounded-[32px] flex items-center justify-center mx-auto text-amber-500 text-3xl shadow-xl shadow-amber-500/10">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Small Sign-up Fee</h3>
                <div className="bg-white/5 border border-amber-500/10 p-10 rounded-[40px] shadow-inner">
                  <p className="text-4xl font-black gold-gradient mono mb-2">50.00 €</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">About 6,400 BDT</p>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  To get full access to our visa tools and assistant, a one-time entry fee is required.
                </p>
                <div className="flex gap-4">
                   <button 
                     onClick={() => setShowPayment(false)}
                     className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={confirmRegistration}
                     className="flex-1 py-5 rounded-2xl bg-amber-500 text-slate-950 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl shadow-amber-500/10"
                   >
                     Pay & Join
                   </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full -z-10"></div>
    </div>
  );
};

export default Auth;
