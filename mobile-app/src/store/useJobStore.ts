import { create } from 'zustand';

export type JobState = 'Created' | 'In Progress' | 'Resolution Provided' | 'Resolution Applied' | 'Closed';

export interface Job {
  id: string;
  make: string;
  model: string;
  year: string;
  issue: string;
  status: JobState;
  consultantId: string | null;
  createdAt: string;
}

interface JobStore {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'status' | 'consultantId' | 'createdAt'>) => void;
  updateJobStatus: (id: string, status: JobState, consultantId?: string) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [
    {
      id: 'JOB-1001',
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: '2021',
      issue: 'Transmission harsh shift from 2nd to 3rd gear.',
      status: 'Created',
      consultantId: null,
      createdAt: new Date().toISOString(),
    },
  ],
  addJob: (jobData) => set((state) => ({
    jobs: [
      ...state.jobs,
      {
        ...jobData,
        id: `JOB-${1000 + state.jobs.length + 1}`,
        status: 'Created',
        consultantId: null,
        createdAt: new Date().toISOString(),
      }
    ]
  })),
  updateJobStatus: (id, status, consultantId) => set((state) => ({
    jobs: state.jobs.map((job) => 
      job.id === id 
        ? { ...job, status, ...(consultantId !== undefined && { consultantId }) } 
        : job
    )
  })),
}));
