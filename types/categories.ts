export type SidebarCategoryItem = string | { label: string; slug: string };

export interface CategoriesType {
    title?: string;
    categories: SidebarCategoryItem[];
    rootUrl: string;
    currentSlug?: string;
}