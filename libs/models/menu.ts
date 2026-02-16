export interface Menu {
  _id?: string;
  title: string;
  titleAr?: string;
  path: string;
  order: number;
  enabled?: boolean;
  dropdown?: Menu[];
  text?: string;
  imageUrl?: string | null;
  imageUrlMobile?: string | null;
  showbutton?: boolean;
  megamenu?: any[];
  megamenutwocolumn?: any[];
  bottommenu?: Menu[];
  created_at?: string | Date;
  updated_at?: string | Date;
}
