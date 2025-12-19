import "@/styles/heritage.css";
import { SectionProps } from "@/types/sectionProps";
import Image from "next/image";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Text from "../Text";

const Heritage = ({ data }: { data: SectionProps }) => {
    const {
        wrapperCls,
        container,
        image,
        subheading,
        heading,
        text,
        block
    } = data || {};

    return (
        <div className={wrapperCls}>
            <div className={container ? container : 'container'}>
                <div className="heritage-content">
                    {/* Header Section */}
                    <div className="section-headings text-center" data-aos="fade-up">
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
                            />
                        }
                    </div>

                    {/* Main Content Grid */}
                    <div className="section-content">
                        <div className="grid lg:grid-cols-2 lg:gap-1 items-start">
                        {/* Founder Image Section */}
                        <div className="lg:col-span-1 col-span-2">
                            {image &&
                                <div className="founder-image-wrapper" data-aos="fade-right">
                                    <div className="founder-image-container">
                                        <Image
                                            src={image.src}
                                            width={image.width || 600}
                                            height={image.height || 800}
                                            loading={image.loading || "lazy"}
                                            alt={image.alt || 'Founder Image'}
                                            className="founder-image"
                                        />
                                        <div className="founder-image-overlay"></div>
                                    </div>
                                </div>
                            }
                        </div>

                        {/* Content Section */}
                        <div className="lg:col-span-1 col-span-2">
                            <div className="heritage-text-content" data-aos="fade-left">
                                {text && 
                                    <div className="heritage-intro">
                                        <Text 
                                            text={text}
                                            cls="text-16"
                                            aos="fade-up"
                                        />
                                    </div>
                                }

                                {block && (
                                    <div className="heritage-block" style={{ marginTop: '30px' }} data-aos="fade-up" data-aos-delay="100">
                                        {block.heading && 
                                            <Heading 
                                                title={block.heading}
                                                cls="text-32"
                                                aos="fade-up"
                                            />
                                        }

                                        {block.text && 
                                            <Text 
                                                text={block.text}
                                                cls="text-16"
                                                aos="fade-up"
                                            />
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Heritage;

