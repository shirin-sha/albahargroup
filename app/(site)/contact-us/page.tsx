import type { Metadata } from 'next';
import { absoluteUrl } from '@/libs/seo';
import {
  buildContactBannerPicture,
  contactFormToSectionProps,
} from '@/libs/cms/contactPage';
import { getCmsSectionsCached } from '@/libs/cms/pageSections';
import { CacheTags } from '@/libs/cacheTags';

import BreadcrumbBanner from '@/components/BreadcrumbBanner';
import ContactSection from '@/components/sections/Contact';
import MapSection from '@/components/sections/Map';

export const revalidate = 3600;

const PAGE_TITLE = 'Contact Us';

async function getContactCMSData(lang: 'en' | 'ar') {
  try {
    const getSections = getCmsSectionsCached({
      collectionName: 'contactPageSections',
      cacheKey: 'cms-contact',
      tag: CacheTags.cms.contact,
    });
    const sections = await getSections();

    const metadataSection = sections.find((s) => s.sectionId === 'metadata');
    const bannerSection = sections.find((s) => s.sectionId === 'banner');
    const contactFormSection = sections.find((s) => s.sectionId === 'contactForm');
    const mapSection = sections.find((s) => s.sectionId === 'map');

    return {
      metadata: metadataSection?.[lang] || null,
      banner: bannerSection?.[lang] || null,
      contactForm: contactFormSection?.[lang] || null,
      mapEmbed: mapSection?.en?.mapEmbed || mapSection?.ar?.mapEmbed || '',
    };
  } catch (error) {
    console.error('Error fetching contact CMS data:', error);
    return {
      metadata: null,
      banner: null,
      contactForm: null,
      mapEmbed: '',
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getContactCMSData('en');
  const title =
    cmsData?.metadata?.metaTitle ||
    cmsData?.banner?.title ||
    PAGE_TITLE;
  const description =
    cmsData?.metadata?.metaDescription ||
    cmsData?.contactForm?.text ||
    cmsData?.contactForm?.heading ||
    'Contact Al Bahar Group for enquiries, partnerships, and support.';

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl('/contact-us'),
      languages: {
        en: absoluteUrl('/contact-us'),
        ar: absoluteUrl('/ar/contact-us'),
      },
    },
  };
}

const Contact = async () => {
  const cmsData = await getContactCMSData('en');

  const bannerTitle = cmsData.banner?.title || PAGE_TITLE;
  const bannerImage = buildContactBannerPicture(
    cmsData.banner?.imageSrc as string | undefined
  );
  const contactFormData = contactFormToSectionProps(
    cmsData.contactForm as Record<string, unknown> | null
  );

  return (
    <>
      <BreadcrumbBanner title={bannerTitle} image={bannerImage} />

      <ContactSection data={contactFormData} />

      <MapSection mapEmbed={cmsData.mapEmbed} />
    </>
  );
};

export default Contact;
