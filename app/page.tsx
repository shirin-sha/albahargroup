import { HeroSlidesData } from '@/data/sections/heroSliderData';


import HeroSlider from '@/components/sections/HeroSlider';

import { ImageText2Data } from '@/data/sections/imageText2Data';
import { OurServicesDataAccordion } from '@/data/sections/ourServicesDataAccordion';
import { FeaturedProjectData } from '@/data/sections/featuredProjectData';
import { WhyChooseUsGridData } from '@/data/sections/whyChooseUsGridData';
import { PricingPlanData } from '@/data/sections/pricingPlanData';
import { FaqData } from '@/data/sections/faqData';
import { BusinessVerticalsData } from '@/data/sections/businessVerticalsData';
import { FeaturedBlogData } from '@/data/sections/featuredBlogData';

import ImageText2 from '@/components/sections/ImageText2';
import OurServicesAccordion from '@/components/sections/OurServicesAccordion';
import ProjectSlider from '@/components/sections/ProjectSlider';
import WhyChooseUsGrid from '@/components/sections/WhyChooseUsGrid';
import PricingPlan from '@/components/sections/PricingPlan';
import BusinessVerticals from '@/components/sections/BusinessVerticals';
import Faq from '@/components/sections/Faq';
import FeaturedBlog from '@/components/sections/FeaturedBlog';


const Home = () => {
  return (
    <>
      {/* Hero Slider */}
      <HeroSlider 
        wrapperCls="with-floating-header"
        slides={HeroSlidesData} 
        navigation={true} 
      />

      {/* Image Text */}
      <ImageText2 data={ImageText2Data} />

{/* Service Section */}
<OurServicesAccordion data={OurServicesDataAccordion} />

{/* Recent Projects */}
<ProjectSlider data={FeaturedProjectData} />

{/* Why Choose Us */}
<WhyChooseUsGrid data={WhyChooseUsGridData} />

{/* Pricing Plan */}
<PricingPlan data={PricingPlanData} />

{/* Business Verticals */}
<BusinessVerticals data={BusinessVerticalsData} />

{/* FAQ */}
<Faq data={FaqData} />

{/* Featured Blog */}
<FeaturedBlog data={FeaturedBlogData} />
    </>
  );
}

export default Home;
