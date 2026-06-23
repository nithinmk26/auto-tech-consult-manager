import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { DealershipDashboard } from './screens/DealershipDashboard';
import { CreateJobWizard } from './screens/CreateJobWizard';
import { ConsultantQueue } from './screens/ConsultantQueue';
import { JobDetailLog } from './screens/JobDetailLog';
import { Menu, Cpu } from 'lucide-react';
import type { Job } from './store/types';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(user?.role === 'dealer' ? 'dashboard' : 'queue');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectJob = (job: Job) => {
    setSelectedJobId(job.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row select-none">
      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-45 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-md">
            <Cpu className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">AutoTech</h1>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Consult Manager</span>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-45 md:hidden transition-opacity"
        />
      )}

      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedJobId(null);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-y-auto max-h-screen md:max-h-none">
        {selectedJobId ? (
          <JobDetailLog jobId={selectedJobId} onBack={() => setSelectedJobId(null)} />
        ) : currentTab === 'dashboard' ? (
          <DealershipDashboard onSelectJob={handleSelectJob} />
        ) : currentTab === 'create-job' ? (
          <CreateJobWizard onCancel={() => setCurrentTab('dashboard')} />
        ) : currentTab === 'queue' ? (
          <ConsultantQueue onSelectJob={handleSelectJob} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-450">
            Unknown Route
          </div>
        )}
      </div>
    </div>
  );
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();
  return user ? <MainLayout /> : <LoginScreen />;
};

const App: React.FC = () => {
  return (
    <AppContent />
  );
};

export default App;
