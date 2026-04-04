import "@/styles/blog.css";
import "@/styles/service-details.css";
import Icons from "../Icons";
import Image from "next/image";
import parse from 'html-react-parser';

import ServiceSidebar from "../ServiceSidebar";
import { ServiceProps } from "@/types/service";
import DrawerOpener from "../DrawerOpener";
import type { Language } from "@/libs/language";


const ServiceDetails = ({
    container,
    data,
    locale = 'en',
}: {
    container: string;
    data: ServiceProps;
    locale?: Language;
}) => {
    const {
        title,
        image,
        detailImage,
        content,
        slug,
        section,
    } = data || {};

    const displayImage = detailImage || image;

    return (
        <div className="page-service-details mt-100 mb-100">
            <div className={container}>
                <DrawerOpener
                    cls="open-sidebar svg-wrapper text text-20 fw-500 lg:!hidden"
                    data-drawer=".drawer-service-sidebar"
                >
                    <Icons.Filter />
                    Filter
                </DrawerOpener>
                <div className="grid grid-cols-12 lg:gap-1">
                    <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
                        <ServiceSidebar slug={slug} section={section} locale={locale} />
                    </div>
                    <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
                        <div className="service-details-content blog-details">
                            <div className="card-blog-list" data-aos="fade-up">
                                {displayImage && (
                                    <div className="card-blog-list-media radius18">
                                        <div className="media">
                                            <Image
                                                src={displayImage}
                                                width={1000}
                                                height={707}
                                                loading="lazy"
                                                alt={title as string}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="card-blog-content">
                                    {title && (
                                        <h2 className="card-blog-heading heading text-50">
                                            {title}
                                        </h2>
                                    )}

                                    {content && (
                                        <div className="blog-description">
                                            {parse(content)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* <Accordion 
                                cls="service-faq"
                                data={ServiceAccordionData}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
      </div>
    )
}

export default ServiceDetails;