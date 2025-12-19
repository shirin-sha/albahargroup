import { BlockListProps } from "@/types/blocks";
import Image from "next/image";
import Heading from "./Heading";
import Subheading from "./Subheading";
import PrimaryButton from "./buttons/PrimaryButton";
import SecondaryButton from "./buttons/SecondaryButton";
import parser from "html-react-parser";

const CardImageText = ({ data }: { data: BlockListProps }) => {
    const {
        subheading,
        heading,
        text,
        button,
        image,
    } = data || {};

    return (
        <div className="image-text-card radius18">
            <div className="grid grid-cols-2 lg:gap-1 items-center product-grid">
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
                            />
                        }

                        {text && 
                            <div className="text text-16" data-aos="fade-up">
                                {parser(text)}
                            </div>
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

                {image &&
                    <div className="lg:col-span-1 col-span-2">
                        <div className="media-wrap radius18" data-aos="zoom-in-up">
                            <Image
                                src={image.src}
                                width={image.width}
                                height={image.height}
                                loading={image.loading}
                                alt={image.alt ? image.alt : 'Image'}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default CardImageText;