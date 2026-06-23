import React from 'react';
import { useJobStore } from '../store/useJobStore';
import { Clock, ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { Job } from '../store/types';

interface ConsultantQueueProps {
  onSelectJob: (job: Job) => void;
}

export const ConsultantQueue: React.FC<ConsultantQueueProps> = ({ onSelectJob }) => {
  const jobs = useJobStore((state) => state.jobs);

  // Split into queue states
  const pendingJobs = jobs.filter((j) => j.status === 'pending');
  const activeJobs = jobs.filter((j) => j.status === 'diagnosing' && j.assignedConsultant === 'Karthikeyan');
  const resolvedJobs = jobs.filter((j) => j.status === 'resolved');

  return (
    <div className="flex-1 p-8 overflow-y-auto max-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Specialist Consultant Queue</h2>
        <p className="text-slate-400 mt-1.5 font-medium">Claim incoming diagnostics requests and record resolution updates.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column: Claim Incoming Jobs */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              Incoming Requests ({pendingJobs.length})
            </h3>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Unassigned requests waiting for claim</p>
          </div>

          <div className="space-y-4">
            {pendingJobs.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 font-semibold text-sm">
                No unassigned requests in queue.
              </div>
            ) : (
              pendingJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 shadow-md flex items-center justify-between cursor-pointer group transition-all"
                >
                  <div className="space-y-2 truncate flex-1 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-extrabold truncate">{job.vehicleMake} {job.vehicleModel}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        job.priority === 'high' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {job.priority}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {job.symptoms.slice(0, 2).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-[10px] font-semibold text-orange-400">
                          {s}
                        </span>
                      ))}
                      {job.symptoms.length > 2 && (
                        <span className="text-[10px] text-slate-500 font-semibold">+{job.symptoms.length - 2} more</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Diagnosis */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-amber-500" />
              Active Cases ({activeJobs.length})
            </h3>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Currently assigned to you (Karthikeyan)</p>
          </div>

          <div className="space-y-4">
            {activeJobs.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 font-semibold text-sm">
                No active jobs currently claimed by you.
              </div>
            ) : (
              activeJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-slate-900 hover:bg-slate-850 border border-amber-800/40 hover:border-amber-700/60 rounded-xl p-5 shadow-md flex items-center justify-between cursor-pointer group transition-all"
                >
                  <div className="space-y-2 truncate flex-1 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-extrabold truncate">{job.vehicleMake} {job.vehicleModel}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-950 text-amber-400">
                        diagnosing
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {job.symptoms.slice(0, 2).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-[10px] font-semibold text-amber-400">
                          {s}
                        </span>
                      ))}
                      {job.symptoms.length > 2 && (
                        <span className="text-[10px] text-slate-500 font-semibold">+{job.symptoms.length - 2} more</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                </div>
              ))
            )}
          </div>

          {/* Recently Resolved List */}
          {resolvedJobs.length > 0 && (
            <div className="pt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recently Resolved Cases</h4>
              <div className="space-y-3">
                {resolvedJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-300 font-semibold text-sm">{job.vehicleMake} {job.vehicleModel}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider font-mono">ID: {job.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
