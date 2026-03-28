export interface ServiceListProps {
    title: string;
}

export interface ServiceProps {
    /** Mongo `_id` is often passed as string */
    id?: number | string;
    section?: 'businesses' | 'capabilities';
    slug?: string;
    image?: string;
    icon?: string;
    title?: string;
    titleAr?: string;
    detailTitle?: string;
    detailTitleAr?: string;
    description?: string;
    descriptionAr?: string;
    content?: string;
    contentAr?: string;
    list?: ServiceListProps[];
    created_at?: string | Date;
}

export interface ServiceDataType {
    data: ServiceProps;
}
