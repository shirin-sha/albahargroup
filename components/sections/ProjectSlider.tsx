'use client';

import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import "@/styles/project.css";
import "@/styles/recent-project.css";
import CardProject from '../CardProject';
import { Project } from '@/libs/models/project';
import { ProjectType } from '@/types/project';

import Heading from "../Heading";
import Subheading from "../Subheading";
import Icons from "../Icons";
import { SectionProps } from "@/types/sectionProps";
import { useLanguage } from "@/contexts/LanguageContext";


const ProjectSlider = ({ data }: {data: SectionProps}) => {
    const { language } = useLanguage();
    const isRTL = language === 'ar';
    // Refs for custom navigation buttons
    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects?enabled=true');
                const result = await res.json();
                if (result.success) {
                    setProjects(result.data);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Attach navigation after both swiper and refs are ready
    useEffect(() => {
        if (
            swiperInstance &&
            prevRef.current &&
            nextRef.current &&
            swiperInstance.params.navigation
        ) {
            const prevEl = isRTL ? nextRef.current : prevRef.current;
            const nextEl = isRTL ? prevRef.current : nextRef.current;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            swiperInstance.params.navigation.prevEl = prevEl;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            swiperInstance.params.navigation.nextEl = nextEl;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance, isRTL]);

    if (loading) {
        return null;
    }

    if(projects.length == 0) return null;

    const {
        wrapperCls,
        container,
        subheading,
        heading,
    } = data || {};
    return (
        <project-slider className={`project-slider ${wrapperCls}`}>
            <div className={container}>
                <div className="section-headings text-center">
                    {subheading &&
                        <Subheading 
                            title={subheading}
                            cls="text-18"
                            aos="fade-right"
                        />
                    }

                    {heading &&
                        <Heading 
                            title={heading}
                            cls="text-40"
                            aos="fade-right"
                        />
                    }
                </div>
            </div>

            <div className="section-content">
                <div className="container-fluid slider-container" data-aos="fade-up" data-aos-delay="100">
                    <Swiper
                        modules={[Navigation]}
                        onSwiper={setSwiperInstance}
                        breakpoints={{
                            0: { spaceBetween: 20, slidesPerView: 1.2 },
                            575: { spaceBetween: 20, slidesPerView: 1.6 },
                            768: { spaceBetween: 24, slidesPerView: 2 },
                            992: { spaceBetween: 30, slidesPerView: 2.5 },
                            1280: { spaceBetween: 40, slidesPerView: 3 },
                        }}
                        className="swiper"
                    >
                        {projects.map((project) => {
                            // Transform Project to ProjectType format
                            const projectData: ProjectType = {
                                slug: project.slug,
                                title: project.title,
                                description: project.description,
                                category: project.category,
                                client: project.client,
                                owner: project.owner,
                                starting_date: typeof project.starting_date === 'string' ? project.starting_date : project.starting_date?.toISOString(),
                                ending_date: typeof project.ending_date === 'string' ? project.ending_date : project.ending_date?.toISOString(),
                                website: project.website,
                                content: project.content,
                                image: project.image,
                                created_at: typeof project.created_at === 'string' ? project.created_at : project.created_at?.toISOString(),
                            };
                            return (
                                <SwiperSlide key={project._id || project.id}>
                                    <CardProject data={projectData} />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
                            
                {/* Navigation buttons */}
                <div className={container}>
                    <div className="swiper-nav-border" data-aos="fade-up" data-aos-delay="150">
                        <div className="swiper-nav-inner">
                            <div 
                                ref={prevRef} 
                                className="swiper-button-prev"
                            >
                                <Icons.ChevronLeft />
                            </div>
                            <div 
                                ref={nextRef} 
                                className="swiper-button-next"
                            >
                                <Icons.ChevronRight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </project-slider>
    )
}

export default ProjectSlider;