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
import { absoluteUrl } from '@/libs/seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getHomeCMSData();
  const heroHeading = cmsData?.hero?.en?.slides?.[0]?.heading || 'Home';
  const metaTitle = cmsData?.metadata?.en?.metaTitle || cmsData?.hero?.en?.seo?.metaTitle || heroHeading;
  const description =
    cmsData?.metadata?.en?.metaDescription ||
    cmsData?.hero?.en?.seo?.metaDescription ||
    cmsData?.imageText?.en?.text ||
    cmsData?.services?.en?.heading ||
    'Al Bahar Group home: businesses, capabilities, projects, and latest updates.';
  return {
    title: metaTitle,
    description,
    alternates: {
      canonical: absoluteUrl('/'),
      languages: {
        en: absoluteUrl('/'),
        ar: absoluteUrl('/ar'),
      },
    },
  };
}

const Home = async () => {
  const cmsData = await getHomeCMSData();

  // Helper to combine both languages without using static defaults
  const getBilingualData = (cmsSection: any, layoutDefaults: any = {}) => {
    if (!cmsSection || (!cmsSection.en && !cmsSection.ar)) return null;

    // Keep layout defaults so spacing/classes remain consistent,
    // but do not fallback any content fields from static data.
    const enData = cmsSection.en ? { ...layoutDefaults, ...cmsSection.en } : { ...layoutDefaults };
    const arData = cmsSection.ar ? { ...layoutDefaults, ...cmsSection.ar } : { ...layoutDefaults };

    return {
      ...enData,
      ar: arData,
      bilingual: true,
    };
  };

  // Helper to get slides with both languages
  const getBilingualSlides = (cmsHero: any) => {
    if (!cmsHero || (!cmsHero.en && !cmsHero.ar)) return [];
    
    const enSlides = cmsHero.en?.slides || [];
    const arSlides = cmsHero.ar?.slides || [];
    
    const maxLength = Math.max(enSlides.length, arSlides.length);
    
    // Combine slides - use English as base and add Arabic
    return Array.from({ length: maxLength }).map((_, index: number) => {
      const enSlide = enSlides[index] || {};
      const arSlide = arSlides[index] || {};
      
      return {
        ...enSlide,
        // Add Arabic versions if they exist
        subheadingAr: arSlide.subheading || '',
        headingAr: arSlide.heading || '',
        textAr: arSlide.text || '',
        buttonAr: arSlide.button || null,
      };
    });
  };

  return (
    <>
      {/* Hero Slider */}
      {cmsData.hero && (cmsData.hero.en?.slides?.length > 0 || cmsData.hero.ar?.slides?.length > 0) ? (
        <HeroSlider 
          wrapperCls="with-floating-header"
          slides={getBilingualSlides(cmsData.hero)} 
          navigation={true} 
        />
      ) : null}

      {/* Image Text */}
      {cmsData.imageText ? (() => {
        const data = getBilingualData(cmsData.imageText, {
          wrapperCls: "mt-100",
          container: "container",
        });

        if (data && Array.isArray(data.imageList)) {
          data.imageList = data.imageList.map((img: any, index: number) => ({
            width: index === 0 ? 992 : 195,
            height: index === 0 ? 863 : 202,
            alt: "Image",
            loading: "lazy",
            ...img,
          }));
        }

        return data ? <ImageText2 data={data} /> : null;
      })() : null}

      {/* Service Section */}
      {cmsData.services ? (() => {
        const data = getBilingualData(cmsData.services, { wrapperCls: "mt-100 section-padding", container: "container" });
        return data ? <OurServicesAccordion data={data} /> : null;
      })() : null}

      {/* Recent Projects */}
      {cmsData.projects ? (() => {
        const data = getBilingualData(cmsData.projects, { wrapperCls: "mt-100", container: "container" });
        return data ? <ProjectSlider data={data} /> : null;
      })() : null}

      {/* Why Choose Us */}
      {cmsData.whyChooseUs ? (() => {
        const data = getBilingualData(cmsData.whyChooseUs, { wrapperCls: "mt-100 section-padding", container: "container" });
        return data ? <WhyChooseUsGrid data={data} /> : null;
      })() : null}

      {/* Pricing Plan */}
      {cmsData.pricing ? (() => {
        const data = getBilingualData(cmsData.pricing, { wrapperCls: "mt-100", container: "container" });
        return data ? <PricingPlan data={data} /> : null;
      })() : null}

      {/* Testimonial Slider with Thumb */}
      {cmsData.testimonials ? (() => {
        const data = getBilingualData(cmsData.testimonials, {  container: "container" });
        return data ? <TestimonialSliderWithThumb data={data} /> : null;
      })() : null}

      {/* FAQ */}
      {cmsData.faq ? (() => {
        const data = getBilingualData(cmsData.faq, {  container: "container" });
        return data ? <Faq data={data} /> : null;
      })() : null}

      {/* Featured Blog */}
      {cmsData.blog ? (() => {
        const data = getBilingualData(cmsData.blog, { wrapperCls: "mt-100 section-padding", container: "container" });
        return data ? <FeaturedBlog data={data} /> : null;
      })() : null}
    </>
  );
}

export default Home;

