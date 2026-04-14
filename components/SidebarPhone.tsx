import Icons from "./Icons";
import Link from "next/link";
import Image from "next/image";
import { SidebarPhoneType } from "@/types/sidebarPhone";
import parser from "html-react-parser";

const SidebarPhone = ({
    image,
    heading,
    text,
    phone
}: SidebarPhoneType) => {
    const { 
        src,
        width,
        height,
        loading,
        alt
    } = image
    const dialPhone = phone ? phone.replace(/\s+/g, "") : "";

    return (
        <div
            className="sidebar-widget service-contact radius18"
            data-aos="fade-up"
        >
            <div className="media media-bg overlay">
                <Image
                    src={src}
                    width={width}
                    height={height}
                    loading={loading}
                    alt={alt ? alt : 'Background image'}
                />
            </div>

            <div className="service-contact-content">
                {heading && <h2 className="heading text-36">{parser(heading)}</h2>}

                {phone && 
                    <Link
                        className="icon-contact"
                        href={`tel:${dialPhone}`}
                        aria-label={`Call us at ${phone} number`}
                    >
                        <Icons.PhoneLarge />
                        <span className="visually-hidden">
                            Call us at {phone} number
                        </span>
                    </Link>
                }

                {text && 
                    <div className="contact-text text text-16">
                        {text}
                    </div>
                }

                {phone && 
                    <Link
                        className="contact-number heading text-24"
                        href={`tel:${dialPhone}`}
                        aria-label={`Call us at ${phone} number`}
                        dir="ltr"
                        style={{ unicodeBidi: "isolate" }}
                    >
                        {phone}
                    </Link>
                }
            </div>
        </div>
    )
}

export default SidebarPhone;