
import React, { useState, useEffect } from 'react';
import { User } from './types';
import { api } from './services/api';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import JobsList from './components/JobsList';
import TemplateManager from './components/TemplateManager';
import InventoryManager from './components/InventoryManager';
import { History, LayoutDashboard, ClipboardCheck, Settings, Lock } from 'lucide-react';

// Stylized VF Shield Logo - SVG Data URI fixed for linearGradient typo
const LOGO_DATA_URI = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTAgNDUwQzI1MCA0NTAgMTAwIDQwMCAxMDAgMjAwVjYwTDI1MCAyMEw0MDAgNjBWMjAwQzQwMCA0MDAgMjUwIDQ1MCAyNTAgNDUwWiIgZmlsbD0iIzFBMkI0QiIvPgo8cGF0aCBkPSJNMjUwIDQzMEMyNTAgNDMwIDExNSA0MDAgMTE1IDIwMFY3MEwyNTAgMzVMMzg1IDcwVjIwMEMzODUgNDAwIDI1MCA0MzAgMjUwIDQzMFoiIGZpbGw9InVybCgjZ3JhZDEpIi8+CjxwYXRoIGQ9Ik0xODAgMTAwTDI1MCAyODBMMzIwIDEwMEgzNTBMMjUwIDM1MEwxNTAgMTAwSDE4MFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNjAgMTUwSDM0MFYxODBIMjYwVjIzMEgzMzBWMjYwSDI2MFYzMjBIMjMwVjE1MEgyNjBaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjI1MCIgeTE9IjIwIiB4Mj0iMjUwIiB5Mj0iNDUwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMzQjgyRjYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMUEyQjRCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+`;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const u = await api.getCurrentUser();
      setUser(u);
      setLoading(false);
    };
    init();
  }, []);

  const handleLogin = async (role: 'admin' | 'tech') => {
    const u = await api.login(role);
    setUser(u);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('vendofyx_user_id');
    setUser(null);
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      api.getAuditLogs().then(setAuditLogs);
    }
  }, [activeTab]);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100 text-center">
          <div className="mb-12">
            <div className="relative inline-block mb-6">
              <img 
                src={LOGO_DATA_URI} 
                alt="Vendofyx Shield" 
                className="w-32 h-32 mx-auto object-contain drop-shadow-2xl relative z-10 animate-logo-shine" 
              />
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-150 -z-0"></div>
            </div>
            <h1 className="text-5xl font-[900] text-[#1a2b4b] tracking-tighter mb-2">Vendofyx</h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">Compliance-First Operations</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('admin')}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-[#1a2b4b] text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              <Lock size={18} /> Administrator Portal
            </button>
            <button 
              onClick={() => handleLogin('tech')}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-white text-[#1a2b4b] border-2 border-slate-200 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-50 transition-all shadow-sm hover:-translate-y-1 active:scale-95"
            >
              <ClipboardCheck size={18} /> Field Access
            </button>
          </div>

          <div className="mt-14 pt-8 border-t border-slate-50">
            <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
              v1.0.1 Compliance Engine Active
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'jobs' && <JobsList user={user} />}
      {activeTab === 'templates' && <TemplateManager />}
      {activeTab === 'inventory' && <InventoryManager />}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-black text-[#1a2b4b] uppercase tracking-tight">Enterprise Audit Log</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border px-2 py-1 rounded">Read Only</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 text-left">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Job ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium italic">No compliance entries recorded yet.</td>
                  </tr>
                ) : (
                  auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 text-xs font-bold text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-5 text-sm font-bold text-[#1a2b4b]">{log.action}</td>
                      <td className="px-6 py-5 text-sm text-blue-600 font-mono font-black">#{log.job_id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-5 text-xs font-black text-slate-400">ID: {log.user_id.toUpperCase()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 max-w-3xl">
           <h3 className="text-xl font-black text-[#1a2b4b] mb-8 uppercase tracking-tight">Organization Control</h3>
           <div className="space-y-8">
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Enterprise Entity Name</label>
               <input className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 font-black text-[#1a2b4b] outline-none focus:border-blue-500 transition-colors" defaultValue="Elite HVAC Solutions" />
             </div>
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Licensing</label>
               <div className="p-6 border-2 border-blue-100 bg-blue-50/30 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6">
                 <div>
                   <p className="font-black text-[#1a2b4b] uppercase text-sm tracking-widest mb-1">Vendofyx Enterprise Pro</p>
                   <p className="text-xs text-blue-600 font-bold">Priority Support & Compliance Locking Enabled.</p>
                 </div>
                 <button className="whitespace-nowrap px-8 py-3.5 bg-[#1a2b4b] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all">Billing Portal</button>
               </div>
             </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
