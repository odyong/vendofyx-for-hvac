import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalJobs: 0, completedJobs: 0, activeJobs: 0, blockedJobs: 0 });

  useEffect(() => {
    api.getDashboardStats().then(setStats);
  }, []);

  const chartData = [
    { name: 'Active', value: stats.activeJobs, color: '#2563eb' },
    { name: 'Completed', value: stats.completedJobs, color: '#10b981' },
    { name: 'Blocked', value: stats.blockedJobs, color: '#ef4444' },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, iconColorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} className={iconColorClass} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Jobs" value={stats.totalJobs} icon={ClipboardCheck} colorClass="bg-blue-50" iconColorClass="text-blue-600" />
        <StatCard title="In Progress" value={stats.activeJobs} icon={Clock} colorClass="bg-amber-50" iconColorClass="text-amber-600" />
        <StatCard title="Completed" value={stats.completedJobs} icon={CheckCircle} colorClass="bg-emerald-50" iconColorClass="text-emerald-600" />
        <StatCard title="Blocked Jobs" value={stats.blockedJobs} icon={AlertTriangle} colorClass="bg-red-50" iconColorClass="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Job Status Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Compliance Alerts</h3>
          <div className="space-y-4">
            {stats.blockedJobs > 0 ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                <AlertTriangle className="text-red-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">Immediate Attention Required</h4>
                  <p className="text-sm text-red-700">{stats.blockedJobs} jobs have been open for over 48 hours without completion.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-3">
                <CheckCircle className="text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">All Clear</h4>
                  <p className="text-sm text-emerald-700">No major compliance delays detected in current open jobs.</p>
                </div>
              </div>
            )}
            
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Billing & Subscription</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                <span className="text-sm text-slate-600">Your next bill is due in 12 days.</span>
                <button 
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-100 transition-colors"
                  onClick={() => alert('Paddle Checkout Simulation: Redirecting to payment gateway...')}
                >
                  Manage Billing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
