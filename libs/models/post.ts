export interface Post {
  _id?: string;
  id?: number; // Legacy ID for backward compatibility
  authorId: number;
  slug: string;
  title: string;
  titleAr?: string; // Arabic title
  category: string;
  categoryAr?: string; // Arabic category
  content: string;
  contentAr?: string; // Arabic content
  excerpt: string;
  excerptAr?: string; // Arabic excerpt
  image: string;
  video?: string | null;
  tags: string[];
  created_at: string | Date;
  updated_at?: string | Date;
  comments?: number;
  enabled?: boolean; // For draft/published status
}
