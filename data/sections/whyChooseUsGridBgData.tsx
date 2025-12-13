import { SectionProps } from "@/types/sectionProps";
import WhyChooseUsBg from "@/public/img/why-choose-us/bg.jpg";
import Icons from "@/components/Icons";

export const WhyChooseUsGridBgData: SectionProps = {
    wrapperCls: "!bg-transparent mt-100 section-padding",
    container: "container",
    backgroundImage: {
        src: WhyChooseUsBg.src,
        width: 1920,
        height: 887,
        loading: "lazy",
        alt: "Background image"
    },
    subheading: "Why Choose Us",
    heading: "OUR Vision, Mission & Values",
    text: "",
    rotatingLogo: {
        logo: <Icons.ChooseRotatingLogo />,
        text: "0605",
    },
    promotions: [
        {
            icon: <Icons.Vision />,
            title: "VISION",
            text: "To Always be the Most Trusted and Best-in-Class Partner.",
        },
        {
            icon: <Icons.Mission />,
            title: "MISSION",
            text: "Delivering excellence and success by directing our values, talents, resources and expertise to maximize customer satisfaction and to achieve sustainable growth for all stakeholders.",
        },
        {
            icon: <Icons.Values />,
            title: "VALUES",
            text: "• We deliver on our commitments.\n• We view our people as the source of our strength.\n• We work together as a team.\n• We listen, we care, we respect.\n• We seek continual self and work improvement.",
        },
    ],
}