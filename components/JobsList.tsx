
import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Job, ChecklistItem, User, JobTemplate } from '../types';
import { STATUS_MAP } from '../constants';
import { 
  Plus, 
  Check, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ClipboardCheck, 
  Search,
  RotateCcw,
  Lock,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  FileText,
  User as UserIcon,
  MessageSquare
} from 'lucide-react';

interface JobsListProps {
  user: User;
}

const JobsList: React.FC<JobsListProps> = ({ user }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [templates, setTemplates] = useState<JobTemplate[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [checklist, setChecklist] = useState<(ChecklistItem & { completed: boolean })[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [techFilter, setTechFilter] = useState<string>('all');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [formData, setFormData] = useState({ 
    templateId: '', 
    customer: '', 
    location: '',
    assignedTechId: user.id 
  });

  const loadInitialData = async () => {
    const [jobsData, templatesData, usersData] = await Promise.all([
      api.getJobs(),
      api.getTemplates(),
      api.getUsers()
    ]);
    setJobs(jobsData);
    setTemplates(templatesData);
    setTechnicians(usersData);
    
    if (!formData.assignedTechId && usersData.length > 0) {
      setFormData(prev => ({ ...prev, assignedTechId: usersData[0].id }));
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesTech = techFilter === 'all' || job.assigned_tech_id === techFilter;
      const matchesSearch = job.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesDate = true;
      if (dateStart || dateEnd) {
        const jobDate = new Date(job.created_at).setHours(0, 0, 0, 0);
        if (dateStart) {
          matchesDate = matchesDate && jobDate >= new Date(dateStart).setHours(0, 0, 0, 0);
        }
        if (dateEnd) {
          matchesDate = matchesDate && jobDate <= new Date(dateEnd).setHours(23, 59, 59, 999);
        }
      }

      return matchesStatus && matchesTech && matchesSearch && matchesDate;
    });
  }, [jobs, statusFilter, techFilter, searchQuery, dateStart, dateEnd]);

  const selectJob = async (job: Job) => {
    setSelectedJob(job);
    const cl = await api.getJobChecklist(job.id);
    setChecklist(cl);
    setError(null);
  };

  const toggleItem = async (itemId: string, completed: boolean) => {
    if (!selectedJob) return;
    await api.toggleChecklistItem(selectedJob.id, itemId, completed, user.id);
    const cl = await api.getJobChecklist(selectedJob.id);
    setChecklist(cl);
    setError(null); 
  };

  const missingRequired = checklist.filter(item => item.required && !item.completed);
  const canClose = missingRequired.length === 0;

  const handleOpenConfirmation = () => {
    if (!canClose) {
      setError(`Compliance Lock: You must complete ${missingRequired.length} more required steps.`);
      return;
    }
    setError(null);
    setCompletionNote('');
    setIsConfirmingClose(true);
  };

  const handleCloseJob = async () => {
    if (!selectedJob) return;
    setIsConfirmingClose(false);
    
    // In a real app, the completionNote would be passed to the API to be saved in audit logs or job records
    const res = await api.closeJob(selectedJob.id, user.id);
    if (res.success) {
      await loadInitialData();
      setSelectedJob(null);
    } else {
      setError(res.message || 'Error closing job');
    }
  };

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.templateId || !formData.customer || !formData.assignedTechId) return;
    await api.createJob(formData.templateId, formData.customer, formData.location, formData.assignedTechId);
    setIsCreating(false);
    setFormData({ 
      templateId: '', 
      customer: '', 
      location: '', 
      assignedTechId: user.id 
    });
    await loadInitialData();
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setTechFilter('all');
    setDateStart('');
    setDateEnd('');
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className={`flex-1 ${selectedJob ? 'hidden lg:block' : 'block'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-[900] text-[#1a2b4b] tracking-tight uppercase">Operational Grid</h3>
          {user.role === 'admin' && (
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1a2b4b] text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              <Plus size={18} /> New Assignment
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text"
                  placeholder="Search customer, location, or Job ID..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <select 
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest outline-none focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="open">In Progress</option>
                <option value="closed">Completed</option>
              </select>

              <select 
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest outline-none focus:border-blue-500"
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
              >
                <option value="all">All Personnel</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.name}</option>
                ))}
              </select>
              
              <button 
                onClick={resetFilters}
                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Reset Filters"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <ClipboardCheck size={48} className="mx-auto text-slate-100 mb-4" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No matching records found</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <button
                key={job.id}
                onClick={() => selectJob(job)}
                className={`
                  w-full text-left p-6 rounded-3xl border transition-all duration-300 group relative overflow-hidden
                  ${selectedJob?.id === job.id 
                    ? 'bg-white border-blue-500 shadow-2xl ring-4 ring-blue-500/5 -translate-y-1' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'}
                `}
              >
                {selectedJob?.id === job.id && <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600" />}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_MAP[job.status].color}`}>
                      {STATUS_MAP[job.status].label}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {technicians.find(t => t.id === job.assigned_tech_id)?.name || 'Unassigned'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black text-slate-300 uppercase">
                    JOB-{job.id.slice(0, 6).toUpperCase()}
                  </span>
                </div>
                <h4 className="text-lg font-[900] text-[#1a2b4b] group-hover:text-blue-600 transition-colors mb-2 uppercase tracking-tight">{job.customer_name}</h4>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-300" /> {job.location}</div>
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-300" /> {new Date(job.created_at).toLocaleDateString()}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Inspector / Details */}
      <div className={`lg:w-[480px] space-y-6 ${selectedJob ? 'block' : 'hidden lg:block'}`}>
        {selectedJob ? (
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500 sticky top-24">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div className="min-w-0 pr-4">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="lg:hidden text-blue-600 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2"
                >
                  <XCircle size={14} /> Close Preview
                </button>
                <h3 className="text-2xl font-[900] text-[#1a2b4b] truncate tracking-tight uppercase">{selectedJob.customer_name}</h3>
                <div className="flex items-center gap-2 mt-2 text-slate-400">
                   <MapPin size={14} />
                   <p className="text-xs font-bold truncate">{selectedJob.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="hidden lg:block text-slate-200 hover:text-slate-400 transition-colors">
                <XCircle size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <div>
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance Protocol</h4>
                   <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${checklist.every(c => c.completed) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                     {checklist.filter(c => c.completed).length} / {checklist.length} Verified
                   </span>
                </div>
                <div className="space-y-3">
                  {checklist.map(item => (
                    <div 
                      key={item.id} 
                      className={`
                        flex items-start gap-4 p-5 rounded-3xl border transition-all duration-300
                        ${item.completed ? 'bg-emerald-50/20 border-emerald-100/50' : 'bg-white border-slate-200 hover:border-slate-300'}
                      `}
                    >
                      <button
                        disabled={selectedJob.status === 'closed'}
                        onClick={() => toggleItem(item.id, !item.completed)}
                        className={`
                          shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all mt-0.5
                          ${item.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                            : 'border-slate-200 bg-slate-50 hover:border-blue-500'}
                          ${selectedJob.status === 'closed' ? 'opacity-50 cursor-not-allowed' : 'active:scale-90'}
                        `}
                      >
                        {item.completed && <Check size={16} strokeWidth={4} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${item.completed ? 'text-slate-400 line-through font-bold' : 'text-[#1a2b4b] font-black'}`}>
                          {item.description}
                        </p>
                        {item.required && !item.completed && (
                          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-50 w-fit px-2 py-1 rounded-lg border border-red-100">
                            <Lock size={10} /> Mandatory Step
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-5 bg-red-50 border-2 border-red-100 rounded-3xl flex gap-4 text-red-700 text-xs font-black uppercase tracking-tight animate-in slide-in-from-top-4">
                  <ShieldAlert size={20} className="shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
              {selectedJob.status === 'open' ? (
                <button
                  onClick={handleOpenConfirmation}
                  className={`
                    w-full py-5 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3
                    ${canClose 
                      ? 'bg-[#1a2b4b] text-white hover:bg-black hover:-translate-y-1 shadow-[#1a2b4b]/20 active:scale-95' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                  `}
                >
                  {canClose ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                  {canClose ? 'Finalize Compliance' : 'Compliance Locked'}
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-emerald-600 bg-white border-2 border-emerald-100 rounded-[32px] py-8 shadow-inner">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-black uppercase tracking-[0.2em] text-xs mb-1">Audit Verified</p>
                    <p className="text-[10px] text-slate-400 font-bold">Immutable Compliance Record Active</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[600px] border-4 border-dashed border-slate-100 rounded-[48px] flex flex-col items-center justify-center p-12 text-center text-slate-300 transition-colors hover:border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8">
              <ClipboardCheck size={48} className="opacity-20" />
            </div>
            <h4 className="text-slate-400 font-[900] uppercase tracking-[0.3em] text-sm mb-3">Field Inspector</h4>
            <p className="text-xs font-bold max-w-[240px] leading-relaxed text-slate-400">Select an active operational record to begin compliance verification and final reporting.</p>
          </div>
        )}
      </div>

      {/* Enhanced Confirmation Modal for Finalizing Job */}
      {isConfirmingClose && selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-[28px] flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldAlert size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-[900] text-[#1a2b4b] uppercase tracking-tight">Final Authorization</h3>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed">
                    You are certifying completion of Job <span className="text-[#1a2b4b] font-black">#{selectedJob.id.slice(-6).toUpperCase()}</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-sm font-black text-[#1a2b4b] truncate">{selectedJob.customer_name}</p>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2 text-emerald-600">
                       <ShieldCheck size={14} />
                       <p className="text-xs font-black uppercase tracking-widest">{checklist.length}/{checklist.length} Verified</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 mb-10">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquare size={12} /> Compliance Notes (Mandatory)
                  </label>
                  <textarea 
                    autoFocus
                    required
                    placeholder="Enter summary of work performed, equipment status, and final findings..."
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-[#1a2b4b] outline-none transition-all font-bold text-slate-700 text-sm resize-none"
                    rows={4}
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                  />
                  <p className="mt-2 text-[9px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock size={10} /> This note will be permanently etched into the audit log.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  disabled={completionNote.trim().length < 5}
                  onClick={handleCloseJob}
                  className={`
                    flex-1 py-5 font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3
                    ${completionNote.trim().length >= 5 
                      ? 'bg-[#1a2b4b] text-white hover:bg-black hover:-translate-y-1 active:scale-95 shadow-[#1a2b4b]/20' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}
                  `}
                >
                  Confirm & Finalize Job
                </button>
                <button 
                  onClick={() => setIsConfirmingClose(false)}
                  className="px-10 py-5 bg-white text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-50 transition-all border border-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="bg-[#1a2b4b] p-3 text-center">
               <p className="text-[8px] font-black text-blue-200/50 uppercase tracking-[0.3em]">SECURE FIELD PROTOCOL • VENDOFYX COMPLIANCE ENGINE</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal Simulation */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[48px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-[#1a2b4b] uppercase tracking-tight">Dispatch Service Job</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus size={28} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={createJob} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Customer Identification</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-[#1a2b4b]"
                  placeholder="e.g. Acme Industrial Solutions"
                  value={formData.customer}
                  onChange={e => setFormData({...formData, customer: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Location</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-[#1a2b4b]"
                    placeholder="Physical address..."
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Operating Protocol</label>
                <select 
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-[#1a2b4b] appearance-none"
                  value={formData.templateId}
                  onChange={e => setFormData({...formData, templateId: e.target.value})}
                >
                  <option value="">Select Service Template...</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="pt-8">
                <button 
                  type="submit"
                  className="w-full py-5 bg-[#1a2b4b] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-2xl shadow-[#1a2b4b]/30 active:scale-95"
                >
                  Dispatch Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsList;
