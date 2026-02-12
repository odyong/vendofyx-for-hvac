
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Part, Vendor } from '../types';
import { Package, Truck, Plus, Trash2, Edit2, Search, Filter, Info } from 'lucide-react';

const InventoryManager: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'parts' | 'vendors'>('parts');
  
  // Form States
  const [isAddingPart, setIsAddingPart] = useState(false);
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [partFormData, setPartFormData] = useState({ name: '', quantity: 0, vendorId: '' });
  const [vendorFormData, setVendorFormData] = useState({ name: '', contact: '' });

  const loadData = async () => {
    const [p, v] = await Promise.all([api.getParts(), api.getVendors()]);
    setParts(p);
    setVendors(v);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partFormData.name || !partFormData.vendorId) return;
    await api.addPart(partFormData.name, partFormData.quantity, partFormData.vendorId);
    setPartFormData({ name: '', quantity: 0, vendorId: '' });
    setIsAddingPart(false);
    loadData();
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorFormData.name) return;
    await api.addVendor(vendorFormData.name, vendorFormData.contact);
    setVendorFormData({ name: '', contact: '' });
    setIsAddingVendor(false);
    loadData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('parts')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all ${activeSubTab === 'parts' ? 'bg-white text-[#1a2b4b] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Package size={16} /> Parts Catalog
          </button>
          <button 
            onClick={() => setActiveSubTab('vendors')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all ${activeSubTab === 'vendors' ? 'bg-white text-[#1a2b4b] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Truck size={16} /> Approved Vendors
          </button>
        </div>
        
        <button 
          onClick={() => activeSubTab === 'parts' ? setIsAddingPart(true) : setIsAddingVendor(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1a2b4b] text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> Add {activeSubTab === 'parts' ? 'New Part' : 'Vendor'}
        </button>
      </div>

      {activeSubTab === 'parts' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100 text-left">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Part Identification</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory Level</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Vendor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">No parts cataloged.</td>
                </tr>
              ) : (
                parts.map(part => (
                  <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-[#1a2b4b]">{part.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">SKU: {part.id.toUpperCase()}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${part.quantity < 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {part.quantity} Units
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">
                      {vendors.find(v => v.id === part.vendor_id)?.name || 'Unknown Vendor'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map(vendor => (
            <div key={vendor.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
              <h4 className="text-lg font-black text-[#1a2b4b] mb-1">{vendor.name}</h4>
              <div className="flex items-start gap-2 text-slate-500">
                <Info size={14} className="mt-0.5 shrink-0" />
                <p className="text-xs font-bold leading-relaxed">{vendor.contact}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {parts.filter(p => p.vendor_id === vendor.id).length} Active Parts
                </span>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Catalog</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Part Modal */}
      {isAddingPart && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-[#1a2b4b] uppercase tracking-tight">Catalog New Part</h3>
              <button onClick={() => setIsAddingPart(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddPart} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Part Name</label>
                <input 
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="e.g. Copper Tubing 3/8"
                  value={partFormData.name}
                  onChange={e => setPartFormData({...partFormData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Initial Quantity</label>
                <input 
                  type="number"
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                  value={partFormData.quantity}
                  onChange={e => setPartFormData({...partFormData, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Associate Vendor</label>
                <select 
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 appearance-none"
                  value={partFormData.vendorId}
                  onChange={e => setPartFormData({...partFormData, vendorId: e.target.value})}
                >
                  <option value="">Select Primary Vendor...</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                  Update Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {isAddingVendor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-[#1a2b4b] uppercase tracking-tight">Onboard Vendor</h3>
              <button onClick={() => setIsAddingVendor(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddVendor} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                <input 
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="e.g. Lennox Commercial"
                  value={vendorFormData.name}
                  onChange={e => setVendorFormData({...vendorFormData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Details</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 resize-none"
                  placeholder="Email, Phone, Representative name..."
                  value={vendorFormData.contact}
                  onChange={e => setVendorFormData({...vendorFormData, contact: e.target.value})}
                />
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-[#1a2b4b] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95">
                  Confirm Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
