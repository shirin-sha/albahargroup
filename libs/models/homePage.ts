export interface HomePageSection {
  _id?: string;
  sectionId: string; // e.g., 'hero', 'imageText', 'services', etc.
  enabled: boolean;
  order: number;
  en: {
    [key: string]: any; // Section-specific content in English
  };
  ar: {
    [key: string]: any; // Section-specific content in Arabic
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const HOME_PAGE_SECTIONS = [
  'hero',
  'imageText',
  'services',
  'projects',
  'whyChooseUs',
  'pricing',
  'testimonials',
  'faq',
  'blog',
] as const;

export type HomePageSectionId = typeof HOME_PAGE_SECTIONS[number];
