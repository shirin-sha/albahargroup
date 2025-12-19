import { SectionProps } from "@/types/sectionProps";
import Image1 from "@/public/img/project/1.jpg";
import Image2 from "@/public/img/project/2.jpg";
import Image3 from "@/public/img/project/3.jpg";

export const StickyBannerData: SectionProps = {
    wrapperCls: "mt-100",
    container: "container",
    heading: "What Guides Us and Drives Our Future",
    text: "Guided by a clear vision, driven by a shared mission and anchored in strong values, we partner with stakeholders to create sustainable, long-term success.",
    blockList: [
        {
            subheading: "Vision",
            heading: "Our long-term direction and aspiration.",
            text: "To Always be the Most Trusted and Best-in-Class Partner.",
            image: {
                src: Image1.src,
                width: 1000,
                height: 707,
                loading: "lazy",
                alt: "Vision",
            },
        },
        {
            subheading: "Mission",
            heading: "How we create value every day.",
            text: "Delivering excellence and success by directing our values, talents, resources and expertise to maximize customer satisfaction and to achieve sustainable growth for all stakeholders.",
            image: {
                src: Image2.src,
                width: 1000,
                height: 707,
                loading: "lazy",
                alt: "Mission",
            },
        },
        {
            subheading: "Values",
            heading: "Principles that guide our behaviour and decisions.",
            text: "<ul style='list-style-type: disc; padding-left: 20px;'><li>We deliver on our commitments.</li><li>We view our people as the source of our strength.</li><li>We work together as a team.</li><li>We listen, we care, we respect.</li><li>We seek continual self and work improvement.</li></ul>",
            image: {
                src: Image3.src,
                width: 1000,
                height: 707,
                loading: "lazy",
                alt: "Values",
            },
        }
    ]
}
