import { SectionProps } from "@/types/sectionProps";
import FounderImage from '@/public/img/image-text/img1.png'; // Placeholder - user will replace

export const HeritageData: SectionProps = {
    wrapperCls: "mt-100",
    container: "container",
    subheading: "OUR Heritage",
    heading: "A Legacy of Enduring Alliances",
    text: "Our long history stands testament to our deep expertise in building successful partnerships with leading global brands. The story of our group's development has paralleled the growth of our business alliances and the evolving needs of the brands we collaborate with. Today, we have become a diversified group of companies, catering to a broad spectrum of industries and sectors.",
    block: {
        heading: "Mr. Mohamed Al-Bahar",
        text: "Beyond his role in laying the foundations and steering our group to what it has become today, Mr. Mohamed Al-Bahar was instrumental in establishing a number of Kuwait's key public institutions, including the Kuwait Chamber of Commerce, the Educational Council, and the Health Council. He played a pivotal role in guiding Kuwait's transformation into a modern, self-reliant society and economy. A dedicated philanthropist, Mr. Al-Bahar consistently championed the importance of giving back to the community. His significant contributions were recognized internationally, earning him the Order of the British Empire (OBE) from Queen Elizabeth in 2003."
    },
    image: {
        src: FounderImage.src,
        width: 600,
        height: 800,
        alt: 'Mr. Mohamed Al-Bahar - Founder',
        loading: 'lazy'
    }
}

