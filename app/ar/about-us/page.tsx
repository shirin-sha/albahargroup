import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/about-page-banner.jpg';
import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import { getAboutPageBannerTitle } from '@/libs/cms/aboutPage';
import TeamSlider from '@/components/sections/TeamSlider';
import Testimonials from '@/components/sections/Testimonials';
import Faq from '@/components/sections/Faq';
import StickyBanner from "@/components/sections/StickyBanner";
import Heritage from '@/components/sections/Heritage';
import Collaboration from '@/components/sections/Collaboration';
import Timeline from '@/components/sections/Timeline';
import { absoluteUrl } from '@/libs/seo';

export const revalidate = 3600;

async function getAboutCMSData(lang: 'en' | 'ar' = 'ar') {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("aboutPageSections");
    const sections = await collection.find({}).sort({ order: 1 }).toArray();
    
    const metadataSection = sections.find(s => s.sectionId === 'metadata');
    const pageHeaderSection = sections.find(s => s.sectionId === 'pageHeader');
    const testimonialsSection = sections.find(s => s.sectionId === 'testimonials');
    const stickyBannerSection = sections.find(s => s.sectionId === 'stickyBanner');
    const heritageSection = sections.find(s => s.sectionId === 'heritage');
    const collaborationSection = sections.find(s => s.sectionId === 'collaboration');
    const timelineSection = sections.find(s => s.sectionId === 'timeline');
    const teamSection = sections.find(s => s.sectionId === 'team');
    const faqSection = sections.find(s => s.sectionId === 'faq');
    
    return {
      metadata: metadataSection?.[lang] || null,
      pageHeader: pageHeaderSection?.[lang] || null,
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
      metadata: null,
      pageHeader: null,
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

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getAboutCMSData('ar');
  const title = cmsData?.metadata?.metaTitle || getAboutPageBannerTitle(cmsData.pageHeader, 'ar');
  const description =
    cmsData?.metadata?.metaDescription ||
    cmsData?.testimonials?.heading ||
    cmsData?.heritage?.text ||
    'تعرف على تاريخ مجموعة البهار وقيمها وقيادتها ومسيرتها المؤسسية.';

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl('/ar/about-us'),
      languages: {
        en: absoluteUrl('/about-us'),
        ar: absoluteUrl('/ar/about-us'),
      },
    },
  };
}

const About = async () => {
    const cmsData = await getAboutCMSData('ar');
    const bannerTitle = getAboutPageBannerTitle(cmsData.pageHeader, 'ar');

    return (
        <>
            <BreadcrumbBanner
                title={bannerTitle}
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
                    wrapperCls: "mt-100 section-padding",
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
