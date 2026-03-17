export interface Job {
  _id?: string;
  id?: number; // Legacy/optional ID
  title: string;
  titleAr?: string;
  department: string;
  departmentAr?: string;
  location: string;
  locationAr?: string;
  type: string; // Full-time, Part-time, Contract, etc.
  description: string;
  descriptionAr?: string;
  requirements: string[];
  requirementsAr?: string[];
  postedDate: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  enabled?: boolean; // For draft/published status
}

