import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import BreadcrumbBannerImageTablet from '@/public/img/banner/page-banner-991.jpg';
import BreadcrumbBannerImageMobile from '@/public/img/banner/page-banner-575.jpg';

import { PartnershipsData } from '@/data/sections/partnershipsData';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import Partnerships from '@/components/sections/Partnerships';


const PAGE_TITLE: string = 'Partnerships';
export const metadata: Metadata = {
  title: PAGE_TITLE,
}


const PartnershipsPage = () => {
    return(
        <>
            {/* Breadcrumb Banner */}
            <BreadcrumbBanner 
                title={PAGE_TITLE}
                image={{
                    src: BreadcrumbBannerImage.src,
                    srcMobile: BreadcrumbBannerImageTablet.src,
                    srcTablet: BreadcrumbBannerImageMobile.src,
                    width: 1920,
                    height: 520,
                    cls: "media media-bg",
                    alt: "Banner Image",
                    loading: "eager"
                }}
            />

            {/* Partnerships Section */}
            <Partnerships data={PartnershipsData} />
        </>
    )
}

export default PartnershipsPage;









