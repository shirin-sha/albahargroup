import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import BlogGrid from '@/components/sections/BlogGrid';

const PAGE_TITLE: string = 'News';
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

async function getNewsCMSData(lang: 'en' | 'ar' = 'en') {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("newsPageSections");
    const sections = await collection.find({}).sort({ order: 1 }).toArray();
    
    const bannerSection = sections.find(s => s.sectionId === 'banner');
    const blogGridSection = sections.find(s => s.sectionId === 'blogGrid');
    
    return {
      banner: bannerSection?.[lang] || { title: PAGE_TITLE },
      blogGrid: blogGridSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching news CMS data:', error);
    return {
      banner: { title: PAGE_TITLE },
      blogGrid: null,
    };
  }
}

const Blog = async () => {
    const cmsData = await getNewsCMSData('en');

    return(
        <>
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
            <BlogGrid 
                cls="mt-100 mb-100"
            />
        </>
    )
}

export default Blog;

