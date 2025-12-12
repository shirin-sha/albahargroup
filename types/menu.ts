export interface MenuItem {
    title: string;
    path: string;
    dropdown?: MenuItem[];
    text?: string; 
    showbutton?: boolean; 
    altText?: string; 
    imageUrl?: string | null; 
    imageUrlMobile?: string | null;
    icon?: any;
    megamenu?: {
        heading: string;
        path: string;
        dropdown?: MenuItem[];
    }[];
    megamenutwocolumn?: {
        title: string;
        path: string;
        dropdown?: MenuItem[];
    }[];
    bottommenu?: MenuItem[];
}

export interface MenuType {
    title: string;
    path: string;
    dropdown?: boolean;
    text?: string; 
    showbutton?: boolean; 
    altText?: string; 
    imageUrl?: string | null; 
    imageUrlMobile?: string | null;
    icon?: any;
}
