import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { DealershipDashboard } from './screens/DealershipDashboard';
import { CreateJobWizard } from './screens/CreateJobWizard';
import { ConsultantQueue } from './screens/ConsultantQueue';
import { JobDetailLog } from './screens/JobDetailLog';
import type { Job } from './store/types';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(user?.role === 'dealer' ? 'dashboard' : 'queue');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const handleSelectJob = (job: Job) => {
    setSelectedJobId(job.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex select-none">
      <Sidebar currentTab={currentTab} setCurrentTab={(tab) => {
        setCurrentTab(tab);
        setSelectedJobId(null);
      }} />

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
