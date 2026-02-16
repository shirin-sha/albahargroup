export interface Project {
  _id?: string;
  id?: number; // Legacy ID for backward compatibility
  slug: string;
  title: string;
  titleAr?: string; // Arabic title
  description: string;
  descriptionAr?: string; // Arabic description
  category: string;
  categoryAr?: string; // Arabic category
  client?: string;
  owner?: string;
  starting_date?: string | Date;
  ending_date?: string | Date;
  website?: string;
  content?: string;
  contentAr?: string; // Arabic content
  image: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  enabled?: boolean; // For draft/published status
}
