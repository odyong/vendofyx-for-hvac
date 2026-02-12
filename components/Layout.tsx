
import React from 'react';
import { User } from '../types';
import { NAV_ITEMS } from '../constants';
import { LogOut, Menu } from 'lucide-react';

// Stylized VF Shield Logo - SVG Data URI fixed for linearGradient typo
const LOGO_DATA_URI = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTAgNDUwQzI1MCA0NTAgMTAwIDQwMCAxMDAgMjAwVjYwTDI1MCAyMEw0MDAgNjBWMjAwQzQwMCA0MDAgMjUwIDQ1MCAyNTAgNDUwWiIgZmlsbD0iIzFBMkI0QiIvPgo8cGF0aCBkPSJNMjUwIDQzMEMyNTAgNDMwIDExNSA0MDAgMTE1IDIwMFY3MEwyNTAgMzVMMzg1IDcwVjIwMEMzODUgNDAwIDI1MCA0MzAgMjUwIDQzMFoiIGZpbGw9InVybCgjZ3JhZDEpIi8+CjxwYXRoIGQ9Ik0xODAgMTAwTDI1MCAyODBMMzIwIDEwMEgzNTBMMjUwIDM1MEwxNTAgMTAwSDE4MFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNjAgMTUwSDM0MFYxODBIMjYwVjIzMEgzMzBWMjYwSDI2MFYzMjBIMjMwVjE1MEgyNjBaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjI1MCIgeTE9IjIwIiB4Mj0iMjUwIiB5Mj0iNDUwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMzQjgyRjYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMUEyQjRCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+`;

interface LayoutProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, activeTab, setActiveTab, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transition-transform duration-300
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <img 
              src={LOGO_DATA_URI} 
              alt="Vendofyx Shield" 
              className="w-10 h-10 object-contain drop-shadow-sm animate-logo-shine" 
            />
            <h1 className="text-2xl font-[900] text-[#1a2b4b] tracking-tighter">Vendofyx</h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {filteredNav.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                    ${activeTab === item.id 
                      ? 'bg-blue-50 text-blue-600 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <Icon size={20} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#1a2b4b] flex items-center justify-center text-white font-black uppercase text-xs shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-[#1a2b4b] truncate">{user.name}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-bold">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <button 
            className="md:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-md"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-[#1a2b4b] uppercase tracking-tight">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3">
             <span className="hidden sm:inline text-[10px] font-black px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-widest">
               Enterprise Secure
             </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
