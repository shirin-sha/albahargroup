import { SectionProps } from "@/types/sectionProps";
import Image1 from '@/public/img/image-text/img1.png';

export const ImageTextData: SectionProps = {
    wrapperCls: "mt-100",
    container: "container",
    subheading: "Our Story",
    heading: "Al-Bahar Group was founded in 1937 by Mr. Mohamed Abdulrahman Al-Bahar",
    text: "Al-Bahar as a general trading company. Over the decades, we've grown to become a leading force in regional markets across a variety of industries. Our diverse portfolio spans everything from consumer goods, home appliances, cutting-edge electronics, shipping, office technology, IT solutions, and beyond. Partnering with global titans like Unilever, Canon, and GE appliances, we bring Kuwait's shoppers the latest in innovation and best practices. Our ethos thrives on collaboration, fostering enduring relationships that benefit both brands and customers alike. More than just commerce, we're committed to community. Through our foundations and corporate social initiatives, we're dedicated to giving back, enriching the lives of those we serve. Join us as we continue our proud tradition of excellence and impact.",
    image: {
        src: Image1.src,
        width: 992,
        height: 863,
        alt: 'Al-Bahar Group',
        loading: 'lazy'
    }
}
