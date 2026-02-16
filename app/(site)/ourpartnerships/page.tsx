import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';

import { PartnershipsData } from '@/data/sections/partnershipsData';
import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import Partnerships from '@/components/sections/Partnerships';


const PAGE_TITLE: string = 'Partnerships';
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

async function getPartnershipsCMSData(lang: 'en' | 'ar' = 'en') {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("partnershipsPageSections");
    const sections = await collection.find({}).sort({ order: 1 }).toArray();
    
    const bannerSection = sections.find(s => s.sectionId === 'banner');
    const partnershipsSection = sections.find(s => s.sectionId === 'partnerships');
    
    return {
      banner: bannerSection?.[lang] || { title: PAGE_TITLE },
      partnerships: partnershipsSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching partnerships CMS data:', error);
    return {
      banner: { title: PAGE_TITLE },
      partnerships: null,
    };
  }
}

const PartnershipsPage = async () => {
    const cmsData = await getPartnershipsCMSData('en');
    
    // Merge CMS data with static data as fallback
    const partnershipsData = cmsData.partnerships ? {
        wrapperCls: "section-padding",
        container: "container",
        subheading: cmsData.partnerships.subheading || PartnershipsData.subheading,
        heading: cmsData.partnerships.heading || PartnershipsData.heading,
        text: cmsData.partnerships.text || PartnershipsData.text,
        imageList: cmsData.partnerships.imageList && cmsData.partnerships.imageList.length > 0 
            ? cmsData.partnerships.imageList 
            : PartnershipsData.imageList,
    } : PartnershipsData;

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

            {/* Partnerships Section */}
            <Partnerships data={partnershipsData} />
        </>
    )
}

export default PartnershipsPage;


















