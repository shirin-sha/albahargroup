import { SectionProps } from "@/types/sectionProps";
import Icons from "@/components/Icons";
import Image1 from '@/public/img/image-text/img2.png';
import Image2 from '@/public/img/image-text/img-small.png';

export const ImageText2Data: SectionProps = {
    wrapperCls: "mt-100",
    container: "container",
    subheading: "Al Bahar Group",
    heading: "Redefining Partnership for a New Era of Growth",
    text: "Founded in 1937 by Mr. Mohamed Abdulrahman Al-Bahar, our group has grown from a pioneering trading house into a diversified business leader. Grounded in our Kuwaiti heritage and guided by a long-term view, we collaborate with market-leading brands to deliver relevant, high-quality products and services that improve everyday life.",
    textList: [
        {
            icon: <Icons.Ambition />,
            title: "Our ambition",
            text: "To be the partner of choice for global brands seeking sustainable growth in Kuwait, combining local market expertise with international standards of excellence."
        },
        {
            icon: <Icons.Purpose />,
            title: "Our purpose",
            text: "To enable progress for customers, partners, and communities by delivering reliable solutions, building long-term relationships, and investing in people and innovation."
        }
    ],
    button: {
        label: "More About Us",
        href: "/about-us",
        type: "primary"
    },
    imageList: [
        {
            src: Image1.src,
            width: 992,
            height: 863,
            alt: 'Image',
            loading: 'lazy'
        },
        {
            src: Image2.src,
            width: 195,
            height: 202,
            alt: 'Image',
            loading: 'lazy'
        }
    ]
}
