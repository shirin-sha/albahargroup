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
  const cmsData = await getHomeCMSData('en');

  // Helper to merge CMS data with defaults
  const getData = (cmsSection: any, defaultData: any) => {
    if (!cmsSection) return defaultData;
    return { ...defaultData, ...cmsSection };
  };

  return (
    <>
      {/* Hero Slider */}
      {cmsData.hero?.slides && cmsData.hero.slides.length > 0 ? (
        <HeroSlider 
          wrapperCls="with-floating-header"
          slides={cmsData.hero.slides} 
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
        <ImageText2 data={getData(cmsData.imageText, ImageText2Data)} />
      ) : (
        <ImageText2 data={ImageText2Data} />
      )}

      {/* Service Section */}
      {cmsData.services ? (
        <OurServicesAccordion data={getData(cmsData.services, OurServicesDataAccordion)} />
      ) : (
        <OurServicesAccordion data={OurServicesDataAccordion} />
      )}

      {/* Recent Projects */}
      {cmsData.projects ? (
        <ProjectSlider data={getData(cmsData.projects, FeaturedProjectData)} />
      ) : (
        <ProjectSlider data={FeaturedProjectData} />
      )}

      {/* Why Choose Us */}
      {cmsData.whyChooseUs ? (
        <WhyChooseUsGrid data={getData(cmsData.whyChooseUs, WhyChooseUsGridData)} />
      ) : (
        <WhyChooseUsGrid data={WhyChooseUsGridData} />
      )}

      {/* Pricing Plan */}
      {cmsData.pricing ? (
        <PricingPlan data={getData(cmsData.pricing, PricingPlanData)} />
      ) : (
        <PricingPlan data={PricingPlanData} />
      )}

      {/* Testimonial Slider with Thumb */}
      {cmsData.testimonials ? (
        <TestimonialSliderWithThumb data={getData(cmsData.testimonials, TestimonialSliderThumbData)} />
      ) : (
        <TestimonialSliderWithThumb data={TestimonialSliderThumbData} />
      )}

      {/* FAQ */}
      {cmsData.faq ? (
        <Faq data={getData(cmsData.faq, FaqData)} />
      ) : (
        <Faq data={FaqData} />
      )}

      {/* Featured Blog */}
      {cmsData.blog ? (
        <FeaturedBlog data={getData(cmsData.blog, FeaturedBlogData)} />
      ) : (
        <FeaturedBlog data={FeaturedBlogData} />
      )}
    </>
  );
}

export default Home;

