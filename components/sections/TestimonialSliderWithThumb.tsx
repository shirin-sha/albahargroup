'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import "@/styles/testimonial.css";
import { SectionProps } from "@/types/sectionProps";
import { TestimonialProps } from "@/types/testimonialProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import CardTestimonialContent from "../CardTestimonialContent";
import TestimonialList from "@/data/testimonials.json";
import Image from 'next/image';
import Icons from "../Icons";


const TestimonialSliderWithThumb = ({ data }: { data: SectionProps;}) => {
    const [thumbSwiper, setThumbSwiper] = useState<any>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const testimonialList = TestimonialList as TestimonialProps[];
    if(testimonialList.length == 0) return null;

    const [activeHeading, setActiveHeading] = useState<string | undefined>(
        testimonialList[0]?.heading || data?.heading
    );

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

    const getIconComponent = (iconName: string | undefined) => {
        if (!iconName) return null;
        const IconComponent = Icons[iconName as keyof typeof Icons];
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
                                                    width={1000} 
                                                    height={800} 
                                                    loading="lazy" 
                                                    alt="main image" 
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal custom-pagination-thumb-img">
                                    {testimonialList.map((item, index) => {
                                        const IconComponent = getIconComponent(item.icon);
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
                                                {IconComponent}
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