import React, { useState } from 'react';
import { useJobStore } from '../store/useJobStore';
import { Car, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import type { Job } from '../store/types';

interface DealershipDashboardProps {
  onSelectJob: (job: Job) => void;
}

export const DealershipDashboard: React.FC<DealershipDashboardProps> = ({ onSelectJob }) => {
  const jobs = useJobStore((state) => state.jobs);
  const [filter, setFilter] = useState<'all' | 'pending' | 'diagnosing' | 'resolved'>('all');

  const filteredJobs = jobs.filter((job) => filter === 'all' || job.status === filter);

  // Metrics
  const totalCount = jobs.length;
  const pendingCount = jobs.filter((j) => j.status === 'pending').length;
  const activeCount = jobs.filter((j) => j.status === 'diagnosing').length;
  const resolvedCount = jobs.filter((j) => j.status === 'resolved').length;

  return (
    <div className="flex-1 p-8 overflow-y-auto max-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Dealership Dashboard</h2>
        <p className="text-slate-400 mt-1.5 font-medium">Manage consulting requests and view active logs for Sundaram Motors.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-700"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total requests</p>
          <h4 className="text-3xl font-extrabold text-white mt-2 group-hover:scale-105 transition-transform duration-200 origin-left">{totalCount}</h4>
        </div>
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Pending Specialist</p>
          <h4 className="text-3xl font-extrabold text-orange-500 mt-2 group-hover:scale-105 transition-transform duration-200 origin-left">{pendingCount}</h4>
        </div>
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Diagnosis</p>
          <h4 className="text-3xl font-extrabold text-amber-500 mt-2 group-hover:scale-105 transition-transform duration-200 origin-left">{activeCount}</h4>
        </div>
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Resolved Cases</p>
          <h4 className="text-3xl font-extrabold text-emerald-500 mt-2 group-hover:scale-105 transition-transform duration-200 origin-left">{resolvedCount}</h4>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800 mb-6">
        {(['all', 'pending', 'diagnosing', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-3.5 border-b-2 text-sm font-semibold transition-all capitalize tracking-wider cursor-pointer ${
              filter === tab
                ? 'border-orange-500 text-orange-500 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests Queue List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-12 text-center">
            <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No requests matching this filter criteria.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 rounded-xl p-6 shadow-md transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-5">
                {/* Vehicle Indicator */}
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:border-orange-500/20 group-hover:text-orange-400 transition-colors">
                  <Car className="w-6 h-6" />
                </div>
                {/* Vehicle Details */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-lg">
                      {job.vehicleMake} {job.vehicleModel} ({job.vehicleYear})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      job.priority === 'high'
                        ? 'bg-red-950 text-red-400 border border-red-800/30'
                        : job.priority === 'medium'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/30'
                        : 'bg-slate-950 text-slate-400 border border-slate-800/30'
                    }`}>
                      {job.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-xs mt-1.5 font-medium">
                    <span>VIN: <code className="text-[11px] bg-slate-950 border border-slate-850/50 px-1 py-0.5 rounded text-slate-300">{job.vehicleVin}</code></span>
                    <span>•</span>
                    <span>Plate: <code className="text-[11px] bg-slate-950 border border-slate-850/50 px-1 py-0.5 rounded text-slate-300">{job.vehiclePlate}</code></span>
                  </div>
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    {job.status === 'resolved' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-bold">Resolved</span>
                      </>
                    ) : job.status === 'diagnosing' ? (
                      <>
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 text-sm font-bold">Diagnosing</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
                        <span className="text-orange-400 text-sm font-bold">Pending Specialist</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">
                    Created {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-850/80 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-slate-700 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
