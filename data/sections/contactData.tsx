import { SectionProps } from "@/types/sectionProps";
import Icons from "@/components/Icons";

export const ContactData: SectionProps = {
    wrapperCls: "section-padding",
    container: "container",
    subheading: "Contact Us",
    heading: "Contact Us",
    text: "If you would like to know more about Mohamed Abdulrahman Al-Bahar Group or have any inquiries, kindly reach out to us.",
    promotions: [
        {
            icon: <Icons.Location />,
            title: "Address",
            text: "The experienced management team includes seasoned veterans with expertise in consumer goods, automotive, heavy equipment, retail, consumer electronics, logistics, supply chain, strategy",
        },
        {
            icon: <Icons.Phone />,
            title: "Call for queries",
            text: "+ 965 220 72111 Ext. 1030",
        },
        {
            icon: <Icons.Email />,
            title: "Email Us",
            text: "enquiry@albahargroup.com",
        },
    ],
    block: {
        heading: "Get in Touch",
        text: "Fill out the form below and we'll get back to you as soon as possible",
    },
}