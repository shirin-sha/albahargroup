import { SectionProps } from "@/types/sectionProps";
import WhyChooseUsImage from "@/public/img/why-choose-us/1.jpg";
import PromoImage from "@/public/img/why-choose-us/2.jpg";
import Icons from "@/components/Icons";

export const WhyChooseUsGridData: SectionProps = {
    wrapperCls: "mt-100 section-padding",
    container: "container",
    image: {
        src: WhyChooseUsImage.src,
        srcMobile: WhyChooseUsImage.src,
        width: 1000,
        height: 742,
        loading: "lazy",
        alt: "Choose us image"
    },
    subheading: "Why Al Bahar Group",
    heading: "A Heritage of Trust, A Future of Possibilities",
    text: "As one of Kuwait's long-established business groups, we combine decades of experience with a constant focus on what comes next. Our success is built on strong values, disciplined execution and partnerships that stand the test of time.",
    button: {
        label: "More About Us",
        href: "/about-us",
        type: "primary"
    },
    rotatingLogo: {
        logo: <Icons.ChooseRotatingLogo />,
        text: "25",
    },
    /* Icons for these rows are static in WhyChooseUsGrid; copy is dev/AR fallback until CMS is filled. */
    items: [
        {
            title: "Our Mission",
            text: "Delivering excellence and success by directing our values, talents, resources and expertise to maximize customer satisfaction and to achieve sustainable growth for all stakeholders.",
        },
        {
            title: "Our Vision",
            text: "To Always be the Most Trusted and Best-in-Class Partner.",
        },
        {
            title: "Our Values",
            text: "• We always deliver on our commitments\n• We consider our people to be our strength\n• We are one team\n• We listen, we care, we respect\n• We constantly work towards improvement",
        },
    ],
    promoImage: {
        src: PromoImage.src,
        width: 800,
        height: 834,
        loading: "lazy",
        alt: "Choose us image"
    },
}