export interface MenuItem {
    title: string;
    /**
     * Optional Arabic title for multilingual menus.
     * When language is 'ar', the UI can prefer this over `title`.
     */
    titleAr?: string;
    path: string;
    dropdown?: MenuItem[];
    /**
     * Optional description text (e.g. for mega menu items).
     */
    text?: string;
    /**
     * Optional Arabic version of `text`.
     */
    textAr?: string;
    showbutton?: boolean; 
    altText?: string; 
    imageUrl?: string | null; 
    imageUrlMobile?: string | null;
    icon?: any;
    megamenu?: {
        heading: string;
        /**
         * Optional Arabic heading for mega menu sections.
         */
        headingAr?: string;
        path: string;
        dropdown?: MenuItem[];
    }[];
    megamenutwocolumn?: {
        title: string;
        /**
         * Optional Arabic title for two-column mega menu sections.
         */
        titleAr?: string;
        path: string;
        dropdown?: MenuItem[];
    }[];
    bottommenu?: MenuItem[];
}

export interface MenuType {
    title: string;
    titleAr?: string;
    path: string;
    dropdown?: boolean;
    text?: string; 
    showbutton?: boolean; 
    altText?: string; 
    imageUrl?: string | null; 
    imageUrlMobile?: string | null;
    icon?: any;
}
