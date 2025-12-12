import { BlockListProps } from "@/types/blocks";
import Image from "next/image";
import Heading from "./Heading";
import Text from "./Text";
import PrimaryButton from "./buttons/PrimaryButton";
import SecondaryButton from "./buttons/SecondaryButton";

const CardBusinessVertical = ({ data }: { data: BlockListProps }) => {
    const {
        heading,
        text,
        button,
        image,
    } = data || {};

    return (
        <div className="card-business-vertical radius18">
            {image &&
                <div className="card-image" data-aos="fade-up">
                    <Image
                        src={image.src}
                        width={image.width}
                        height={image.height}
                        loading={image.loading}
                        alt={image.alt ? image.alt : heading || 'Business vertical image'}
                    />
                </div>
            }
            
            <div className="card-content">
                {heading &&
                    <Heading 
                        title={heading}
                        cls="text-24 fw-700"
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
    )
}

export default CardBusinessVertical;

