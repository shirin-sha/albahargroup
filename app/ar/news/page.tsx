import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import { absoluteUrl } from '@/libs/seo';
import { getCmsSectionsCached } from '@/libs/cms/pageSections';
import { CacheTags } from '@/libs/cacheTags';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import BlogGrid from '@/components/sections/BlogGrid';

export const revalidate = 3600;

const PAGE_TITLE: string = 'الأخبار';

async function getNewsCMSData(lang: 'en' | 'ar' = 'ar') {
  try {
    const getSections = getCmsSectionsCached({
      collectionName: 'newsPageSections',
      cacheKey: 'cms-news',
      tag: CacheTags.cms.news,
    });
    const sections = await getSections();
    
    const metadataSection = sections.find(s => s.sectionId === 'metadata');
    const bannerSection = sections.find(s => s.sectionId === 'banner');
    const blogGridSection = sections.find(s => s.sectionId === 'blogGrid');
    
    return {
      metadata: metadataSection?.[lang] || null,
      banner: bannerSection?.[lang] || { title: PAGE_TITLE },
      blogGrid: blogGridSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching news CMS data:', error);
    return {
      metadata: null,
      banner: { title: PAGE_TITLE },
      blogGrid: null,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getNewsCMSData('ar');
  const title = cmsData?.metadata?.metaTitle || cmsData?.banner?.title || PAGE_TITLE;
  const description =
    cmsData?.metadata?.metaDescription ||
    cmsData?.blogGrid?.heading ||
    cmsData?.blogGrid?.subheading ||
    'آخر أخبار مجموعة البهار والتحديثات والإعلانات.';

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl('/ar/news'),
      languages: {
        en: absoluteUrl('/news'),
        ar: absoluteUrl('/ar/news'),
      },
    },
  };
}

const Blog = async () => {
    const cmsData = await getNewsCMSData('ar');

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
                subheading={cmsData.blogGrid?.subheading || undefined}
                heading={cmsData.blogGrid?.heading || undefined}
                showCategory={false}
                detailHrefBase="/ar/news"
                locale="ar"
            />
        </>
    )
}

export default Blog;
