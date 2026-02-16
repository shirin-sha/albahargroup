'use client';

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination  } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import "@/styles/team.css";
import { SectionProps } from "@/types/sectionProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import CardTeam from "../CardTeam";
import { Team } from '@/libs/models/team';
import { TeamMemberType } from '@/types/teamMember';

const TeamSlider = ({
    data,
    pagination 
}: {
    data: SectionProps;
    pagination: boolean;
}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [teamList, setTeamList] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch teams from API
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch('/api/teams?enabled=true');
                const result = await res.json();
                if (result.success) {
                    setTeamList(result.data);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    if (loading) {
        return null;
    }

    if(teamList.length == 0) return null;

    const {        
        wrapperCls,
        container,
        subheading,
        heading,
    } = data || {};    

    return (
        <team-slider className={`team-slider ${wrapperCls}`}>
            <div className={container}>
                <div className="section-headings headings-width text-center">
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

                <div className="section-content" data-aos="fade-up">
                    <Swiper
                        modules={pagination ? [Pagination] : []}
                        pagination={pagination ? { clickable: true } : undefined}
                        spaceBetween={20}
                        breakpoints={{
                            0: {
                                slidesPerView: 1.2,
                                spaceBetween: 20,
                            },
                            575: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            992: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        className="swiper"
                    >
                        {teamList.map((team) => {
                            // Transform Team to TeamMemberType format
                            const memberData: TeamMemberType = {
                                id: team.id || parseInt(team._id?.substring(0, 8) || '0', 16) || 0,
                                slug: team.slug,
                                name: team.name,
                                designation: team.designation,
                                image: team.image,
                                social: team.social,
                                year_of_expertise: team.year_of_expertise,
                                expertise: team.expertise,
                                phone: team.phone,
                                email: team.email,
                                biography: team.biography,
                                about: team.about,
                                about_skills: team.about_skills,
                                skills: team.skills,
                            };
                            return (
                                <SwiperSlide key={team._id || team.id}>
                                    <CardTeam data={memberData} />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </team-slider>
    )
}

export default TeamSlider;