import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Car, ShieldAlert, Cpu } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  const isDealer = user?.role === 'dealer';

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
      <div className="space-y-8">
        {/* Header App Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-lg shadow-md shadow-orange-500/10">
            <Cpu className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">AutoTech</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Consult Manager</span>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Identity</p>
          <h3 className="text-base font-bold text-white mt-1 truncate">{user?.name}</h3>
          <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-950/40 text-orange-400 border border-orange-800/30">
            {isDealer ? '💼 Dealer Representative' : '🔧 Specialist Consultant'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-2">Main Menu</p>
          {isDealer ? (
            <>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/10'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Car className="w-5 h-5" />
                Requests Dashboard
              </button>
              <button
                onClick={() => setCurrentTab('create-job')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'create-job'
                    ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/10'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span className="text-lg leading-none">+</span>
                New Consulting Job
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentTab('queue')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'queue'
                  ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              Specialist queue
            </button>
          )}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-slate-950 hover:bg-red-950/20 border border-slate-800 hover:border-red-800/30 text-slate-400 hover:text-red-400 rounded-lg text-sm font-bold transition-all cursor-pointer"
      >
        <LogOut className="w-4.5 h-4.5" />
        Terminate Session
      </button>
    </aside>
  );
};
