import { SectionProps } from "@/types/sectionProps";
import { FaqAccordion } from "@/data/faqAccordion";

export const Faq2Data: SectionProps = {
    wrapperCls: "mt-100 mb-100",
    container: "container",
    subheading: "Questions",
    heading: "Have any questions? here some answers.",
    text: "In relation to websites and apps, UI design considers the look, interactivity of the making product. It's all about making sure that the user interface.",
    button: {
        label: "Ask Your Question",
        href: "/faq",
        type: "primary"
    },
    items: FaqAccordion.slice(0, 5) // Default FAQ items as fallback
}
