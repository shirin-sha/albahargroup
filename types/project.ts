export interface ProjectType {
    slug?: string;
    title?: string;
    description?: string;
    /** When set, the whole card links here (e.g. service detail URL). */
    href?: string;
    category?: string;
    client?: string;
    owner?: string;
    starting_date?: string;
    ending_date?: string;
    created_at?: string;
    website?: string;
    content?: string;
    image?: string;
}

export interface ProjectDataType {
    data: ProjectType;
}

