export interface Service {
  _id?: string;
  id?: number;
  section?: 'businesses' | 'capabilities';
  slug: string;
  title: string;
  /** Arabic title (optional; falls back to `title` on the site when empty) */
  titleAr?: string;
  detailTitle?: string;
  detailTitleAr?: string;
  icon?: string;
  image: string;
  description?: string;
  descriptionAr?: string;
  content?: string;
  contentAr?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  enabled?: boolean;
}

