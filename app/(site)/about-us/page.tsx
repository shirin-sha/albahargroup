import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/about-page-banner.jpg';
import { TeamSliderData } from '@/data/sections/teamSliderData';
import { TestimonialData } from '@/data/sections/testimonialData';
import { Faq2Data } from '@/data/sections/faq2Data';
import { StickyBannerData } from "@/data/sections/stickyBannerData";
import { HeritageData } from '@/data/sections/heritageData';
import { CollaborationData } from '@/data/sections/collaborationData';
import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import TeamSlider from '@/components/sections/TeamSlider';
import Testimonials from '@/components/sections/Testimonials';
import Faq from '@/components/sections/Faq';
import StickyBanner from "@/components/sections/StickyBanner";
import Heritage from '@/components/sections/Heritage';
import Collaboration from '@/components/sections/Collaboration';
import Timeline from '@/components/sections/Timeline';

const PAGE_TITLE: string = 'About Us';
export const metadata: Metadata = {
    title: PAGE_TITLE,
}

async function getAboutCMSData(lang: 'en' | 'ar' = 'en') {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("aboutPageSections");
    const sections = await collection.find({}).sort({ order: 1 }).toArray();
    
    const testimonialsSection = sections.find(s => s.sectionId === 'testimonials');
    const stickyBannerSection = sections.find(s => s.sectionId === 'stickyBanner');
    const heritageSection = sections.find(s => s.sectionId === 'heritage');
    const collaborationSection = sections.find(s => s.sectionId === 'collaboration');
    const timelineSection = sections.find(s => s.sectionId === 'timeline');
    const teamSection = sections.find(s => s.sectionId === 'team');
    const faqSection = sections.find(s => s.sectionId === 'faq');
    
    return {
      testimonials: testimonialsSection?.[lang] || null,
      stickyBanner: stickyBannerSection?.[lang] || null,
      heritage: heritageSection?.[lang] || null,
      collaboration: collaborationSection?.[lang] || null,
      timeline: timelineSection?.[lang] || null,
      team: teamSection?.[lang] || null,
      faq: faqSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching about CMS data:', error);
    return {
      testimonials: null,
      stickyBanner: null,
      heritage: null,
      collaboration: null,
      timeline: null,
      team: null,
      faq: null,
    };
  }
}

const About = async () => {
    const cmsData = await getAboutCMSData('en');
    
    // Merge CMS data with static data as fallback
    const testimonialsData = cmsData.testimonials ? {
        wrapperCls: "testimonial section-padding",
        container: "container",
        subheading: cmsData.testimonials.subheading || TestimonialData.subheading,
        heading: cmsData.testimonials.heading || TestimonialData.heading,
        items: cmsData.testimonials.items,
    } : TestimonialData;

    const stickyBannerData = cmsData.stickyBanner ? {
        wrapperCls: "mt-100",
        container: "container",
        heading: cmsData.stickyBanner.heading || StickyBannerData.heading,
        text: cmsData.stickyBanner.text || StickyBannerData.text,
        blockList: cmsData.stickyBanner.blockList || StickyBannerData.blockList,
    } : StickyBannerData;

    const heritageData = cmsData.heritage ? {
        wrapperCls: "mt-100",
        container: "container",
        subheading: cmsData.heritage.subheading || HeritageData.subheading,
        heading: cmsData.heritage.heading || HeritageData.heading,
        text: cmsData.heritage.text || HeritageData.text,
        block: cmsData.heritage.block || HeritageData.block,
        image: cmsData.heritage.image || HeritageData.image,
    } : HeritageData;

    const collaborationData = cmsData.collaboration ? {
        wrapperCls: "mt-100 section-padding",
        container: "container",
        subheading: cmsData.collaboration.subheading || CollaborationData.subheading,
        heading: cmsData.collaboration.heading || CollaborationData.heading,
        text: cmsData.collaboration.text || CollaborationData.text,
        block: cmsData.collaboration.block || CollaborationData.block,
        textList: cmsData.collaboration.textList || CollaborationData.textList,
    } : CollaborationData;

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
            <Testimonials data={testimonialsData} />
            <StickyBanner data={stickyBannerData} />

            {/* Heritage Section */}
            <Heritage data={heritageData} />

            {/* Collaboration Section */}
            <Collaboration data={collaborationData} />

            {/* Timeline Section */}
            <Timeline data={cmsData.timeline ? {
                wrapperCls: "mt-100 section-padding",
                container: "container",
                subheading: cmsData.timeline.subheading,
                heading: cmsData.timeline.heading,
                timelineItems: cmsData.timeline.timelineItems,
            } : undefined} />

            {/* Our Team */}
            <TeamSlider
                data={cmsData.team ? {
                    wrapperCls: " section-padding",
                    container: "container",
                    subheading: cmsData.team.subheading,
                    heading: cmsData.team.heading,
                } : TeamSliderData}
                pagination={true}
            />

            {/* FAQ */}
            <Faq data={cmsData.faq ? {
                wrapperCls: "section-padding",
                container: "container",
                subheading: cmsData.faq.subheading || Faq2Data.subheading,
                heading: cmsData.faq.heading || Faq2Data.heading,
                text: cmsData.faq.text || Faq2Data.text,
                button: cmsData.faq.button || Faq2Data.button,
                items: cmsData.faq.items || Faq2Data.items,
            } : Faq2Data} />
        </>
    )
}

export default About;

