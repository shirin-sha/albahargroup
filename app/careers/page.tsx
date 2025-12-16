import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import BreadcrumbBannerImageTablet from '@/public/img/banner/page-banner-991.jpg';
import BreadcrumbBannerImageMobile from '@/public/img/banner/page-banner-575.jpg';
import { CareerData, JobListingsData } from '@/data/sections/careerData';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import CareerSection from '@/components/sections/Career';


const PAGE_TITLE: string = 'Careers';
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

const Careers = () => {
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

            {/* Career Section - Job Listings */}
            <CareerSection data={CareerData} jobListings={JobListingsData} />
       
        </>
    )
}

export default Careers;







