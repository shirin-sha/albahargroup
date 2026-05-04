import type { Metadata } from 'next';
import { absoluteUrl } from '@/libs/seo';
import { buildContactBannerPicture } from '@/libs/cms/contactPage';
import { partnershipsSectionToSectionProps } from '@/libs/cms/partnershipsPage';
import { getCmsSectionsCached } from '@/libs/cms/pageSections';
import { CacheTags } from '@/libs/cacheTags';

import BreadcrumbBanner from '@/components/BreadcrumbBanner';
import Partnerships from '@/components/sections/Partnerships';

export const revalidate = 3600;

const PAGE_TITLE = 'شراكاتنا';

async function getPartnershipsCMSData(lang: 'en' | 'ar') {
  try {
    const getSections = getCmsSectionsCached({
      collectionName: 'partnershipsPageSections',
      cacheKey: 'cms-partnerships',
      tag: CacheTags.cms.partnerships,
    });
    const sections = await getSections();

    const metadataSection = sections.find((s) => s.sectionId === 'metadata');
    const bannerSection = sections.find((s) => s.sectionId === 'banner');
    const partnershipsSection = sections.find((s) => s.sectionId === 'partnerships');

    return {
      metadata: metadataSection?.[lang] || null,
      banner: bannerSection?.[lang] || null,
      partnerships: partnershipsSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching partnerships CMS data:', error);
    return {
      metadata: null,
      banner: null,
      partnerships: null,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getPartnershipsCMSData('ar');
  const title =
    cmsData?.metadata?.metaTitle ||
    cmsData?.banner?.title ||
    PAGE_TITLE;
  const description =
    cmsData?.metadata?.metaDescription ||
    cmsData?.partnerships?.text ||
    cmsData?.partnerships?.heading ||
    'استكشف شراكات مجموعة البهار وشبكة التعاون.';

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl('/ar/ourpartnerships'),
      languages: {
        en: absoluteUrl('/ourpartnerships'),
        ar: absoluteUrl('/ar/ourpartnerships'),
      },
    },
  };
}

const PartnershipsPage = async () => {
  const cmsData = await getPartnershipsCMSData('ar');

  const bannerTitle =
    typeof cmsData.banner?.title === 'string' ? cmsData.banner.title : '';
  const bannerImage = buildContactBannerPicture(
    cmsData.banner?.imageSrc as string | undefined
  );
  const partnershipsData = partnershipsSectionToSectionProps(
    cmsData.partnerships as Record<string, unknown> | null
  );

  return (
    <>
      <BreadcrumbBanner title={bannerTitle} image={bannerImage} />
      <Partnerships data={partnershipsData} lang="ar" />
    </>
  );
};

export default PartnershipsPage;
