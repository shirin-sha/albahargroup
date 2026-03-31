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
  /** Legacy single image field (used as fallback). */
  image: string;
  /** Image used on home/listing cards (optional; falls back to `image`). */
  homeImage?: string;
  /** Image used on detail page (optional; falls back to `image`). */
  detailImage?: string;
  description?: string;
  descriptionAr?: string;
  content?: string;
  contentAr?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  enabled?: boolean;
}

