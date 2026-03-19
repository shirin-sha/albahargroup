import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/about-page-banner.jpg';
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
            {cmsData.testimonials && (
                <Testimonials data={{
                    wrapperCls: "testimonial section-padding",
                    container: "container",
                    subheading: cmsData.testimonials.subheading,
                    heading: cmsData.testimonials.heading,
                    items: cmsData.testimonials.items,
                }} />
            )}
            {cmsData.stickyBanner && (
                <StickyBanner data={{
                    wrapperCls: "mt-100",
                    container: "container",
                    heading: cmsData.stickyBanner.heading,
                    text: cmsData.stickyBanner.text,
                    blockList: cmsData.stickyBanner.blockList,
                }} />
            )}

            {/* Heritage Section */}
            {cmsData.heritage && (
                <Heritage data={{
                    wrapperCls: "mt-100",
                    container: "container",
                    subheading: cmsData.heritage.subheading,
                    heading: cmsData.heritage.heading,
                    text: cmsData.heritage.text,
                    block: cmsData.heritage.block,
                    image: cmsData.heritage.image,
                }} />
            )}

            {/* Collaboration Section */}
            {cmsData.collaboration && (
                <Collaboration data={{
                    wrapperCls: "mt-100 section-padding",
                    container: "container",
                    subheading: cmsData.collaboration.subheading,
                    heading: cmsData.collaboration.heading,
                    text: cmsData.collaboration.text,
                    block: cmsData.collaboration.block,
                    textList: cmsData.collaboration.textList,
                }} />
            )}

            {/* Timeline Section */}
            <Timeline data={cmsData.timeline ? {
                wrapperCls: "mt-100 section-padding",
                container: "container",
                subheading: cmsData.timeline.subheading,
                heading: cmsData.timeline.heading,
                timelineItems: cmsData.timeline.timelineItems,
            } : undefined} />

            {/* Our Team */}
            {cmsData.team && (
                <TeamSlider
                data={{
                    wrapperCls: " section-padding",
                    container: "container",
                    subheading: cmsData.team.subheading,
                    heading: cmsData.team.heading,
                }}
                pagination={true}
                />
            )}

            {/* FAQ */}
            {cmsData.faq && (
                <Faq data={{
                    wrapperCls: "section-padding",
                    container: "container",
                    subheading: cmsData.faq.subheading,
                    heading: cmsData.faq.heading,
                    text: cmsData.faq.text,
                    button: cmsData.faq.button,
                    items: cmsData.faq.items,
                }} />
            )}
        </>
    )
}

export default About;

