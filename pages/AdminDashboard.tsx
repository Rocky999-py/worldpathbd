
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/apiService';

interface SoftwareInquiry {
  _id: string;
  timestamp: string;
  name: string;
  portal: string;
  country: string;
  plan: string;
  status: 'Pending' | 'Active';
}

interface WalletUser extends User {
  walletId: string;
  balance: number;
  suspended: boolean;
  lastUpdated: string;
}

const AdminDashboard: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [users, setUsers] = useState<WalletUser[]>([]);
  const [inquiries, setInquiries] = useState<SoftwareInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'inquiries' | 'funds'>('users');
  const [isLoading, setIsLoading] = useState(false);

  // Fund Injection State
  const [injection, setInjection] = useState({ walletId: '', amount: '' });

  useEffect(() => {
    const token = localStorage.getItem('worldpath_token');
    const session = localStorage.getItem('worldpath_session');
    if (token && session) {
      try {
        const userObj = JSON.parse(session);
        if (userObj.role === 'admin') {
          setIsAdminLoggedIn(true);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchData();
    }
  }, [isAdminLoggedIn, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users' || activeTab === 'funds') {
        const data = await apiRequest('/admin/users');
        setUsers(data);
      } else {
        const data = await apiRequest('/public/recent-inquiries');
        setInquiries(data);
      }
    } catch (err: any) {
      console.error("Failed to load data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Updated with specific authority credentials: rocky009 and python009@
    if (loginData.username === 'rocky009' && loginData.password === 'python009@') {
      localStorage.setItem('worldpath_token', 'admin_token_' + Date.now());
      localStorage.setItem('worldpath_session', JSON.stringify({ role: 'admin', name: 'Authority Manager' }));
      setIsAdminLoggedIn(true);
    } else {
      setError('Invalid Authority Credentials');
    }
    setIsLoading(false);
  };

  const handleToggleAuth = async (walletId: string, currentStatus: boolean) => {
    try {
      await apiRequest('/admin/authorize', {
        method: 'POST',
        body: JSON.stringify({ walletId, status: !currentStatus })
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleFundInjection = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(injection.amount);
    if (isNaN(amt)) return;
    
    setIsLoading(true);
    try {
      await apiRequest('/admin/update-balance', {
        method: 'POST',
        body: JSON.stringify({ walletId: injection.walletId, amount: amt })
      });
      alert("Funds successfully injected into Node " + injection.walletId);
      setInjection({ walletId: '', amount: '' });
      fetchData();
    } catch (err) {
      alert("Injection failed. Check Wallet ID.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (walletId: string) => {
    if (!confirm("Are you sure? This node will be purged from the neural network.")) return;
    try {
      await apiRequest(`/admin/users/${walletId}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert("Purge failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('worldpath_token');
    localStorage.removeItem('worldpath_session');
    setIsAdminLoggedIn(false);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
        <div className="glass-panel w-full max-w-md p-10 md:p-12 rounded-[40px] border border-amber-500/20 shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-[24px] flex items-center justify-center mx-auto text-amber-500 text-3xl mb-6 shadow-xl shadow-amber-500/5">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Authority Portal</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">WhatsApp Agent Control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Agent ID</label>
              <input 
                required 
                type="text" 
                value={loginData.username}
                onChange={e => setLoginData({...loginData, username: e.target.value})}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold" 
                placeholder="ID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Key</label>
              <input 
                required 
                type="password" 
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold" 
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-amber-500 text-slate-950 font-black uppercase tracking-[0.4em] text-xs hover:bg-white transition-all shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Access Core'}
            </button>
            <div className="text-center mt-4">
              <Link to="/" className="text-slate-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
                <i className="fa-solid fa-arrow-left mr-2"></i> Exit
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in max-w-7xl">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12 md:mb-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">AUTHOR <span className="gold-gradient">PANEL.</span></h1>
          <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-[0.4em]">WhatsApp Agent: +8801300172795</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchData}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase hover:text-white transition-all"
          >
            <i className={`fa-solid fa-arrows-rotate mr-2 ${isLoading ? 'animate-spin' : ''}`}></i> Sync
          </button>
          <button 
            onClick={handleLogout}
            className="px-8 py-3 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-rose-500 transition-all shadow-lg"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap bg-white/5 p-1 rounded-2xl border border-white/10 mb-8 max-w-2xl">
        {[
          { id: 'users', label: 'Nodes', icon: 'fa-users-gear' },
          { id: 'funds', label: 'Fund Control', icon: 'fa-money-bill-transfer' },
          { id: 'inquiries', label: 'Command Logs', icon: 'fa-terminal' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500 hover:text-white'}`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="glass-panel rounded-[40px] border border-white/5 shadow-2xl overflow-hidden relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Profile</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Wallet Node</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Balance</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length > 0 ? users.map(u => (
                    <tr key={u.walletId} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.phone}</div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="mono text-[11px] bg-white/5 px-3 py-1.5 rounded-lg text-blue-400 border border-white/5">{u.walletId}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-amber-500 text-sm">৳{u.balance.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => handleToggleAuth(u.walletId, u.authorized)}
                          className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase border transition-all ${u.authorized ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-rose-500 text-rose-500 bg-rose-500/10 animate-pulse'}`}
                        >
                          {u.authorized ? 'AUTHORIZED' : 'PENDING WA'}
                        </button>
                      </td>
                      <td className="px-8 py-6">
                         <button 
                           onClick={() => handleDeleteUser(u.walletId)}
                           className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-slate-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                         >
                           <i className="fa-solid fa-trash-can"></i>
                         </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-600 uppercase tracking-widest font-black text-xs">No Nodes Connected</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fund Control Tab */}
        {activeTab === 'funds' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-4 glass-panel p-10 rounded-[48px] border border-white/5">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Inject Funds</h3>
                <form onSubmit={handleFundInjection} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Target Wallet ID</label>
                     <input 
                       required 
                       type="text" 
                       value={injection.walletId}
                       onChange={e => setInjection({...injection, walletId: e.target.value.toUpperCase()})}
                       className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm outline-none focus:border-amber-500"
                       placeholder="WP-XXXXXX"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Amount (BDT)</label>
                     <input 
                       required 
                       type="number" 
                       value={injection.amount}
                       onChange={e => setInjection({...injection, amount: e.target.value})}
                       className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm outline-none focus:border-amber-500"
                       placeholder="e.g. 1000"
                     />
                   </div>
                   <button 
                     type="submit"
                     disabled={isLoading}
                     className="w-full py-5 rounded-2xl bg-amber-500 text-slate-950 font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-white transition-all"
                   >
                     {isLoading ? 'Injecting...' : 'Confirm Injection'}
                   </button>
                </form>
             </div>

             <div className="lg:col-span-8 glass-panel rounded-[48px] border border-white/5 overflow-hidden">
                <div className="p-10 border-b border-white/5 bg-white/5">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Wallets</h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto p-6 custom-scrollbar">
                   {users.filter(u => u.authorized).map(u => (
                     <div key={u.walletId} className="flex items-center justify-between p-6 rounded-3xl hover:bg-white/5 transition-all mb-4 border border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                              <i className="fa-solid fa-wallet"></i>
                           </div>
                           <div>
                              <div className="font-bold text-white text-sm">{u.name}</div>
                              <div className="text-[10px] text-slate-500 mono">{u.walletId}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-xl font-black text-amber-500 tracking-tighter">৳{u.balance.toLocaleString()}</div>
                           <button 
                             onClick={() => setInjection({ ...injection, walletId: u.walletId })}
                             className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white"
                           >
                             Select for Injection
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* Command Logs Tab */}
        {activeTab === 'inquiries' && (
          <div className="glass-panel rounded-[40px] border border-white/5 shadow-2xl overflow-hidden relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Mission</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Node Phone</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Tier</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inquiries.length > 0 ? inquiries.map(i => (
                    <tr key={i._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-white">{i.portal}</div>
                        <div className="text-[10px] text-slate-500">{i.country}</div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-blue-400">{i.phone}</td>
                      <td className="px-8 py-6 text-sm font-black text-white uppercase">{i.plan}</td>
                      <td className="px-8 py-6">
                        <span className="text-[9px] font-black px-3 py-1 rounded-lg uppercase border border-emerald-500/20 text-emerald-500 bg-emerald-500/10">
                          {i.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black text-slate-600 mono">{new Date(i.timestamp).toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-600 uppercase tracking-widest font-black text-xs">No Logs Recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
