import { SectionProps } from "@/types/sectionProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Text from "../Text";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import Accordion from "../Accordion";

const Faq = ({ data }: { data: SectionProps }) => {
    const {
        wrapperCls,
        container,
        subheading,
        heading,
        text,
        button,
        items,
    } = data || {};

    const accordionData = (items && Array.isArray(items) && items.length > 0) 
        ? items.map((item: any) => ({
            title: item.title || '',
            text: item.text || ''
        })).filter((item: any) => item.title && item.text) // Filter out empty items
        : [];

    if (accordionData.length === 0) return null;

    return (
        <div className={`faq ${wrapperCls}`}>
            <div className={container}>
                <div className="grid grid-cols-2 lg:gap-1 faq-row">
                    <div className="lg:col-span-1 col-span-2 faq-left-column">
                        <div className="section-headings faq-sticky-panel">
                            {subheading && 
                                <Subheading 
                                    title={subheading}
                                    cls="text-18"
                                    aos="fade-up"
                                />
                            }

                            {heading && 
                                <Heading 
                                    title={heading}
                                    cls="text-40"
                                    aos="fade-up"
                                    aosDelay="50"
                                />
                            }

                            {text && 
                                <Text 
                                    text={text}
                                    cls="text-18"
                                    aos="fade-up"
                                    aosDelay="80"
                                />
                            }

                            {button &&
                                <div className="buttons" data-aos="fade-up" data-aos-delay="100">
                                    {button.type == 'primary' &&
                                        <PrimaryButton 
                                            label={button.label}
                                            href={button.href}
                                            ariaLabel={button.label}
                                        />
                                    }

                                    {button.type == 'secondary' &&
                                        <SecondaryButton 
                                            label={button.label}
                                            href={button.href}
                                            ariaLabel={button.label}
                                        />
                                    }
                                </div>
                            }

                            {/* <div className="image-absolute" data-aos="zoom-in">
                                <Image 
                                    src={BackgroundImage.src}
                                    width={104} 
                                    height={180} 
                                    loading="lazy" 
                                    alt="Image" 
                                />
                            </div> */}
                        </div>
                    </div>

                    <div className="lg:col-span-1 col-span-2 faq-right-column">
                        <Accordion data={accordionData} />
                    </div>
                </div>
            </div>
      </div>
    )
}

export default Faq;