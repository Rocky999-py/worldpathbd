
import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useLanguage } from '../context/LanguageContext';

const FundPanel: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [isProcessing, setIsProcessing] = useState(false);
  const { walletId, addFund } = useWallet();
  const { lang } = useLanguage();

  const handlePayment = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 100) {
      alert("Minimum fund addition is 100 BDT");
      return;
    }
    setIsProcessing(true);
    try {
      const redirect = await addFund(val);
      // Simulate SSLCommerz gateway redirect
      setTimeout(() => {
        setIsProcessing(false);
        alert(`Redirecting to SSLCommerz Gateway for ${method} payment...`);
        window.location.hash = '/';
      }, 1500);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  const methods = [
    { id: 'bKash', logo: 'https://download.logo.wine/logo/BKash-Logo.wine.png', color: 'bg-[#E2136E]' },
    { id: 'Nagad', logo: 'https://download.logo.wine/logo/Nagad-Logo.wine.png', color: 'bg-[#F15A22]' },
    { id: 'Rocket', logo: 'https://seeklogo.com/images/D/dutch-bangla-rocket-logo-B4D1CC458D-seeklogo.com.png', color: 'bg-[#8C3494]' },
    { id: 'Bank', logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png', color: 'bg-blue-600' }
  ];

  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">NEURAL <span className="gold-gradient">FUNDING.</span></h1>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Secure SSLCommerz Bridge Protocol</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-panel p-10 rounded-[48px] border border-white/5">
          <div className="mb-10">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Select Amount (BDT)</label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[500, 1000, 5000, 10000].map(val => (
                <button 
                  key={val} 
                  onClick={() => setAmount(val.toString())}
                  className={`py-4 rounded-2xl border-2 transition-all font-black text-sm ${amount === val.toString() ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'}`}
                >
                  ৳{val.toLocaleString()}
                </button>
              ))}
            </div>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 font-bold"
              placeholder="Custom Amount (Min 100)"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {methods.map(m => (
                <button 
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`relative overflow-hidden group p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${method === m.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                >
                  <img src={m.logo} className="w-8 h-8 object-contain filter brightness-90 group-hover:brightness-100 transition-all" />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${method === m.id ? 'text-white' : 'text-slate-500'}`}>{m.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-panel p-10 rounded-[48px] border border-white/5 bg-blue-600/5 flex-grow">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Order Summary</h3>
            <div className="space-y-4 border-b border-white/5 pb-8 mb-8">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Wallet Node</span>
                <span className="text-white">{walletId}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Method</span>
                <span className="text-amber-500">{method}</span>
              </div>
              <div className="flex justify-between text-xl font-black uppercase text-white pt-4">
                <span>Total</span>
                <span className="gold-gradient">৳{amount || '0'}</span>
              </div>
            </div>
            
            <button 
              onClick={handlePayment}
              disabled={isProcessing || !amount}
              className="w-full py-6 rounded-[24px] bg-amber-500 text-black font-black text-lg hover:bg-white transition-all shadow-2xl active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                <i className="fa-solid fa-shield-halved"></i>
              )}
              INITIALIZE GATEWAY
            </button>
          </div>

          <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
             <div className="flex items-center gap-4 mb-4">
               <img src="https://securepay.sslcommerz.com/gw/images/sslcommerz-logo.png" className="h-4 grayscale opacity-50" />
               <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Bank Level Security</span>
             </div>
             <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
               By clicking Initialize, you will be redirected to the secure SSLCommerz payment gateway. WorldPath BD does not store your financial details.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundPanel;
