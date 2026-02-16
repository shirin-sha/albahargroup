import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import { ContactData } from '@/data/sections/contactData';
import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';

import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import ContactSection from '@/components/sections/Contact';
import MapSection from '@/components/sections/Map';

const PAGE_TITLE: string = 'Contact Us';
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

async function getContactCMSData(lang: 'en' | 'ar' = 'en') {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("contactPageSections");
    const sections = await collection.find({}).sort({ order: 1 }).toArray();
    
    const bannerSection = sections.find(s => s.sectionId === 'banner');
    const contactFormSection = sections.find(s => s.sectionId === 'contactForm');
    
    return {
      banner: bannerSection?.[lang] || { title: PAGE_TITLE },
      contactForm: contactFormSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching contact CMS data:', error);
    return {
      banner: { title: PAGE_TITLE },
      contactForm: null,
    };
  }
}

const Contact = async () => {
    // Default to English for main route
    const cmsData = await getContactCMSData('en');
    
    // Merge CMS data with static data as fallback
    const contactFormData = cmsData.contactForm ? {
        wrapperCls: "section-padding",
        container: "container",
        subheading: cmsData.contactForm.subheading || ContactData.subheading,
        heading: cmsData.contactForm.heading || ContactData.heading,
        text: cmsData.contactForm.text || ContactData.text,
        promotions: cmsData.contactForm.promotions?.map((promo: any, index: number) => {
            // Determine icon type based on title
            let iconType = 'location';
            const titleLower = promo.title?.toLowerCase() || '';
            if (titleLower.includes('call') || titleLower.includes('phone')) {
                iconType = 'phone';
            } else if (titleLower.includes('email') || titleLower.includes('mail')) {
                iconType = 'email';
            } else if (titleLower.includes('address') || index === 0) {
                iconType = 'location';
            }
            
            return {
                iconType,
                title: promo.title,
                text: promo.text,
            };
        }) || ContactData.promotions,
        block: cmsData.contactForm.block || ContactData.block,
    } : ContactData;

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

            {/* Contact Form */}
            <ContactSection data={contactFormData} />

            {/* Google Map */}
            <MapSection />
        </>
    )
}

export default Contact;

