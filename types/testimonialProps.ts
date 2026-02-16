export interface TestimonialProps {
    id?: number;
    name?: string;
    role?: string;
    review?: string;
    rating?: number;
    image?: string;
    created_at?: string;
    heading?: string;
    subheading?: string;
    icon?: string;
    button?: {
        label?: string;
        href?: string;
    };
}
