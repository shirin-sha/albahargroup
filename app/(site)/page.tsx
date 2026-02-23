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

const Home = async () => {
  const cmsData = await getHomeCMSData();

  // Helper to merge CMS data with defaults and combine both languages
  const getBilingualData = (cmsSection: any, defaultData: any) => {
    if (!cmsSection || (!cmsSection.en && !cmsSection.ar)) return defaultData;
    
    // Merge English data
    const enData = cmsSection.en ? { ...defaultData, ...cmsSection.en } : defaultData;
    // Merge Arabic data
    const arData = cmsSection.ar ? { ...defaultData, ...cmsSection.ar } : defaultData;
    
    // Return combined data with both languages
    return {
      ...enData,
      ar: arData,
      // For fields that should show both, combine them
      bilingual: true
    };
  };

  // Helper to get slides with both languages
  const getBilingualSlides = (cmsHero: any, defaultSlides: any) => {
    if (!cmsHero || (!cmsHero.en && !cmsHero.ar)) return defaultSlides;
    
    const enSlides = cmsHero.en?.slides || [];
    const arSlides = cmsHero.ar?.slides || [];
    
    // Use the longer array length to ensure we show all slides
    const maxLength = Math.max(enSlides.length, arSlides.length, defaultSlides.length);
    
    // Combine slides - use English as base and add Arabic
    return Array.from({ length: maxLength }).map((_, index: number) => {
      const enSlide = enSlides[index] || defaultSlides[index] || {};
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
          slides={getBilingualSlides(cmsData.hero, HeroSlidesData)} 
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
        <ImageText2 data={getBilingualData(cmsData.imageText, ImageText2Data)} />
      ) : (
        <ImageText2 data={ImageText2Data} />
      )}

      {/* Service Section */}
      {cmsData.services ? (
        <OurServicesAccordion data={getBilingualData(cmsData.services, OurServicesDataAccordion)} />
      ) : (
        <OurServicesAccordion data={OurServicesDataAccordion} />
      )}

      {/* Recent Projects */}
      {cmsData.projects ? (
        <ProjectSlider data={getBilingualData(cmsData.projects, FeaturedProjectData)} />
      ) : (
        <ProjectSlider data={FeaturedProjectData} />
      )}

      {/* Why Choose Us */}
      {cmsData.whyChooseUs ? (
        <WhyChooseUsGrid data={getBilingualData(cmsData.whyChooseUs, WhyChooseUsGridData)} />
      ) : (
        <WhyChooseUsGrid data={WhyChooseUsGridData} />
      )}

      {/* Pricing Plan */}
      {cmsData.pricing ? (
        <PricingPlan data={getBilingualData(cmsData.pricing, PricingPlanData)} />
      ) : (
        <PricingPlan data={PricingPlanData} />
      )}

      {/* Testimonial Slider with Thumb */}
      {cmsData.testimonials ? (
        <TestimonialSliderWithThumb data={getBilingualData(cmsData.testimonials, TestimonialSliderThumbData)} />
      ) : (
        <TestimonialSliderWithThumb data={TestimonialSliderThumbData} />
      )}

      {/* FAQ */}
      {cmsData.faq ? (
        <Faq data={getBilingualData(cmsData.faq, FaqData)} />
      ) : (
        <Faq data={FaqData} />
      )}

      {/* Featured Blog */}
      {cmsData.blog ? (
        <FeaturedBlog data={getBilingualData(cmsData.blog, FeaturedBlogData)} />
      ) : (
        <FeaturedBlog data={FeaturedBlogData} />
      )}
    </>
  );
}

export default Home;

