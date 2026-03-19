export interface Service {
  _id?: string;
  id?: number;
  section?: 'businesses' | 'capabilities';
  slug: string;
  title: string;
  detailTitle?: string;
  icon?: string;
  image: string;
  description?: string;
  content?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  enabled?: boolean;
}

