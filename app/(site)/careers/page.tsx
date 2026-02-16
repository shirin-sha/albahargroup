import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import { CareerData, JobListingsData } from '@/data/sections/careerData';
import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import CareerSection from '@/components/sections/Career';


const PAGE_TITLE: string = 'Careers';
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

async function getCareersCMSData(lang: 'en' | 'ar' = 'en') {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("careersPageSections");
    const sections = await collection.find({}).sort({ order: 1 }).toArray();
    
    const bannerSection = sections.find(s => s.sectionId === 'banner');
    const careerSection = sections.find(s => s.sectionId === 'careerSection');
    
    return {
      banner: bannerSection?.[lang] || { title: PAGE_TITLE },
      careerSection: careerSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching careers CMS data:', error);
    return {
      banner: { title: PAGE_TITLE },
      careerSection: null,
    };
  }
}

const Careers = async () => {
    const cmsData = await getCareersCMSData('en');
    
    // Merge CMS data with static data as fallback
    const careerData = cmsData.careerSection ? {
        wrapperCls: "section-padding",
        container: "container",
        subheading: cmsData.careerSection.subheading || CareerData.subheading,
        heading: cmsData.careerSection.heading || CareerData.heading,
        text: cmsData.careerSection.text || CareerData.text,
    } : CareerData;

    return(
        <>
            {/* Breadcrumb Banner */}
            <BreadcrumbBanner 
                title={cmsData.banner.title || PAGE_TITLE}
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

            {/* Career Section - Job Listings */}
            <CareerSection data={careerData} jobListings={JobListingsData} />
       
        </>
    )
}

export default Careers;

