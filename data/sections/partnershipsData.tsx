import { SectionProps } from "@/types/sectionProps";
import Brand1 from '@/public/img/brand/b1.png';
import Brand2 from '@/public/img/brand/b2.png';
import Brand3 from '@/public/img/brand/b3.png';
import Brand4 from '@/public/img/brand/b4.png';
import Brand5 from '@/public/img/brand/b5.png';
import Brand6 from '@/public/img/brand/b6.png';

export const PartnershipsData: SectionProps = {
    wrapperCls: "section-padding",
    container: "container",
    subheading: "Our Partnerships",
    heading: "Trusted Global Partners",
    text: "We are proud to partner with leading global brands, bringing world-class products and services to Kuwait. Our strategic partnerships enable us to deliver excellence and innovation across diverse industries.",
    imageList: [
        {
            src: Brand1.src,
            width: 200,
            height: 120,
            alt: 'Partner Brand 1',
            loading: 'lazy'
        },
        {
            src: Brand2.src,
            width: 200,
            height: 120,
            alt: 'Partner Brand 2',
            loading: 'lazy'
        },
        {
            src: Brand3.src,
            width: 200,
            height: 120,
            alt: 'Partner Brand 3',
            loading: 'lazy'
        },
        {
            src: Brand4.src,
            width: 200,
            height: 120,
            alt: 'Partner Brand 4',
            loading: 'lazy'
        },
        {
            src: Brand5.src,
            width: 200,
            height: 120,
            alt: 'Partner Brand 5',
            loading: 'lazy'
        },
        {
            src: Brand6.src,
            width: 200,
            height: 120,
            alt: 'Partner Brand 6',
            loading: 'lazy'
        }
    ]
}


