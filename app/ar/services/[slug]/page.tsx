import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import BreadcrumbBannerImageTablet from '@/public/img/banner/page-banner-991.jpg';
import BreadcrumbBannerImageMobile from '@/public/img/banner/page-banner-575.jpg';
import { notFound } from 'next/navigation';
import { getDb } from '@/libs/mongodb';
import { Service } from '@/libs/models/service';
import { resolveServiceFields } from '@/libs/serviceLocale';

import BreadcrumbBanner from '@/components/BreadcrumbBanner';
import ServiceDetails from '@/components/sections/ServiceDetails';

const PAGE_TITLE: string = 'Service Details';

export const metadata: Metadata = {
  title: PAGE_TITLE,
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const db = await getDb();
  const collection = db.collection<Service>('services');
  const service = await collection.findOne({ slug, enabled: { $ne: false } } as any);

  if (!service) {
    return notFound();
  }

  const resolved = resolveServiceFields(service, 'ar');
  const bannerTitle = resolved.detailTitle || resolved.title || PAGE_TITLE;

  return (
    <>
      <BreadcrumbBanner
        title={bannerTitle}
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
      <ServiceDetails
        container="container"
        data={{
          ...(resolved as any),
          id: (service as any)._id ? String((service as any)._id) : (service as any).id,
        }}
        locale="ar"
      />
    </>
  );
};

export default Page;
