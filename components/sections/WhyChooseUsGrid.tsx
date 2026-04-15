import "@/styles/why-choose-us.css";
import { SectionProps } from "@/types/sectionProps";
import Heading from "../Heading";
import Subheading from "../Subheading";
import Text from "../Text";
import Image from "next/image";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import Icons from "../Icons";

/** Icons are fixed in code; titles, text, and layout copy all come from CMS (`items`). */
const STATIC_CHOOSE_ICONS = [Icons.Mission, Icons.Vision, Icons.Values] as const;

function StaticChooseIcon({ index }: { index: number }) {
    const C = STATIC_CHOOSE_ICONS[index];
    return C ? <C /> : null;
}

const WhyChooseUsGrid = ({ data }: { data: SectionProps }) => {
    const {
        wrapperCls,
        container,
        subheading,
        heading,
        text,
        button,
        image,
        items,
        backgroundImage,
    } = data || {};

    const rowItems = items && items.length > 0 ? items : [];
    const imageWidth = Number(image?.width) || 992;
    const imageHeight = Number(image?.height) || 863;
    const backgroundWidth = Number(backgroundImage?.width) || 1920;
    const backgroundHeight = Number(backgroundImage?.height) || 1080;

    return (
        <div className={`why-choose-us ${wrapperCls}`}>
            {backgroundImage &&
                <div className="media media-bg">
                    <Image
                        src={backgroundImage.src}
                        alt={backgroundImage.alt ? backgroundImage.alt : "Background image"}
                        width={backgroundWidth}
                        height={backgroundHeight}
                        loading={backgroundImage.loading}
                    />
                </div>
            }
            <div className={container}>
                <div className="choose-top">
                    <div className={`grid grid-cols-2 lg:gap-1 ${!image ? 'justify-center items-center' : ''}`}>
                        {image && (
                            <div className="col-span-2 lg:col-span-1">
                                <picture className="choose-media radius18" data-aos="fade-right">
                                    {image.srcMobile &&
                                        <source
                                            media="(max-width: 575px)"
                                            srcSet={image.srcMobile}
                                        />
                                    }
                                <Image 
                                    src={image.src}
                                    alt={image.alt ? image.alt : 'Image'}
                                    width={imageWidth}
                                    height={imageHeight}
                                    loading={image.loading}
                                />
                                </picture>
                            </div>
                        )}
                        
                        <div className={`col-span-2 ${image ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
                            <div className="choose-us-content section-headings ">
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

                                {text &&
                                    <Text 
                                        text={text}
                                        cls="text-18"
                                        aos="fade-up"
                                    />
                                }
                                
                                {button &&
                                    <div className="buttons" data-aos="fade-up">
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

                              
                            </div>
                        </div>
                    </div>
                </div>

                <div className="choose-bottom">
                    {rowItems.length > 0 && (
                        <div className="choose-bottom-cards">
                            <div className="grid grid-cols-12 gap-1 justify-center">
                                {rowItems.map((item, index) => {
                                    // Give values card (index 2) more columns to prevent wrapping
                                    const isValuesCard = index === 2;
                                    const colClass = isValuesCard 
                                        ? "col-span-12 lg:col-span-6 xl:col-span-5" 
                                        : index === 0
                                        ? "col-span-12 lg:col-span-6 xl:col-span-4"
                                        : "col-span-12 lg:col-span-6 xl:col-span-3";
                                    
                                    return (
                                        <div 
                                            className={colClass} 
                                            data-aos="fade-up" 
                                            key={`promo-${index}`} 
                                        >
                                            <div className="card-icon-text card-icon-text-horizontal">
                                                {STATIC_CHOOSE_ICONS[index] ? (
                                                    <div className="svg-wrapper">
                                                        <StaticChooseIcon index={index} />
                                                    </div>
                                                ) : null}

                                                <div className="content">
                                                    {item.title && 
                                                        <h2 className="heading text-20 fw-700">
                                                            {item.title}
                                                        </h2>
                                                    }

                                                    {item.text && 
                                                        <p className={`text text-16 ${isValuesCard ? 'values-text' : ''}`} style={{ whiteSpace: 'pre-line' }}>
                                                            {item.text}
                                                        </p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}    
                            </div>
                        </div>
                    )}

                  
                </div>
            </div>
        </div>
    )
}

export default WhyChooseUsGrid;