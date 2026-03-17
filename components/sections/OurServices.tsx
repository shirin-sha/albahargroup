'use client';

import "@/styles/multicolumn.css";
import Image from "next/image";
import Subheading from "../Subheading";
import Heading from "../Heading";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import CardService from "../CardService";
import { SectionProps } from "@/types/sectionProps";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useMemo, useState } from "react";

const OurServices = ({ data }: { data: SectionProps }) => {
    const { language } = useLanguage();
    const [serviceList, setServiceList] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/services?enabled=true');
                const result = await res.json();
                if (result?.success) {
                    setServiceList(result.data || []);
                }
            } catch {
                setServiceList([]);
            }
        };
        load();
    }, []);

    const topServices = useMemo(() => serviceList.slice(0, 3), [serviceList]);
    if(topServices.length == 0) return null;

    const {
        wrapperCls,
        container,
        backgroundImage,
        subheading,
        heading,
        button
    } = data || {};

    return (
        <div className={`multicolumn ${wrapperCls}`}>
            {backgroundImage &&
                <div className="media media-bg">
                    <Image
                        src={backgroundImage.src}
                        width={backgroundImage.width}
                        height={backgroundImage.height}
                        loading={backgroundImage.loading}
                        alt={backgroundImage.alt ? backgroundImage.alt : 'bg image'}
                    />
                </div>
            }

            <div className={container}>
                <div className="multicolumn-header section-headings">
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

                <div className="multicolumn-inner">
                    <div className="grid lg:grid-cols-3 lg:gap-1">
                        {topServices.map((service) => (
                            <div 
                                className="col-span-1 multi-col" 
                                data-aos="fade-up" 
                                key={`servicel-card-${service._id || service.id}`}
                            >
                                <CardService data={{ ...service, id: service._id ? String(service._id) : service.id }} />
                            </div>
                        ))}
                    </div>
                </div>

                {button && 
                    <div className="section-headings text-center">
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
                    </div>
                }
            </div>
        </div>
    )
}

export default OurServices;