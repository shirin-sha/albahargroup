import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import BreadcrumbBannerImageTablet from '@/public/img/banner/page-banner-991.jpg';
import BreadcrumbBannerImageMobile from '@/public/img/banner/page-banner-575.jpg';

import BreadcrumbBanner from '@/components/BreadcrumbBanner';
import ServicesSectionListing from '@/components/sections/ServicesSectionListing';
import { absoluteUrl } from '@/libs/seo';

const PAGE_TITLE = 'قدراتنا';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: 'اكتشف قدرات مجموعة البهار في رأس المال البشري والمعرفة والعمليات وخدمة العملاء.',
  alternates: {
    canonical: absoluteUrl('/ar/capabilities'),
    languages: {
      en: absoluteUrl('/capabilities'),
      ar: absoluteUrl('/ar/capabilities'),
    },
  },
};

const Page = () => {
  return (
    <>
      <BreadcrumbBanner
        title={PAGE_TITLE}
        image={{
          src: BreadcrumbBannerImage.src,
          srcMobile: BreadcrumbBannerImageTablet.src,
          srcTablet: BreadcrumbBannerImageMobile.src,
          width: 1920,
          height: 520,
          cls: 'media media-bg',
          alt: 'Banner Image',
          loading: 'eager',
        }}
      />
      <ServicesSectionListing section="capabilities" wrapperCls="mt-100 mb-100" container="container-fluid" />
    </>
  );
};

export default Page;
