import type { Metadata } from 'next';
import HeroSlider from '@/components/sections/HeroSlider';
import ImageText2 from '@/components/sections/ImageText2';
import OurServicesAccordion from '@/components/sections/OurServicesAccordion';
import ProjectSlider from '@/components/sections/ProjectSlider';
import WhyChooseUsGrid from '@/components/sections/WhyChooseUsGrid';
import PricingPlan from '@/components/sections/PricingPlan';
import Faq from '@/components/sections/Faq';
import FeaturedBlog from '@/components/sections/FeaturedBlog';
import TestimonialSliderWithThumb from '@/components/sections/TestimonialSliderWithThumb';
import { getHomeCMSData } from '@/libs/cms/home';
import { HeroSlidesData } from '@/data/sections/heroSliderData';
import { ImageText2Data } from '@/data/sections/imageText2Data';
import { OurServicesDataAccordion } from '@/data/sections/ourServicesDataAccordion';
import { FeaturedProjectData } from '@/data/sections/featuredProjectData';
import { WhyChooseUsGridData } from '@/data/sections/whyChooseUsGridData';
import { PricingPlanData } from '@/data/sections/pricingPlanData';
import { FaqData } from '@/data/sections/faqData';
import { FeaturedBlogData } from '@/data/sections/featuredBlogData';
import { TestimonialSliderThumbData } from '@/data/sections/testimonialSliderThumbData';
import { absoluteUrl } from '@/libs/seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getHomeCMSData();
  const heroHeading = cmsData?.hero?.ar?.slides?.[0]?.heading || 'الرئيسية';
  const metaTitle = cmsData?.metadata?.ar?.metaTitle || cmsData?.hero?.ar?.seo?.metaTitle || heroHeading;
  const description =
    cmsData?.metadata?.ar?.metaDescription ||
    cmsData?.hero?.ar?.seo?.metaDescription ||
    cmsData?.imageText?.ar?.text ||
    cmsData?.services?.ar?.heading ||
    'الصفحة الرئيسية لمجموعة البهار: الأعمال والقدرات والمشاريع وآخر المستجدات.';
  return {
    title: metaTitle,
    description,
    alternates: {
      canonical: absoluteUrl('/ar'),
      languages: {
        en: absoluteUrl('/'),
        ar: absoluteUrl('/ar'),
      },
    },
  };
}

const Home = async () => {
  const cmsData = await getHomeCMSData();

  // Helper to get Arabic data from bilingual CMS data
  const getArabicData = (cmsSection: any, defaultData: any) => {
    if (!cmsSection || !cmsSection.ar) return defaultData;
    
    // Merge Arabic data with defaults
    return { ...defaultData, ...cmsSection.ar };
  };

  // Helper to get Arabic slides
  const getArabicSlides = (cmsHero: any, defaultSlides: any) => {
    if (!cmsHero || !cmsHero.ar?.slides) return defaultSlides;
    
    const arSlides = cmsHero.ar.slides;
    const defaultLength = defaultSlides.length;
    
    // Map Arabic slides, using defaults for missing data
    return arSlides.map((arSlide: any, index: number) => {
      const defaultSlide = defaultSlides[index] || {};
      return {
        ...defaultSlide,
        // Override with Arabic content
        subheading: arSlide.subheading || defaultSlide.subheading || '',
        heading: arSlide.heading || defaultSlide.heading || '',
        text: arSlide.text || defaultSlide.text || '',
        button: arSlide.button || defaultSlide.button || null,
        // Keep image and other shared properties from default or Arabic
        image: arSlide.image || defaultSlide.image || '',
        imageMobile: arSlide.imageMobile || defaultSlide.imageMobile || '',
        imageTablet: arSlide.imageTablet || defaultSlide.imageTablet || '',
      };
    });
  };

  return (
    <>
      {/* Hero Slider */}
      {cmsData.hero?.ar?.slides && cmsData.hero.ar.slides.length > 0 ? (
        <HeroSlider 
          wrapperCls="with-floating-header"
          slides={getArabicSlides(cmsData.hero, HeroSlidesData)} 
          navigation={true} 
        />
      ) : (
        <HeroSlider 
          wrapperCls="with-floating-header"
          slides={HeroSlidesData} 
          navigation={true} 
        />
      )}

      {/* Image Text */}
      {cmsData.imageText ? (
        <ImageText2 data={getArabicData(cmsData.imageText, ImageText2Data)} />
      ) : (
        <ImageText2 data={ImageText2Data} />
      )}

      {/* Service Section */}
      {cmsData.services ? (
        <OurServicesAccordion data={getArabicData(cmsData.services, OurServicesDataAccordion)} />
      ) : (
        <OurServicesAccordion data={OurServicesDataAccordion} />
      )}

      {/* Recent Projects */}
      {cmsData.projects ? (
        <ProjectSlider data={getArabicData(cmsData.projects, FeaturedProjectData)} />
      ) : (
        <ProjectSlider data={FeaturedProjectData} />
      )}

      {/* Why Choose Us */}
      {cmsData.whyChooseUs ? (
        <WhyChooseUsGrid data={getArabicData(cmsData.whyChooseUs, WhyChooseUsGridData)} />
      ) : (
        <WhyChooseUsGrid data={WhyChooseUsGridData} />
      )}

      {/* Pricing Plan */}
      {cmsData.pricing ? (
        <PricingPlan data={getArabicData(cmsData.pricing, PricingPlanData)} />
      ) : (
        <PricingPlan data={PricingPlanData} />
      )}

      {/* Testimonial Slider with Thumb */}
      {cmsData.testimonials ? (
        <TestimonialSliderWithThumb data={getArabicData(cmsData.testimonials, TestimonialSliderThumbData)} />
      ) : (
        <TestimonialSliderWithThumb data={TestimonialSliderThumbData} />
      )}

      {/* FAQ */}
      {cmsData.faq ? (
        <Faq data={getArabicData(cmsData.faq, FaqData)} />
      ) : (
        <Faq data={FaqData} />
      )}

      {/* Featured Blog */}
      {cmsData.blog ? (
        <FeaturedBlog data={getArabicData(cmsData.blog, FeaturedBlogData)} />
      ) : (
        <FeaturedBlog data={FeaturedBlogData} />
      )}
    </>
  );
}

export default Home;
