'use client';

import React from "react";

import "@/styles/testimonial.css";
import { SectionProps } from "@/types/sectionProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import CardTextOnly from "../CardTextOnly";
import TestimonialList from "@/data/abouttestimonial.json";


const Testimonials = ({ data }: { data: SectionProps }) => {
    const testimonialList = TestimonialList;
    if(testimonialList.length == 0) return null;

    const {
        wrapperCls,
        container,
        subheading,
        heading,
    } = data || {};

    return (
        <div className={wrapperCls}>
            <div className={container}>
                <div className="grid grid-cols-12 lg:grid-gap-1">            
                    <div className="lg:col-span-5 col-span-12">
                        <div className="section-headings section-headings-sticky">
                            {subheading &&
                                <Subheading 
                                    title={subheading}
                                    cls="text-18"
                                    aos="fade-up"
                                />
                            }

                            {heading &&
                                <Heading 
                                    title={heading}
                                    cls="text-40"
                                    aos="fade-up"
                                />
                            }
                        </div>
                    </div>
                    <div className="lg:col-span-7 col-span-12">
                        <div className="testimonial-card-inner">
                            {testimonialList.map((item, index) => (
                                 <React.Fragment key={`card-tstimonial-${index}`}>
                                    <CardTextOnly text={item.text} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonials;