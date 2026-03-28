import "@/styles/image-with-text.css";
import Image from "next/image";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Text from "../Text";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import { SectionProps } from "@/types/sectionProps";
import ScrollingTextGradient from "../sections/ScrollingTextGradient";
import Icons from "../Icons";

const ImageText2 = ({ data }: { data: SectionProps }) => {
    const {
        wrapperCls,
        container,
        imageList,
        subheading,
        heading,
        text,
        textList,
        items,
        button,
        rotatingLogo,
    } = data || {};

    const image1 = imageList ? imageList[0] : null;
    const image2 = imageList ? imageList[1] : null;
    
    // Use items if available, otherwise fallback to textList for backward compatibility
    const displayItems = items || (textList ? textList.map((item: any) => ({
        textheading1: item.title || '',
        textdescr1: item.text || ''
    })) : []);

    return (
        <div className={`image-text ${wrapperCls}`}>
            <div className={container ? container : 'container'}>
                <div className="grid grid-cols-2 lg:gap-1 items-center">
                    <div className="lg:col-span-1 col-span-2">
                        <div className="media-wrap" data-aos="zoom-in-up">
                            {image1 &&
                                <Image
                                    src={image1.src}
                                    width={image1.width}
                                    height={image1.height}
                                    loading={image1.loading}
                                    alt={image1.alt ? image1.alt : 'Image'}
                                />
                            }

                            {image2 &&
                                <div
                                    className="image-small"
                                    data-aos="zoom-in-down"
                                >
                                    <Image
                                        src={image2.src}
                                        width={image2.width}
                                        height={image2.height}
                                        loading={image2.loading}
                                        alt={image2.alt ? image2.alt : 'Image'}
                                    />
                                </div>
                            }
                        </div>
                        
                        {/* Logo slider from CMS only (no static fallback) */}
                        {rotatingLogo?.logo?.imageList?.length > 0 && (
                            <div className="w-full">
                                <ScrollingTextGradient
                                    data={{
                                        ...((rotatingLogo?.logo as any) || {}),
                                        container: "w-full",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 col-span-2">
                        <div className="content section-headings">
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
                                    cls="text-16"
                                    aos="fade-up"
                                    aosDelay="50"
                                />
                            }

                            {displayItems && displayItems.length > 0 &&
                                <ul className="list-block list-unstyled">
                                    {displayItems.map((item: any, index: number) => (
                                        <li 
                                            className="text-item text text-16" 
                                            data-aos="fade-up" 
                                            key={`text-item-${index}`}
                                        >
                                            {/* Static icon - alternating between Ambition and Purpose */}
                                            {index % 2 === 0 ? <Icons.Ambition /> : <Icons.Purpose />}

                                            {item.textheading1 && 
                                                <h3 className="title text text-20 fw-600">
                                                    {item.textheading1}
                                                </h3>
                                            }

                                            {item.textdescr1 && <div className="text text-16">{item.textdescr1}</div>}
                                        </li>
                                    ))}
                                </ul>
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
      </div>
    )
}

export default ImageText2;