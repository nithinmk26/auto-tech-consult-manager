export interface Job {
  id: string;
  vehicleVin: string;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleYear: string;
  priority: 'low' | 'medium' | 'high';
  symptoms: string[];
  notes?: string;
  status: 'pending' | 'diagnosing' | 'resolved';
  createdAt: string;
  updatedAt: string;
  assignedConsultant?: string;
  history: {
    timestamp: string;
    status: 'pending' | 'diagnosing' | 'resolved';
    note: string;
    author: string;
  }[];
}

export interface JobStore {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'history'>) => void;
  updateJobStatus: (id: string, status: Job['status'], note: string, author: string) => void;
}
