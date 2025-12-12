import { SectionProps } from "@/types/sectionProps";
import Icons from "@/components/Icons";

export const BusinessVerticalsData: SectionProps = {
    wrapperCls: "mt-100 section-padding",
    container: "container",
    // subheading: "WHAT WE DO",
    heading: "OUR BUSINESS VERTICALS",
    blockList: [
        {
            heading: "Technology Solutions",
            text: "Al Bahar's Technology division delivers integrated office, print, imaging and IT solutions that help organisations work smarter and more securely. From hardware and software to after-sales support, we provide end-to-end services backed by global technology partners.",
            icon: <Icons.Development />,
            image: {
                src: "/img/service/s1.jpg",
                width: 1200,
                height: 800,
                alt: "Technology Solutions",
                loading: "lazy"
            },
            button: {
                label: "Learn more",
                href: "/services/technology",
                type: "primary"
            }
        },
        {
            heading: "Consumer & FMCG",
            text: "Our Consumer division represents trusted international food and household brands across Kuwait. We combine strong channel coverage, disciplined in-store execution and data-driven planning to ensure our brands are always visible, available and in demand.",
            icon: <Icons.Clients />,
            image: {
                src: "/img/service/s2.jpg",
                width: 1200,
                height: 800,
                alt: "Consumer & FMCG",
                loading: "lazy"
            },
            button: {
                label: "Learn more",
                href: "/services/consumer",
                type: "primary"
            }
        },
        {
            heading: "Shipping & Logistics",
            text: "The Shipping & Logistics division connects Kuwait to major global ports and trade lanes. Acting as a reliable partner for shipping lines and cargo owners, we provide agency services, documentation, and logistics support that keep goods moving efficiently and on time.",
            icon: <Icons.Launch />,
            image: {
                src: "/img/service/s3.jpg",
                width: 1200,
                height: 800,
                alt: "Shipping & Logistics",
                loading: "lazy"
            },
            button: {
                label: "Learn more",
                href: "/services/shipping",
                type: "primary"
            }
        },
        {
            heading: "Travel & Tourism",
            text: "Our Travel division serves both corporate and leisure customers with tailored travel solutions. From ticketing and itineraries to group and incentive travel, we combine global networks with attentive local service to deliver smooth, stress-free journeys.",
            icon: <Icons.Plan />,
            image: {
                src: "/img/service/s4.jpg",
                width: 1200,
                height: 800,
                alt: "Travel & Tourism",
                loading: "lazy"
            },
            button: {
                label: "Learn more",
                href: "/services/travel",
                type: "primary"
            }
        },
        {
            heading: "Retail & Lifestyle",
            text: "The Retail & Lifestyle division develops and operates modern retail concepts that bring global trends closer to Kuwait's consumers. With a focus on quality, convenience and experience, we curate brands and formats that fit the evolving lifestyles of our customers.",
            icon: <Icons.Winning />,
            image: {
                src: "/img/service/s1.jpg",
                width: 1200,
                height: 800,
                alt: "Retail & Lifestyle",
                loading: "lazy"
            },
            button: {
                label: "Learn more",
                href: "/services/retail",
                type: "primary"
            }
        },
    ],
}
