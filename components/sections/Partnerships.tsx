import "@/styles/partnerships.css";
import { SectionProps } from "@/types/sectionProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Text from "../Text";
import Image from "next/image";

const Partnerships = ({ data }: { data: SectionProps }) => {
    const {
        wrapperCls,
        container,
        subheading,
        heading,
        text,
        imageList
    } = data || {};

    return (
        <div className={wrapperCls}>
            <div className={container ? container : 'container'}>
                <div className="partnerships-content">
                    {/* Header Section */}
                    <div className="partnerships-header section-headings text-center" data-aos="fade-up">
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
                            <div className="partnerships-intro mt-30">
                                <Text 
                                    text={text}
                                    cls="text-16"
                                    aos="fade-up"
                                />
                            </div>
                        }
                    </div>

                    {/* Partners Grid */}
                    {imageList && imageList.length > 0 && (
                        <div className="partners-grid mt-60">
                            {imageList.map((partner, index) => (
                                <div 
                                    key={`partner-${index}`}
                                    className="partner-card"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 50}
                                >
                                    <div className="partner-logo-wrapper">
                                        <Image
                                            src={partner.src}
                                            width={200}
                                            height={120}
                                            alt={partner.alt || `Partner ${index + 1}`}
                                            loading={partner.loading || "lazy"}
                                            className="partner-logo"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Partnerships;


