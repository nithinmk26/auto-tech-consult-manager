import { create } from 'zustand';
import type { Job, JobStore } from './types';

const initialJobs: Job[] = [
  {
    id: '1',
    vehicleVin: '1FTFW1ED5KFD12345',
    vehicleMake: 'Ford',
    vehicleModel: 'F-150',
    vehiclePlate: 'TN-01-AX-1234',
    vehicleYear: '2021',
    priority: 'high',
    symptoms: ['Engine Misfire', 'Rough Idle', 'Check Engine Light'],
    notes: 'Misfire code P0301 on Cylinder 1. Swapped coil packs, issue remains on Cylinder 1.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'pending',
        note: 'Consultation request submitted by Dealership.',
        author: 'Sundaram Motors (Dealer)',
      }
    ]
  },
  {
    id: '2',
    vehicleVin: 'WAUGBAFF6FD678901',
    vehicleMake: 'Audi',
    vehicleModel: 'A4',
    vehiclePlate: 'TN-02-BY-5678',
    vehicleYear: '2020',
    priority: 'medium',
    symptoms: ['Transmission Slipping', 'Lagging Shift'],
    notes: 'Intermittent slipping between 2nd and 3rd gear when engine is cold.',
    status: 'diagnosing',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    assignedConsultant: 'Karthikeyan',
    history: [
      {
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'pending',
        note: 'Consultation request submitted by Dealership.',
        author: 'Sundaram Motors (Dealer)',
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        status: 'diagnosing',
        note: 'Claimed and initiated transmission pressure line testing.',
        author: 'Karthikeyan (Consultant)',
      }
    ]
  }
];

export const useJobStore = create<JobStore>((set) => ({
  jobs: initialJobs,
  addJob: (jobData) => set((state) => {
    const newJob: Job = {
      ...jobData,
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          timestamp: new Date().toISOString(),
          status: 'pending',
          note: 'Consultation request submitted by Dealership.',
          author: 'Sundaram Motors (Dealer)',
        }
      ]
    };
    return { jobs: [newJob, ...state.jobs] };
  }),
  updateJobStatus: (id, status, note, author) => set((state) => ({
    jobs: state.jobs.map((job) => {
      if (job.id !== id) return job;
      
      const updatedHistory = [
        ...job.history,
        {
          timestamp: new Date().toISOString(),
          status,
          note,
          author,
        }
      ];

      return {
        ...job,
        status,
        updatedAt: new Date().toISOString(),
        assignedConsultant: status === 'diagnosing' ? 'Karthikeyan' : job.assignedConsultant,
        history: updatedHistory,
      };
    })
  }))
}));
