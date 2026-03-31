import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import { CareerData } from '@/data/sections/careerData';
import { Job } from '@/libs/models/job';
import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';
import { absoluteUrl } from '@/libs/seo';
import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import CareerSection from '@/components/sections/Career';


const PAGE_TITLE: string = 'Careers';

async function getCareersCMSData(lang: 'en' | 'ar' = 'en') {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("careersPageSections");
    const sections = await collection.find({}).sort({ order: 1 }).toArray();
    
    const metadataSection = sections.find(s => s.sectionId === 'metadata');
    const bannerSection = sections.find(s => s.sectionId === 'banner');
    const careerSection = sections.find(s => s.sectionId === 'careerSection');
    
    return {
      metadata: metadataSection?.[lang] || null,
      banner: bannerSection?.[lang] || { title: PAGE_TITLE },
      careerSection: careerSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching careers CMS data:', error);
    return {
      metadata: null,
      banner: { title: PAGE_TITLE },
      careerSection: null,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getCareersCMSData('en');
  const title = cmsData?.metadata?.metaTitle || cmsData?.banner?.title || PAGE_TITLE;
  const description =
    cmsData?.metadata?.metaDescription ||
    cmsData?.careerSection?.text ||
    cmsData?.careerSection?.heading ||
    'Explore open roles and career opportunities at Al Bahar Group.';

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl('/careers'),
      languages: {
        en: absoluteUrl('/careers'),
        ar: absoluteUrl('/ar/careers'),
      },
    },
  };
}

async function getJobs(): Promise<Job[]> {
  try {
    const db = await getDb();
    const collection = db.collection<Job>('jobs');
    const jobs = await collection
      .find({ enabled: true })
      .sort({ created_at: -1 })
      .toArray();

    return jobs.map((job) => {
      const { _id, ...rest } = job as any;
      const postedDateValue =
        typeof rest.postedDate === 'string'
          ? rest.postedDate
          : rest.postedDate
            ? new Date(rest.postedDate as any).toLocaleDateString()
            : '';

      return {
        ...rest,
        id: _id ? String(_id) : rest.id,
        postedDate: postedDateValue,
        created_at: rest.created_at ? new Date(rest.created_at as any).toISOString() : undefined,
        updated_at: rest.updated_at ? new Date(rest.updated_at as any).toISOString() : undefined,
      } as Job;
    });
  } catch (error) {
    console.error('Error fetching jobs for careers page:', error);
    return [];
  }
}

const Careers = async () => {
    const cmsData = await getCareersCMSData('en');
    const jobs = await getJobs();
    
    // Merge CMS data with static data as fallback
    const careerData = cmsData.careerSection ? {
        wrapperCls: "section-padding",
        container: "container",
        subheading: cmsData.careerSection.subheading || CareerData.subheading,
        heading: cmsData.careerSection.heading || CareerData.heading,
        text: cmsData.careerSection.text || CareerData.text,
    } : CareerData;

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

            {/* Career Section - Job Listings */}
            <CareerSection data={careerData} jobListings={jobs} />
       
        </>
    )
}

export default Careers;

