
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
  const [activeTab, setActiveTab] = useState<'users' | 'inquiries' | 'create' | 'edit'>('users');
  const [isLoading, setIsLoading] = useState(false);

  // User Forms State
  const [userForm, setUserForm] = useState({ walletId: '', name: '', phone: '', balance: 0, authorized: true });
  const [editingId, setEditingId] = useState<string | null>(null);

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
      if (activeTab === 'users' || activeTab === 'edit' || activeTab === 'create') {
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userForm)
      });
      alert("Node successfully created.");
      setUserForm({ walletId: '', name: '', phone: '', balance: 0, authorized: true });
      setActiveTab('users');
    } catch (err) {
      alert("Creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsLoading(true);
    try {
      await apiRequest(`/admin/users/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(userForm)
      });
      alert("Node successfully updated.");
      setEditingId(null);
      setActiveTab('users');
    } catch (err) {
      alert("Update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (user: WalletUser) => {
    setEditingId(user.walletId);
    setUserForm({
      walletId: user.walletId,
      name: user.name,
      phone: user.phone,
      balance: user.balance,
      authorized: user.authorized
    });
    setActiveTab('edit');
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
              <input required type="text" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold" placeholder="ID" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Key</label>
              <input required type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500 transition-all text-sm font-bold" placeholder="••••••••" />
            </div>
            {error && <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full py-5 rounded-2xl bg-amber-500 text-slate-950 font-black uppercase tracking-[0.4em] text-xs hover:bg-white transition-all shadow-xl disabled:opacity-50">
              {isLoading ? 'Verifying...' : 'Access Core'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in max-w-7xl">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">AUTHOR <span className="gold-gradient">PANEL.</span></h1>
          <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-[0.4em]">WhatsApp Agent: +8801300172795</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => { setUserForm({ walletId: '', name: '', phone: '', balance: 0, authorized: true }); setEditingId(null); setActiveTab('create'); }} className="px-8 py-3 rounded-xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">
            Add New User
          </button>
          <button onClick={handleLogout} className="px-8 py-3 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-rose-500 transition-all shadow-lg">
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap bg-white/5 p-1 rounded-2xl border border-white/10 mb-8 max-w-2xl">
        {[
          { id: 'users', label: 'Nodes', icon: 'fa-users-gear' },
          { id: 'inquiries', label: 'Command Logs', icon: 'fa-terminal' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500 hover:text-white'}`}>
            <i className={`fa-solid ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* List Tab */}
        {activeTab === 'users' && (
          <div className="glass-panel rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Profile Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Wallet Node</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Balance (BDT)</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Authorization</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.walletId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.phone}</div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="mono text-[11px] bg-white/5 px-3 py-1.5 rounded-lg text-blue-400 border border-white/5">{u.walletId}</span>
                      </td>
                      <td className="px-8 py-6 font-black text-amber-500 text-sm">৳{u.balance.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <button onClick={() => handleToggleAuth(u.walletId, u.authorized)} className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase border ${u.authorized ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-rose-500 text-rose-500 bg-rose-500/10'}`}>
                          {u.authorized ? 'AUTHORIZED' : 'PENDING'}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                         <button onClick={() => startEditing(u)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-blue-400 hover:bg-blue-600 hover:text-white transition-all inline-flex items-center justify-center">
                           <i className="fa-solid fa-pen-to-square"></i>
                         </button>
                         <button onClick={() => handleDeleteUser(u.walletId)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-rose-600 hover:bg-rose-500 hover:text-white transition-all inline-flex items-center justify-center">
                           <i className="fa-solid fa-trash-can"></i>
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create / Edit Form Tab */}
        {(activeTab === 'create' || activeTab === 'edit') && (
          <div className="glass-panel max-w-2xl mx-auto w-full p-10 md:p-14 rounded-[48px] border border-white/5">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
              {activeTab === 'create' ? 'Manually Add Node' : 'Modify Existing Node'}
            </h3>
            <form onSubmit={activeTab === 'create' ? handleCreateUser : handleUpdateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Identity</label>
                  <input required type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm outline-none focus:border-amber-500" placeholder="Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">WA Phone</label>
                  <input required type="tel" value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm outline-none focus:border-amber-500" placeholder="+8801..." />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Initial Balance (BDT)</label>
                  <input required type="number" value={userForm.balance} onChange={e => setUserForm({...userForm, balance: parseInt(e.target.value)})} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm outline-none focus:border-amber-500" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Node ID (Optional)</label>
                  <input type="text" value={userForm.walletId} disabled={activeTab === 'edit'} onChange={e => setUserForm({...userForm, walletId: e.target.value.toUpperCase()})} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm outline-none focus:border-amber-500 disabled:opacity-50" placeholder="WP-XXXXXX" />
                </div>
              </div>
              <div className="flex items-center gap-4 py-4">
                <button type="button" onClick={() => setUserForm({...userForm, authorized: !userForm.authorized})} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${userForm.authorized ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-slate-500 border-white/10'}`}>
                  {userForm.authorized ? 'Authorized' : 'Unauthorized'}
                </button>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" disabled={isLoading} className="flex-grow py-5 rounded-2xl bg-amber-500 text-slate-950 font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-white transition-all">
                  {isLoading ? 'Processing...' : activeTab === 'create' ? 'Create Node' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setActiveTab('users')} className="px-10 py-5 rounded-2xl bg-white/5 text-slate-500 font-black uppercase text-xs tracking-[0.2em] hover:text-white transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'inquiries' && (
          <div className="glass-panel rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Mission</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Phone</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Tier</th>
                    <th className="px-8 py-6 text-[10px] font-black text-amber-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inquiries.map(i => (
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
                    </tr>
                  ))}
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
