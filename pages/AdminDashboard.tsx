
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

const AdminDashboard: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [inquiries, setInquiries] = useState<SoftwareInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'inquiries'>('users');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing admin token on load
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
      const endpoint = activeTab === 'users' ? '/admin/users' : '/admin/inquiries';
      const data = await apiRequest(endpoint);
      if (activeTab === 'users') setUsers(data);
      else setInquiries(data);
    } catch (err: any) {
      console.error("Failed to load data", err);
      if (err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await apiRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });
      localStorage.setItem('worldpath_token', data.token);
      localStorage.setItem('worldpath_session', JSON.stringify({ role: 'admin', name: 'Authority' }));
      setIsAdminLoggedIn(true);
    } catch (err: any) {
      setError('Access Denied: ' + err.message);
    } finally {
      setIsLoading(false);
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
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Username</label>
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
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Password</label>
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
              {isLoading ? 'Verifying...' : 'Access System'}
            </button>
            <div className="text-center">
              <Link to="/" className="text-slate-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
                <i className="fa-solid fa-arrow-left mr-2"></i> Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20 animate-fade-in max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">AUTHOR <span className="gold-gradient">PANEL.</span></h1>
          <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-[0.4em]">Secure Node: MongoDB Atlas Production Cluster</p>
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
            className="px-8 py-3 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-rose-500 transition-all shadow-lg shadow-rose-500/10"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-8 max-w-md">
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500'}`}
        >
          User Database
        </button>
        <button 
          onClick={() => setActiveTab('inquiries')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inquiries' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500'}`}
        >
          Inquiry Feed
        </button>
      </div>

      <div className="glass-panel rounded-[40px] border border-white/5 shadow-2xl overflow-hidden mb-20 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center">
             <div className="w-10 h-10 border-4 border-t-amber-500 border-white/10 rounded-full animate-spin"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          {activeTab === 'users' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Name</th>
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Purpose</th>
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length > 0 ? users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-white">{u.name}</td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-400">{u.email}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase border ${u.type === 'Agency' ? 'border-blue-400 text-blue-400 bg-blue-400/10' : 'border-slate-500 text-slate-500 bg-slate-500/10'}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 truncate max-w-[200px]">{u.purpose}</td>
                    <td className="px-8 py-6 text-[10px] font-black text-slate-600 mono">{new Date(u.registeredAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-600 uppercase tracking-widest font-black text-xs">No records found</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Portal</th>
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Plan</th>
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inquiries.length > 0 ? inquiries.map(i => (
                  <tr key={i._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-white">{i.name}</td>
                    <td className="px-8 py-6 text-sm font-bold text-blue-400">{i.portal}</td>
                    <td className="px-8 py-6 text-sm font-black text-white">{i.plan}</td>
                    <td className="px-8 py-6">
                      <span className="text-[9px] font-black px-3 py-1 rounded-lg uppercase border border-emerald-500/20 text-emerald-500 bg-emerald-500/10">
                        {i.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-slate-600 mono">{new Date(i.timestamp).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-600 uppercase tracking-widest font-black text-xs">No logs found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
