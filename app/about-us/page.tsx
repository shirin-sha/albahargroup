import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import BreadcrumbBannerImageTablet from '@/public/img/banner/page-banner-991.jpg';
import BreadcrumbBannerImageMobile from '@/public/img/banner/page-banner-575.jpg';

import { ImageTextData } from '@/data/sections/imageTextData';
import { HeritageData } from '@/data/sections/heritageData';
import { CollaborationData } from '@/data/sections/collaborationData';
import { TimelineData } from '@/data/sections/timelineData';
import { ScrollingTextData } from '@/data/sections/scrollingTextData';
import { WhyChooseUsGridBgData } from '@/data/sections/whyChooseUsGridBgData';
import { TeamSliderData } from '@/data/sections/teamSliderData';
import { TestimonialData } from '@/data/sections/testimonialData';
import { Faq2Data } from '@/data/sections/faq2Data';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import ImageText from '@/components/sections/ImageText';
import Heritage from '@/components/sections/Heritage';
import Collaboration from '@/components/sections/Collaboration';
import Timeline from '@/components/sections/Timeline';
import ScrollingText from '@/components/sections/ScrollingText';
import WhyChooseUsGrid from '@/components/sections/WhyChooseUsGrid';
import TeamSlider from '@/components/sections/TeamSlider';
import Testimonials from '@/components/sections/Testimonials';
import Faq from '@/components/sections/Faq';


const PAGE_TITLE: string = 'About Us';
export const metadata: Metadata = {
  title: PAGE_TITLE,
}


const About = () => {
    return(
        <>
            {/* Breadcrumb Banner */}
            <BreadcrumbBanner 
                title={PAGE_TITLE}
                image={{
                    src: BreadcrumbBannerImage.src,
                    srcMobile: BreadcrumbBannerImageTablet.src,
                    srcTablet: BreadcrumbBannerImageMobile.src,
                    width: 1920,
                    height: 520,
                    cls: "media media-bg",
                    alt: "Banner Image",
                    loading: "eager"
                }}
            />

            {/* Image Text */}
            <ImageText data={ImageTextData} />


            {/* Scrolling Text */}
            <ScrollingText data={ScrollingTextData} />
                <ScrollingText data={ScrollingTextData} />
                
            <ScrollingText data={ScrollingTextData} />
                {/* Scrolling Text */}
                <ScrollingText data={ScrollingTextData} />

            {/* Why Choose Us */}
            <WhyChooseUsGrid data={WhyChooseUsGridBgData} />

         

            {/* Heritage Section */}
            <Heritage data={HeritageData} />

            {/* Collaboration Section */}
            <Collaboration data={CollaborationData} />

            {/* Timeline Section */}
            <Timeline data={TimelineData} />

            {/* Testimonials */}
            {/* <Testimonials data={TestimonialData} /> */}

            {/* FAQ */}
            {/* <Faq data={Faq2Data} /> */}
               {/* Our Team */}
               <TeamSlider 
                data={TeamSliderData} 
                pagination={true}
            />
        </>
    )
}

export default About;