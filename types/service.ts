export interface ServiceListProps {
    title: string;
}

export interface ServiceProps {
    id: number;
    section?: 'businesses' | 'capabilities';
    slug?: string;
    image?: string;
    icon?: string;
    title?: string;
    detailTitle?: string;
    description?: string;
    content?: string;
    list?: ServiceListProps[];
    created_at?: string;
}

export interface ServiceDataType {
    data: ServiceProps;
}
