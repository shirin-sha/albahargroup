import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';

export async function getHomeCMSData(lang: 'en' | 'ar' = 'en') {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>('homePageSections');
    const sections = await collection.find({ enabled: { $ne: false } }).sort({ order: 1 }).toArray();
    
    const heroSection = sections.find(s => s.sectionId === 'hero');
    const imageTextSection = sections.find(s => s.sectionId === 'imageText');
    const servicesSection = sections.find(s => s.sectionId === 'services');
    const projectsSection = sections.find(s => s.sectionId === 'projects');
    const whyChooseUsSection = sections.find(s => s.sectionId === 'whyChooseUs');
    const pricingSection = sections.find(s => s.sectionId === 'pricing');
    const testimonialsSection = sections.find(s => s.sectionId === 'testimonials');
    const faqSection = sections.find(s => s.sectionId === 'faq');
    const blogSection = sections.find(s => s.sectionId === 'blog');
    
    return {
      hero: heroSection?.[lang] || null,
      imageText: imageTextSection?.[lang] || null,
      services: servicesSection?.[lang] || null,
      projects: projectsSection?.[lang] || null,
      whyChooseUs: whyChooseUsSection?.[lang] || null,
      pricing: pricingSection?.[lang] || null,
      testimonials: testimonialsSection?.[lang] || null,
      faq: faqSection?.[lang] || null,
      blog: blogSection?.[lang] || null,
    };
  } catch (error) {
    console.error('Error fetching home CMS data:', error);
    return {
      hero: null,
      imageText: null,
      services: null,
      projects: null,
      whyChooseUs: null,
      pricing: null,
      testimonials: null,
      faq: null,
      blog: null,
    };
  }
}
