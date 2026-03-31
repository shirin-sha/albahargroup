import { getDb } from '@/libs/mongodb';
import { HomePageSection } from '@/libs/models/homePage';

export async function getHomeCMSData() {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>('homePageSections');
    const sections = await collection.find({ enabled: { $ne: false } }).sort({ order: 1 }).toArray();
    
    const metadataSection = sections.find(s => s.sectionId === 'metadata');
    const heroSection = sections.find(s => s.sectionId === 'hero');
    const imageTextSection = sections.find(s => s.sectionId === 'imageText');
    const servicesSection = sections.find(s => s.sectionId === 'services');
    const projectsSection = sections.find(s => s.sectionId === 'projects');
    const whyChooseUsSection = sections.find(s => s.sectionId === 'whyChooseUs');
    const pricingSection = sections.find(s => s.sectionId === 'pricing');
    const testimonialsSection = sections.find(s => s.sectionId === 'testimonials');
    const faqSection = sections.find(s => s.sectionId === 'faq');
    const blogSection = sections.find(s => s.sectionId === 'blog');
    
    // Return both languages together
    return {
      metadata: metadataSection ? { en: metadataSection.en || null, ar: metadataSection.ar || null } : null,
      hero: heroSection ? { en: heroSection.en || null, ar: heroSection.ar || null } : null,
      imageText: imageTextSection ? { en: imageTextSection.en || null, ar: imageTextSection.ar || null } : null,
      services: servicesSection ? { en: servicesSection.en || null, ar: servicesSection.ar || null } : null,
      projects: projectsSection ? { en: projectsSection.en || null, ar: projectsSection.ar || null } : null,
      whyChooseUs: whyChooseUsSection ? { en: whyChooseUsSection.en || null, ar: whyChooseUsSection.ar || null } : null,
      pricing: pricingSection ? { en: pricingSection.en || null, ar: pricingSection.ar || null } : null,
      testimonials: testimonialsSection ? { en: testimonialsSection.en || null, ar: testimonialsSection.ar || null } : null,
      faq: faqSection ? { en: faqSection.en || null, ar: faqSection.ar || null } : null,
      blog: blogSection ? { en: blogSection.en || null, ar: blogSection.ar || null } : null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('Home CMS unavailable, using empty CMS data:', message);
    return {
      metadata: null,
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
