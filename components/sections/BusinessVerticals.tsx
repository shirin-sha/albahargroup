'use client';

import { useState } from 'react';
import "@/styles/image-with-text.css";
import "@/styles/business-verticals.css";
import { SectionProps } from "@/types/sectionProps";
import Heading from "../Heading";
import Subheading from "../Subheading";
import Image from "next/image";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import Icons from "../Icons";

const BusinessVerticals = ({ data }: { data: SectionProps }) => {
    const {
        wrapperCls,
        container,
        subheading,
        heading,
        blockList,
    } = data || {};

    const [activeIndex, setActiveIndex] = useState(0);

    if (!blockList || blockList.length === 0) return null;

    const activeItem = blockList[activeIndex];

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % blockList.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + blockList.length) % blockList.length);
    };

    return (
        <div className={`business-verticals ${wrapperCls}`}>
            <div className={container}>
                <div className="business-verticals-wrapper">
                    <div className="grid grid-cols-12 gap-1">
                        {/* Left Column - Segment List */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="segment-list-wrapper">
                                {heading &&
                                    <Heading 
                                        title={heading}
                                        cls="text-50 fw-700"
                                        aos="fade-up"
                                    />
                                }

                                {subheading &&
                                    <Subheading 
                                        title={subheading}
                                        cls="text-16 fw-600"
                                        aos="fade-up"
                                    />
                                }

                                <ul className="segment-list list-unstyled">
                                    {blockList.map((item, index) => (
                                        <li
                                            key={`segment-${index}`}
                                            className={`segment-item ${index === activeIndex ? 'active' : ''}`}
                                            onClick={() => setActiveIndex(index)}
                                        >
                                            <div className="segment-item-content">
                                                {item.icon && (
                                                    <div className="segment-icon">
                                                        {item.icon}
                                                    </div>
                                                )}
                                                <span className="segment-title">{item.heading}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Column - Active Content */}
                        <div className="col-span-12 lg:col-span-8">
                            <div className="segment-content-wrapper">
                                {activeItem?.image && (
                                    <div className="segment-image-wrapper">
                                        <Image
                                            src={activeItem.image.src}
                                            width={activeItem.image.width || 1200}
                                            height={activeItem.image.height || 800}
                                            loading={activeItem.image.loading || "lazy"}
                                            alt={activeItem.image.alt || activeItem.heading || 'Business vertical'}
                                            className="segment-image"
                                        />
                                        
                                        {/* Navigation Arrows */}
                                        <button
                                            className="segment-nav segment-nav-prev"
                                            onClick={handlePrev}
                                            aria-label="Previous segment"
                                        >
                                            <Icons.ChevronLeft />
                                        </button>
                                        <button
                                            className="segment-nav segment-nav-next"
                                            onClick={handleNext}
                                            aria-label="Next segment"
                                        >
                                            <Icons.ChevronRight />
                                        </button>

                                        {/* Overlay Content */}
                                        <div className="segment-overlay">
                                            <div className="segment-overlay-content">
                                                {activeItem.heading &&
                                                    <Heading 
                                                        title={activeItem.heading}
                                                        cls="text-50 fw-700 text-white"
                                                        aos="fade-up"
                                                    />
                                                }

                                                {activeItem.text &&
                                                    <p className="text text-18" style={{ color: 'rgba(255, 255, 255, 0.9)' }} data-aos="fade-up">
                                                        {activeItem.text}
                                                    </p>
                                                }

                                                {activeItem.button &&
                                                    <div className="buttons" data-aos="fade-up">
                                                        {activeItem.button.type == 'primary' &&
                                                            <PrimaryButton 
                                                                label={activeItem.button.label}
                                                                href={activeItem.button.href}
                                                                ariaLabel={activeItem.button.label}
                                                            />
                                                        }

                                                        {activeItem.button.type == 'secondary' &&
                                                            <SecondaryButton 
                                                                label={activeItem.button.label}
                                                                href={activeItem.button.href}
                                                                ariaLabel={activeItem.button.label}
                                                            />
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessVerticals;
