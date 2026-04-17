import type { Metadata } from 'next';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import { getDb } from '@/libs/mongodb';
import { Job } from '@/libs/models/job';
import { absoluteUrl } from '@/libs/seo';
import { ObjectId } from 'mongodb';
import BreadcrumbBanner from '@/components/BreadcrumbBanner';
import JobApplicationForm from '@/components/sections/JobApplicationForm';

export const metadata: Metadata = {
  title: 'Apply for a Job',
  description: 'Submit your application for an open role at Al Bahar Group.',
  alternates: {
    canonical: absoluteUrl('/careers/apply'),
    languages: {
      en: absoluteUrl('/careers/apply'),
      ar: absoluteUrl('/ar/careers/apply'),
    },
  },
};

async function getJobById(id?: string): Promise<Job | null> {
  if (!id) return null;

  try {
    const db = await getDb();
    const collection = db.collection<Job>('jobs');
    let job: any = null;

    if (ObjectId.isValid(id)) {
      job = await collection.findOne({ _id: new ObjectId(id) } as any);
    } else {
      job = await collection.findOne({ id: parseInt(id, 10) } as any);
    }

    if (!job) return null;

    return {
      ...job,
      _id: job._id ? String(job._id) : undefined,
    } as Job;
  } catch (error) {
    console.error('Error fetching job application target:', error);
    return null;
  }
}

const ApplyPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }> | { jobId?: string };
}) => {
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const job = await getJobById(resolvedSearchParams.jobId);

  return (
    <>
      <BreadcrumbBanner
        title=" Apply for a Job"
        image={{
          src: BreadcrumbBannerImage.src,
          srcMobile: BreadcrumbBannerImage.src,
          srcTablet: BreadcrumbBannerImage.src,
          width: 1920,
          height: 520,
          cls: 'media media-bg',
          alt: 'Banner Image',
          loading: 'eager',
        }}
      />
      <JobApplicationForm job={job} locale="en" />
    </>
  );
};

export default ApplyPage;
