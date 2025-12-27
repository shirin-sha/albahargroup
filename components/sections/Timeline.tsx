"use client";
import { TimelineData } from "@/data/sections/timelineData";
import React, { useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from 'swiper';
import Image from "next/image";
import Icons from "../Icons";
import Subheading from "../Subheading";
import Heading from "../Heading";
import 'swiper/css';
import 'swiper/css/navigation';
import "@/styles/timeline.css";

export default function History() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  
  const { subheading, heading, timelineItems } = TimelineData;

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
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
                className={`timeline-nav-btn timeline-nav-left ${isBeginning ? 'disabled' : ''}`}
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous slide"
                disabled={isBeginning}
              >
                <Icons.ChevronLeft />
              </button>

              {/* Timeline Swiper */}
              <Swiper
                modules={[Navigation]}
                spaceBetween={40}
                slidesPerView={1}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }}
                onSlideChange={handleSlideChange}
                breakpoints={{
                  575: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                }}
                className="timeline-swiper"
              >
                {timelineItems?.map((item, index) => (
                  <SwiperSlide key={`timeline-${index}`}>
                    <div
                      className="time-line-item"
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <div className="time-line-content">
                        <div className="heading">
                          <div className="label">{item.year}</div>
                          <h5 className="title-content">{item.title}</h5>
                        </div>
                        {item.logos && item.logos.length > 0 && (
                          <div className="time-line-logos">
                            {item.logos.map((logo, logoIndex) => (
                              <div key={`logo-${index}-${logoIndex}`} className="time-line-logo-item">
                                <Image
                                  src={logo.src}
                                  alt={logo.alt}
                                  width={100}
                                  height={60}
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Right Navigation Button */}
              <button 
                className={`timeline-nav-btn timeline-nav-right ${isEnd ? 'disabled' : ''}`}
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next slide"
                disabled={isEnd}
              >
                <Icons.ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}