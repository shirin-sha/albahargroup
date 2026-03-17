export interface Category {
  _id?: string;
  id?: number; // Legacy ID for backward compatibility
  name: string;
  nameAr?: string; // Arabic name
  slug: string;
  description?: string;
  descriptionAr?: string; // Arabic description
  created_at: string | Date;
  updated_at?: string | Date;
  enabled?: boolean;
}
