import "@/styles/running-content.css";
import { SectionProps } from "@/types/sectionProps";
import Link from "next/link";
import Image from "next/image";

const ScrollingTextGradient = ({ data }: { data: SectionProps }) => {
    const {    
        wrapperCls,
        container,
        imageList
    } = data || {};

    return (
        <div className={`running-content ${wrapperCls}`}>
            <div className={container}>
                <div className="content-inner radius18">
                    <div className="logos-background p-2">
                        <div className="content-lists-wrapper">
                            <div className="content-lists running-animation">
                                {/* First set */}
                                <div className="content-item">
                                    {imageList && imageList.map((item, index) => (
                                        <Link 
                                            href={item.href ? item.href : ''} 
                                            className="content-link" 
                                            key={`scroll-img-1-${index}`}
                                        >
                                            <Image
                                                src={item.src}
                                                width={item.width || 160}
                                                height={item.height || 55}
                                                loading={item.loading || "lazy"}
                                                alt={item.alt || "Brand Image"}
                                                className="brand-logo-image"
                                                style={{
                                                    width: `${item.width || 160}px`,
                                                    height: `${item.height || 55}px`,
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </div>
                                {/* Duplicate set for seamless loop */}
                                <div className="content-item">
                                    {imageList && imageList.map((item, index) => (
                                        <Link 
                                            href={item.href ? item.href : ''} 
                                            className="content-link" 
                                            key={`scroll-img-2-${index}`}
                                        >
                                            <Image
                                                src={item.src}
                                                width={item.width || 160}
                                                height={item.height || 55}
                                                loading={item.loading || "lazy"}
                                                alt={item.alt || "Brand Image"}
                                                className="brand-logo-image"
                                                style={{
                                                    width: `${item.width || 160}px`,
                                                    height: `${item.height || 55}px`,
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ScrollingTextGradient;