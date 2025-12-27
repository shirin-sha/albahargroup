import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/about-page-banner.jpg';
import { ImageTextData } from '@/data/sections/imageTextData';
import { ScrollingTextData } from '@/data/sections/scrollingTextData';
import { WhyChooseUsGridBgData } from '@/data/sections/whyChooseUsGridBgData';
import { TeamSliderData } from '@/data/sections/teamSliderData';
import { TestimonialData } from '@/data/sections/testimonialData';
import { Faq2Data } from '@/data/sections/faq2Data';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import ImageText from '@/components/sections/ImageText';
import ScrollingText from '@/components/sections/ScrollingText';
import WhyChooseUsGrid from '@/components/sections/WhyChooseUsGrid';
import TeamSlider from '@/components/sections/TeamSlider';
import Testimonials from '@/components/sections/Testimonials';
import Faq from '@/components/sections/Faq';
import { StickyBannerData } from "@/data/sections/stickyBannerData";
import StickyBanner from "@/components/sections/StickyBanner";
import { HeritageData } from '@/data/sections/heritageData';
import Heritage from '@/components/sections/Heritage';
import Collaboration from '@/components/sections/Collaboration';
import { CollaborationData } from '@/data/sections/collaborationData';
import Timeline from '@/components/sections/Timeline';
import { TimelineData } from '@/data/sections/timelineData';
const PAGE_TITLE: string = 'About Us';
export const metadata: Metadata = {
    title: PAGE_TITLE,
}


const About = () => {
    return (
        <>
            {/* Breadcrumb Banner */}
            <BreadcrumbBanner
                title={PAGE_TITLE}
                image={{
                    src: BreadcrumbBannerImage.src,
                    srcMobile: BreadcrumbBannerImage.src,
                    srcTablet: BreadcrumbBannerImage.src,
                    width: 1920,
                    height: 520,
                    cls: "media media-bg",
                    alt: "Banner Image",
                    loading: "eager"
                }}
            />

            {/* Testimonials */}
            <Testimonials data={TestimonialData} />
            <StickyBanner data={StickyBannerData} />




            {/* Heritage Section */}
            <Heritage data={HeritageData} />

            {/* Collaboration Section */}
            <Collaboration data={CollaborationData} />

   {/* Timeline Section */}
   <Timeline  />
            {/* Our Team */}
            <TeamSlider
                data={TeamSliderData}
                pagination={true}
            />



            {/* FAQ */}
            <Faq data={Faq2Data} />
        </>
    )
}

export default About;