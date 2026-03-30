'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import "@/styles/testimonial.css";
import { SectionProps } from "@/types/sectionProps";
import { TestimonialProps } from "@/types/testimonialProps";
import { Service } from '@/libs/models/service';
import { useLanguage } from '@/contexts/LanguageContext';
import { addLanguagePrefix } from '@/libs/language';
import { resolveServiceFields } from '@/libs/serviceLocale';
import Subheading from "../Subheading";
import Heading from "../Heading";
import CardTestimonialContent from "../CardTestimonialContent";
import Image from 'next/image';
import Icons from "../Icons";
import parser from 'html-react-parser';


const TestimonialSliderWithThumb = ({ data }: { data: SectionProps;}) => {
    const { language } = useLanguage();
    const [thumbSwiper, setThumbSwiper] = useState<any>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [businessServices, setBusinessServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeHeading, setActiveHeading] = useState<string | undefined>(data?.heading);

    const testimonialList = useMemo(() => {
        return businessServices.map((item) => {
            const r = resolveServiceFields(item, language);
            return {
                heading: r.detailTitle || r.title,
                review: r.description || '',
                image: r.image || '',
                icon: r.icon || '',
                button: {
                    label: language === 'ar' ? 'مزيد من التفاصيل' : 'More Details',
                    href: addLanguagePrefix('/businesses', language),
                },
            } as TestimonialProps;
        });
    }, [businessServices, language]);

    useEffect(() => {
        const loadBusinessServices = async () => {
            try {
                const res = await fetch('/api/services?enabled=true&section=businesses');
                const result = await res.json();
                if (result?.success) {
                    setBusinessServices((result.data || []) as Service[]);
                } else {
                    setBusinessServices([]);
                }
            } catch {
                setBusinessServices([]);
            } finally {
                setLoading(false);
            }
        };

        loadBusinessServices();
    }, []);

    useEffect(() => {
        if (testimonialList.length === 0) {
            setActiveHeading(data?.heading);
            return;
        }

        const nextIndex = activeIndex >= testimonialList.length ? 0 : activeIndex;
        if (nextIndex !== activeIndex) {
            setActiveIndex(nextIndex);
        }
        setActiveHeading(testimonialList[nextIndex]?.heading || data?.heading);
    }, [testimonialList, activeIndex, data?.heading]);

    if (loading) return null;
    if (testimonialList.length === 0) return null;

    const {
        wrapperCls,
        container,
        backgroundImage,
        subheading,
        heading,
    } = data || {};

    const updateHeading = (index: number) => {
        setActiveHeading(testimonialList[index]?.heading || heading);
        setActiveIndex(index);
    };

    const displayHeading = activeHeading || heading;

    const getIconElement = (iconValue: string | undefined) => {
        if (!iconValue) return null;
        const isInlineSvg = iconValue.includes('<');
        if (isInlineSvg) return parser(iconValue);
        const IconComponent = Icons[iconValue as keyof typeof Icons];
        return IconComponent ? <IconComponent /> : null;
    };

    return (
        <div className={wrapperCls}>
            {backgroundImage &&
                <div className="media media-bg">
                    <Image
                        src={backgroundImage.src}
                        width={backgroundImage.width}
                        height={backgroundImage.height}
                        loading={backgroundImage.loading}
                        alt={backgroundImage.alt ? backgroundImage.alt : 'Background image'}
                    />
                </div>
            }

            <div className={`section-padding ${container}`}>
                <div className="section-headings lg:hidden">
                    {subheading &&
                        <Subheading 
                            title={subheading}
                            cls="text-18"
                            aos="fade-up"
                        />
                    }

                    {displayHeading &&
                        <Heading 
                            title={displayHeading}
                            cls="text-40"
                            aos="fade-up"
                        />
                    }
                </div>

                <testimonial-slider className="testimonial-slider">
                    <div className="grid grid-cols-2 lg:gap-1">
                        <div className="lg:col-span-1 col-span-2">
                            <div className="main-img testimonial-2">
                                <Swiper
                                    modules={[Thumbs]}
                                    thumbs={{ swiper: thumbSwiper }}
                                    onSwiper={(swiper) => {
                                        setMainSwiper(swiper);
                                        updateHeading(swiper.activeIndex || 0);
                                    }}
                                    onSlideChange={(swiper) => updateHeading(swiper.activeIndex || 0)}
                                    className="swiper"
                                >
                                    {testimonialList.map((item, index) => (
                                        <SwiperSlide key={`testimonial-main-${index}`}>
                                            <div className="main-img radius18">
                                                <Image 
                                                    src={item.image || ''}
                                                    width={700} 
                                                    height={636} 
                                                    loading="lazy" 
                                                    alt="main image" 
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal custom-pagination-thumb-img">
                                    {testimonialList.map((item, index) => {
                                        const iconElement = getIconElement(item.icon);
                                        return (
                                            <div
                                                key={`pagination-${index}`}
                                                className={`swiper-pagination-bullet custom-bullet ${activeIndex === index ? 'swiper-pagination-bullet-active' : ''}`}
                                                onClick={() => {
                                                    if (mainSwiper) {
                                                        mainSwiper.slideTo(index);
                                                    }
                                                    if (thumbSwiper) {
                                                        thumbSwiper.slideTo(index);
                                                    }
                                                    updateHeading(index);
                                                }}
                                                role="button"
                                                aria-label={`Go to slide ${index + 1}`}
                                            >
                                                {iconElement}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 col-span-2">
                            <div className="thumb-content-wrapper">
                                <div className="section-headings hidden lg:block">
                                    {subheading &&
                                        <Subheading 
                                            title={subheading}
                                            cls="text-18"
                                            aos="fade-up"
                                        />
                                    }

                                    {displayHeading &&
                                        <Heading 
                                            title={displayHeading}
                                            cls="text-40"
                                            aos="fade-up"
                                        />
                                    }
                                </div>

                                <div className="thumb-content">
                                    <Swiper
                                        modules={[Thumbs]}
                                        onSwiper={(swiper) => {
                                            setThumbSwiper(swiper);
                                            updateHeading(swiper.activeIndex || 0);
                                        }}
                                        onSlideChange={(swiper) => updateHeading(swiper.activeIndex || 0)}
                                        watchSlidesProgress
                                        allowTouchMove={true}
                                        className="swiper"
                                    >
                                        {testimonialList.map((item, index) => (
                                            <SwiperSlide key={`testimonial-content-${index}`}>
                                                <CardTestimonialContent data={item} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </testimonial-slider>
            </div>
        </div>
    )
}

export default TestimonialSliderWithThumb;