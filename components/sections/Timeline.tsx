'use client';

import "@/styles/timeline.css";
import { SectionProps } from "@/types/sectionProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Icons from "../Icons";

interface TimelineItem {
    year: string;
    title: string;
    logos?: Array<{
        src: string;
        alt: string;
        width?: number;
        height?: number;
    }>;
    position?: 'above' | 'below';
}

const Timeline = ({ data }: { data: SectionProps & { timelineItems?: TimelineItem[] } }) => {
    const {
        subheading,
        heading,
        timelineItems = []
    } = data || {};

    const timelineRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
        if (timelineRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollability();
        const timeline = timelineRef.current;
        if (timeline) {
            timeline.addEventListener('scroll', checkScrollability);
            window.addEventListener('resize', checkScrollability);
            return () => {
                timeline.removeEventListener('scroll', checkScrollability);
                window.removeEventListener('resize', checkScrollability);
            };
        }
    }, [timelineItems]);

    const scroll = (direction: 'left' | 'right') => {
        if (timelineRef.current) {
            const scrollAmount = 400;
            const scrollTo = direction === 'left' 
                ? timelineRef.current.scrollLeft - scrollAmount
                : timelineRef.current.scrollLeft + scrollAmount;
            
            timelineRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="timeline-section">
            <div className="container">
                <div className="timeline-content">
                    {/* Header */}
                    <div className="section-headings text-center" data-aos="fade-up">
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

                    {/* Timeline Container */}
                    <div className="section-content">
                        <div className="timeline-container" data-aos="fade-up">
                        {/* Left Navigation Button */}
                        <button 
                            className={`timeline-nav-btn timeline-nav-left ${!canScrollLeft ? 'disabled' : ''}`}
                            onClick={() => scroll('left')}
                            aria-label="Scroll timeline left"
                            disabled={!canScrollLeft}
                        >
                            <Icons.ChevronLeft />
                        </button>

                        {/* Timeline Scroll Area */}
                        <div className="timeline-scroll-wrapper" ref={timelineRef}>
                            <div className="timeline-items">
                                {timelineItems.map((item, index) => (
                                    <div 
                                        key={`timeline-${index}`}
                                        className={`timeline-item ${item.position || 'below'}`}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                    >
                                        {/* Year at the center */}
                                        
                                        <div className="timeline-year">{item.year}</div>
                                        
                                        {/* Vertical connector line */}
                                        <div className="timeline-connector"></div>
                                        
                                        {/* Content box with description */}
                                        <div className="timeline-content-box">
                                            <div className="timeline-title">{item.title}</div>
                                        </div>
                                        
                                        {/* Logos on opposite side */}
                                        {item.logos && item.logos.length > 0 && (
                                            <div className="timeline-logos-wrapper">
                                                <div className="timeline-logos">
                                                    {item.logos.map((logo, logoIndex) => (
                                                        <div key={`logo-${index}-${logoIndex}`} className="timeline-logo">
                                                            <Image
                                                                src={logo.src}
                                                                alt={logo.alt}
                                                                width={logo.width || 100}
                                                                height={logo.height || 60}
                                                                loading="lazy"
                                                                className="logo-image"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Navigation Button */}
                        <button 
                            className={`timeline-nav-btn timeline-nav-right ${!canScrollRight ? 'disabled' : ''}`}
                            onClick={() => scroll('right')}
                            aria-label="Scroll timeline right"
                            disabled={!canScrollRight}
                        >
                            <Icons.ChevronRight />
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Timeline;

