import React, { useState } from 'react';
import { useJobStore } from '../store/useJobStore';
import { useAuth } from '../context/AuthContext';
import type { Job } from '../store/types';
import { ArrowLeft, Car, CheckCircle2, User, FileText } from 'lucide-react';

interface JobDetailLogProps {
  jobId: string;
  onBack: () => void;
}

export const JobDetailLog: React.FC<JobDetailLogProps> = ({ jobId, onBack }) => {
  const { user } = useAuth();
  const job: Job | undefined = useJobStore((state) => state.jobs.find((j) => j.id === jobId));
  const updateJobStatus = useJobStore((state) => state.updateJobStatus);

  const [updateNote, setUpdateNote] = useState('');

  if (!job) {
    return (
      <div className="flex-1 p-8 text-center text-slate-400">
        Job not found.
        <button onClick={onBack} className="block mx-auto mt-4 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  const handleClaim = () => {
    updateJobStatus(
      job.id,
      'diagnosing',
      'Specialist claimed the request and initiated active troubleshooting.',
      user?.name || 'Consultant'
    );
  };

  const handleUpdate = (newStatus: 'diagnosing' | 'resolved') => {
    if (!updateNote.trim()) return;
    updateJobStatus(
      job.id,
      newStatus,
      updateNote,
      user?.name || 'System'
    );
    setUpdateNote('');
  };

  const isConsultant = user?.role === 'consultant';
  const isAssignedToMe = job.assignedConsultant === 'Karthikeyan';

  return (
    <div className="flex-1 p-8 overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Case ID: {job.id}</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {job.vehicleMake} {job.vehicleModel}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column: Spec Sheet Card & Diagnosis Actions */}
        <div className="col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-6 shadow-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Car className="w-5 h-5 text-orange-500" />
              Vehicle Spec Sheet
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">VIN</span>
                <p className="text-white font-mono text-sm mt-0.5 tracking-wider">{job.vehicleVin}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Plate Number</span>
                <p className="text-white font-bold text-sm mt-0.5">{job.vehiclePlate}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Model Year</span>
                <p className="text-white font-bold text-sm mt-0.5">{job.vehicleYear}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Severity</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                  job.priority === 'high'
                    ? 'bg-red-950 text-red-400 border border-red-800/30'
                    : 'bg-amber-950 text-amber-400 border border-amber-800/30'
                }`}>
                  {job.priority} Priority
                </span>
              </div>
              {job.assignedConsultant && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Assigned Consultant</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-6 h-6 rounded-full bg-orange-950 border border-orange-800/30 flex items-center justify-center text-[10px] text-orange-400 font-bold">
                      K
                    </div>
                    <span className="text-slate-300 text-sm font-semibold">{job.assignedConsultant}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis Checklist */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-6 shadow-md space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Identified Fault Checklist
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.symptoms.map((s) => (
                <span key={s} className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs font-semibold text-orange-400">
                  {s}
                </span>
              ))}
            </div>
            {job.notes && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Dealership Notes</span>
                <p className="text-slate-400 text-sm mt-1 whitespace-pre-wrap leading-relaxed">{job.notes}</p>
              </div>
            )}
          </div>

          {/* Specialists Actions Panel */}
          {isConsultant && (
            <div className="bg-slate-900 border border-orange-500/20 rounded-xl p-6 shadow-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                🔧 Specialist Control Panel
              </h3>

              {job.status === 'pending' && (
                <button
                  onClick={handleClaim}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all cursor-pointer"
                >
                  Claim Consultation Request
                </button>
              )}

              {job.status === 'diagnosing' && isAssignedToMe && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                      Record Diagnostics Update
                    </label>
                    <textarea
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                      placeholder="Add repair details, test result findings, or resolution summary..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate('diagnosing')}
                      disabled={!updateNote.trim()}
                      className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 disabled:opacity-40 text-slate-300 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Log Progress
                    </button>
                    <button
                      onClick={() => handleUpdate('resolved')}
                      disabled={!updateNote.trim()}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Resolve Case
                    </button>
                  </div>
                </div>
              )}

              {job.status === 'resolved' && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-xl text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-400 font-bold text-sm">Consultation Resolved</p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold mt-1">No pending actions required</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Columns: Unified Activity History Log */}
        <div className="col-span-2 bg-slate-900 border border-slate-800/80 rounded-xl p-6 shadow-md space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-orange-500" />
            Unified Activity Timeline & Log
          </h3>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {job.history.map((log, index) => (
              <div key={index} className="relative group">
                {/* Timeline node icon */}
                <div className={`absolute -left-7 top-1.5 w-3 h-3 rounded-full border-2 bg-slate-950 transition-colors ${
                  log.status === 'resolved'
                    ? 'border-emerald-500 group-hover:bg-emerald-500'
                    : log.status === 'diagnosing'
                    ? 'border-amber-500 group-hover:bg-amber-500'
                    : 'border-orange-500 group-hover:bg-orange-500'
                }`}></div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      log.status === 'resolved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/30'
                        : log.status === 'diagnosing'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/30'
                        : 'bg-orange-950 text-orange-400 border border-orange-800/30'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-200 text-sm mt-2 font-medium leading-relaxed">
                    {log.note}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-2.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Logged by: {log.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
