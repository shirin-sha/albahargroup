import "@/styles/collaboration.css";
import { SectionProps } from "@/types/sectionProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Text from "../Text";
import Icons from "../Icons";

const Collaboration = ({ data }: { data: SectionProps }) => {
    const {
        wrapperCls,
        container,
        subheading,
        heading,
        text,
        block,
        textList
    } = data || {};

    return (
        <div className={'collaboration-section-alt mt-40'}>
            <div className={container ? container : 'container'}>
                <div className="collaboration-content-alt">
                    {/* Header Section */}
                    <div className="section-headings text-center" data-aos="fade-up">
                        {subheading && 
                            <Subheading 
                                title={subheading}
                                cls="text-20"
                                aos="fade-up"
                            />
                        }

                        {heading && 
                            <Heading 
                                title={heading}
                                cls="text-50"
                                aos="fade-up"
                            />
                        }
                    </div>

                    {/* Main Content Grid */}
                    <div className="section-content">
                        <div className="collaboration-grid">
                        {/* Intro Text Card */}
                        {text && 
                            <div className="collaboration-intro-card" data-aos="fade-up" data-aos-delay="50">
                              
                                <div className="card-content">
                                    <Text 
                                        text={text}
                                        cls="text-18"
                                        aos="fade-up"
                                    />
                                </div>
                            </div>
                        }

                        {/* Strategic Support Card */}
                        {block && block.heading && (
                            <div className="collaboration-feature-card" data-aos="fade-up" data-aos-delay="100">
                                <div className="feature-card-header">
                                    <div className="feature-icon">
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="48" height="48" rx="10" fill="#20282D" opacity="0.1"/>
                                            <path d="M24 16L28 22H26V32H22V22H20L24 16Z" fill="#20282D"/>
                                        </svg>
                                    </div>
                                    <Heading 
                                        title={block.heading}
                                        cls="text-28"
                                        aos="fade-up"
                                    />
                                </div>
                                {block.text && 
                                    <div className="feature-card-body">
                                        <Text 
                                            text={block.text}
                                            cls="text-16"
                                            aos="fade-up"
                                        />
                                    </div>
                                }
                            </div>
                        )}

                        {/* Talent Management Card */}
                        {block && block.subheading && (
                            <div className="collaboration-feature-card" data-aos="fade-up" data-aos-delay="150">
                                <div className="feature-card-header">
                                    <div className="feature-icon">
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="48" height="48" rx="10" fill="#20282D" opacity="0.1"/>
                                            <path d="M16 24L22 18V24H32V18L16 24Z" fill="#20282D"/>
                                        </svg>
                                    </div>
                                    <Heading 
                                        title={block.subheading}
                                        cls="text-28"
                                        aos="fade-up"
                                    />
                                </div>
                                {textList && textList.length > 0 && (
                                    <div className="feature-card-body">
                                        {textList.map((item, index) => (
                                            <Text 
                                                key={`text-list-${index}`}
                                                text={item.text || ''}
                                                cls="text-16"
                                                aos="fade-up"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Collaboration;

