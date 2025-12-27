
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', pin: '', confirmPin: '', purpose: '' });
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { login, register } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      if (isLogin) {
        if (await login(formData.email, formData.pin)) {
          navigate('/');
        } else {
          setError('Invalid credentials.');
        }
      } else {
        if (formData.pin !== formData.confirmPin) throw new Error('PINs do not match.');
        setShowPayment(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeRegistration = async () => {
    setIsProcessing(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        pin: formData.pin,
        purpose: formData.purpose
      });
      alert('Registration successful! Please login.');
      setIsLogin(true);
      setShowPayment(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="glass-panel w-full max-w-2xl p-10 md:p-16 rounded-[48px] z-10 relative">
        {showPayment ? (
          <div className="text-center space-y-8">
             <h2 className="text-4xl font-black text-white uppercase">Finalize Node</h2>
             <div className="p-10 bg-white/5 rounded-[40px] border border-white/10">
                <p className="text-4xl font-black gold-gradient mono">50.00 €</p>
                <p className="text-[10px] text-slate-500 mt-2 uppercase">Subscription Protocol Fee</p>
             </div>
             <button onClick={finalizeRegistration} className="w-full py-6 rounded-2xl bg-amber-500 text-black font-black uppercase shadow-xl">
               Simulate Secure Payment
             </button>
             <button onClick={() => setShowPayment(false)} className="text-slate-500 uppercase font-black text-[10px]">Back</button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{isLogin ? 'Sign In' : 'Join Network'}</h2>
              <p className="text-amber-500 font-bold tracking-widest text-[10px] uppercase">Node Verification Required</p>
            </div>
            {error && <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center uppercase">{error}</div>}
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && <input required className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />}
              <input required type="email" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="password" maxLength={6} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white tracking-[0.5em]" placeholder="6-Digit PIN" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} />
              {!isLogin && <input required type="password" maxLength={6} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white tracking-[0.5em]" placeholder="Confirm PIN" value={formData.confirmPin} onChange={e => setFormData({...formData, confirmPin: e.target.value})} />}
              <button type="submit" disabled={isProcessing} className="w-full py-6 rounded-2xl bg-amber-500 text-black font-black uppercase shadow-xl disabled:opacity-50">
                {isProcessing ? 'Connecting...' : (isLogin ? 'Login to Portal' : 'Register Identity')}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                  {isLogin ? "Initialize New Account" : "Return to Log In"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
