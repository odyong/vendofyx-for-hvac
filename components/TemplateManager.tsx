
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { JobTemplate, ChecklistItem, JobType } from '../types';
import { Plus, Trash2, CheckSquare, Settings2, ShieldCheck, ListChecks } from 'lucide-react';

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<JobTemplate[]>([]);
  const [selectedT, setSelectedT] = useState<JobTemplate | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  
  const [newTName, setNewTName] = useState('');
  const [newTType, setNewTType] = useState<JobType>('repair');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemReq, setNewItemReq] = useState(true);

  const loadTemplates = async () => {
    const data = await api.getTemplates();
    setTemplates(data);
  };

  useEffect(() => { loadTemplates(); }, []);

  const selectTemplate = async (t: JobTemplate) => {
    setSelectedT(t);
    const it = await api.getChecklistItems(t.id);
    setItems(it);
  };

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTName) return;
    const nt = await api.addTemplate(newTName, newTType);
    setNewTName('');
    loadTemplates();
    selectTemplate(nt);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedT || !newItemDesc) return;
    await api.addChecklistItem(selectedT.id, newItemDesc, newItemReq);
    setNewItemDesc('');
    const it = await api.getChecklistItems(selectedT.id);
    setItems(it);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Settings2 size={18} className="text-blue-600" /> Templates
          </h3>
          <div className="space-y-2 mb-6">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={`
                  w-full text-left px-4 py-3 rounded-lg border text-sm transition-all
                  ${selectedT?.id === t.id ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                `}
              >
                {t.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleAddTemplate} className="space-y-3 pt-4 border-t border-slate-100">
            <input 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Template name..."
              value={newTName}
              onChange={e => setNewTName(e.target.value)}
            />
            <select 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={newTType}
              onChange={e => setNewTType(e.target.value as JobType)}
            >
              <option value="repair">Repair</option>
              <option value="install">Installation</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <button className="w-full py-2 bg-slate-900 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
              <Plus size={16} /> Create Template
            </button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        {selectedT ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedT.name}</h3>
                <p className="text-sm text-slate-500 capitalize">{selectedT.type} Checklist</p>
              </div>
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>

            <div className="space-y-3 mb-8">
              {items.length === 0 ? (
                <div className="py-12 text-center text-slate-400 italic text-sm">No checklist items defined.</div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 group">
                    <div className="flex items-center gap-3">
                      <ListChecks size={18} className="text-slate-400" />
                      <div>
                        <span className="text-sm text-slate-700 font-medium">{item.description}</span>
                        {item.required && <span className="ml-2 text-[10px] font-bold text-red-500 uppercase">Required</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddItem} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Add Compliance Step</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Task description (e.g. Verify voltage)"
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                />
                <div className="flex items-center gap-2">
                   <label className="text-xs font-bold text-slate-600 flex items-center gap-2 cursor-pointer">
                     <input 
                        type="checkbox" 
                        checked={newItemReq} 
                        onChange={e => setNewItemReq(e.target.checked)} 
                        className="w-4 h-4 text-blue-600 rounded"
                     />
                     Required
                   </label>
                   <button 
                     type="submit"
                     className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                   >
                     Add
                   </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <CheckSquare size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Choose a template from the left to configure its rules and checklist items.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateManager;
