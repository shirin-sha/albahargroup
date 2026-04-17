export type JobApplicationStatus = 'new' | 'reviewed' | 'shortlisted' | 'rejected';

export interface JobApplication {
  _id?: string;
  jobId: string;
  jobTitle: string;
  jobTitleAr?: string;
  applicantName: string;
  email: string;
  phone: string;
  linkedin?: string;
  message: string;
  resumePath: string;
  resumeOriginalName: string;
  status: JobApplicationStatus;
  adminNotes?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}
