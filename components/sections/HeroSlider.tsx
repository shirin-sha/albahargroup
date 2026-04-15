"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "@/styles/hero-slider.css";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Text from "../Text";
import PrimaryButton from "../buttons/PrimaryButton";
import Icons from "../Icons";
import Image from "next/image";
import { HeroSliderType } from "@/types/heroSlider";

const HeroSlider = ({
    wrapperCls,
    slides,
    navigation
}: HeroSliderType) => {
    // Refs for custom navigation buttons
    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [isRTL, setIsRTL] = useState(false);

    // Check if page is RTL (Arabic)
    useEffect(() => {
        const checkRTL = () => {
            const dir = document.documentElement.dir || document.documentElement.getAttribute('dir');
            setIsRTL(dir === 'rtl');
        };
        checkRTL();
        // Watch for changes
        const observer = new MutationObserver(checkRTL);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir']
        });
        return () => observer.disconnect();
    }, []);

    // Attach navigation after both swiper and refs are ready
    useEffect(() => {
        if (
            swiperInstance &&
            prevRef.current &&
            nextRef.current
        ) {
            // Check if navigation module is available
            if (
                swiperInstance.navigation && 
                swiperInstance.params && 
                swiperInstance.params.navigation
            ) {
                try {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    swiperInstance.params.navigation.prevEl = prevRef.current;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    swiperInstance.params.navigation.nextEl = nextRef.current;
                    swiperInstance.navigation.init();
                    swiperInstance.navigation.update();
                } catch (error) {
                    console.warn('Error initializing navigation:', error);
                }
            }
        }
    }, [swiperInstance, isRTL]);

    // Update swiper when RTL changes - reinitialize to fix RTL issues
    useEffect(() => {
        if (swiperInstance && swiperInstance.el) {
            try {
                // Update swiper direction and reinitialize
                // Use setTimeout to ensure DOM is ready
                const timer = setTimeout(() => {
                    if (swiperInstance && swiperInstance.el) {
                        swiperInstance.update();
                        swiperInstance.updateSize();
                        // Only call updateSlides if slides exist
                        if (swiperInstance.slides && swiperInstance.slides.length > 0) {
                            swiperInstance.updateSlides();
                            swiperInstance.updateSlidesClasses();
                        }
                        swiperInstance.updateAutoHeight();
                    }
                }, 0);
                return () => clearTimeout(timer);
            } catch (error) {
                console.warn('Error updating swiper:', error);
            }
        }
    }, [swiperInstance, isRTL]);


    return (
        <hero-slider className={`hero-slider ${wrapperCls}`}>
            <Swiper
                key={isRTL ? 'rtl' : 'ltr'}
                slidesPerView={1}
                loop={true}
            
                modules={[Navigation, Autoplay]}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={1000}
                dir={isRTL ? 'rtl' : 'ltr'}
                onSwiper={setSwiperInstance}
                watchOverflow={true}
                spaceBetween={0}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={`slide-${index}`}>
                        <div className="slider-card overlay">
                            {slide.image && 
                                <picture className="slider-media">
                                    {slide.imageMobile && <source media="(max-width: 575px)" srcSet={slide.imageMobile} />}
                                    {slide.imageTablet && <source media="(max-width: 991px)" srcSet={slide.imageTablet} />}
                                    <Image
                                        src={slide.image}
                                        width={1920}
                                        height={1000}
                                        loading="lazy"
                                        alt="Hero image"
                                    />
                                </picture>
                            }

                            <div className="slider-content">
                                <div className="container height-100 flex items-center">
                                    <div className="content-box slider-animation section-headings">
                                        {slide.subheading && 
                                            <Subheading 
                                                title={slide.subheading}
                                                cls="text-18"
                                            />
                                        }

                                        {slide.heading && 
                                            <Heading 
                                                title={slide.heading}
                                                cls="text-76 fw-600"
                                            />
                                        }

                                        {slide.text && 
                                            <Text 
                                                text={slide.text}
                                                cls="text-16"
                                            />
                                        }

                                        {slide.button && 
                                            <div className="buttons">
                                                <PrimaryButton 
                                                    label={slide.button.label}
                                                    href={slide.button.href}
                                                    ariaLabel="Hero button"
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>            

            {navigation && 
                <div className="slider-nav">
                    <div className={`swiper-button-prev ${isRTL ? 'rtl' : ''}`} ref={prevRef}>
                        <Icons.SliderNavPrev />
                    </div>
                    <div className={`swiper-button-next ${isRTL ? 'rtl' : ''}`} ref={nextRef}>
                        <Icons.SliderNavNext />
                    </div>
                </div>
            }
      </hero-slider>
    )
}

export default HeroSlider;