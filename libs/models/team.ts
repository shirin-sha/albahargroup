export interface Team {
  _id?: string;
  id?: number; // Legacy ID for backward compatibility
  slug: string;
  name: string;
  nameAr?: string; // Arabic name
  designation: string;
  designationAr?: string; // Arabic designation
  image: string;
  social?: {
    facebook?: string;
    facebook_url?: string;
    twitter?: string;
    twitter_url?: string;
    instagram?: string;
    instagram_url?: string;
    linkedin?: string;
    linkedin_url?: string;
  };
  year_of_expertise?: string;
  expertise?: string;
  expertiseAr?: string; // Arabic expertise
  phone?: string;
  email?: string;
  biography?: string;
  biographyAr?: string; // Arabic biography
  about?: string;
  aboutAr?: string; // Arabic about
  about_skills?: string;
  about_skillsAr?: string; // Arabic about_skills
  skills?: {
    project_management?: number;
    client_relationship?: number;
    soft_skill?: number;
  };
  created_at?: string | Date;
  updated_at?: string | Date;
  enabled?: boolean; // For draft/published status
}
