import Icons from "./Icons";
import SidebarPhoneImage from "@/public/img/service/secvice-contact.jpg";
import { getDb } from "@/libs/mongodb";
import { Service } from "@/libs/models/service";
import type { Language } from "@/libs/language";
import { addLanguagePrefix } from "@/libs/language";
import { serviceDisplayTitle } from "@/libs/serviceLocale";

import SidebarCategories from "./SidebarCategories";
import SidebarPhone from "./SidebarPhone";
import SidebarPdfDownload from "./SidebarPdfDownload";
import DrawerOpener from "./DrawerOpener";

const CAPABILITY_SLUGS = new Set([
    'human-capital',
    'knowledge-insights',
    'business-excellence',
    'logistics',
    'customer-care',
]);

const resolveSection = (section?: string, slug?: string): 'businesses' | 'capabilities' => {
    if (section === 'capabilities') return 'capabilities';
    if (section === 'businesses') return 'businesses';
    return slug && CAPABILITY_SLUGS.has(slug) ? 'capabilities' : 'businesses';
};

const ServiceSidebar = async ({
    slug,
    section,
    locale = 'en',
}: {
    slug?: string;
    section?: 'businesses' | 'capabilities';
    locale?: Language;
}) => {
    const db = await getDb();
    const collection = db.collection<Service>("services");
    const currentSection = resolveSection(section, slug);
    const services = await collection
        .find({ enabled: { $ne: false }, section: currentSection } as any)
        .sort({ created_at: -1 })
        .toArray();

    const filteredServices = services.filter((item: any) => item.slug != slug);
    const servicesRoot = addLanguagePrefix('/services', locale);
    const categories = filteredServices.map((service: Service) => ({
        label: serviceDisplayTitle(service, locale),
        slug: service.slug,
    }));
    const listTitle =
        currentSection === 'businesses'
            ? (locale === 'ar' ? 'قطاعات الأعمال' : 'Business Verticals')
            : (locale === 'ar' ? 'قدرات الأعمال' : 'Capabilities');

    return (
        <div className="sidebar-filter drawer-service-sidebar">
            <div className="drawer-headings lg:!hidden" data-aos="fade-up">
                <div className="heading text-24">Filter</div>
                <DrawerOpener
                    cls="svg-wrapper menu-close"
                    data-drawer=".drawer-service-sidebar"
                >
                    <Icons.CloseCircle />
                </DrawerOpener>
            </div>

            <aside className="service-sidebar">
                {categories.length > 0 &&
                    <SidebarCategories 
                        title={listTitle}
                        categories={categories}
                        rootUrl={servicesRoot}
                    />
                }

                <SidebarPhone 
                    heading={locale === 'ar' ? 'تواصل معنا لمزيد من المعلومات' : 'Contact us for more information'}
                    text={locale === 'ar' ? 'هل تحتاج إلى مساعدة؟ تحدّث مع فريقنا' : 'Need assistance? Speak with our team'}
                    phone="+ 965 220 72111"
                    image={{
                        src: SidebarPhoneImage.src,                      
                        width: 1000,
                        height: 929,
                        loading: "lazy",
                        alt: "image"
                    }}
                />
                
                <SidebarPdfDownload 
                    heading={locale === 'ar' ? 'حمّل الملف التعريفي' : 'Download Our Profile'}
                    text={
                        locale === 'ar'
                            ? 'تعرّف على أعمال مجموعة محمد عبدالرحمن البهار، وقدراتها، وشراكاتها، ومعلوماتها المؤسسية من خلال كتيب الملف التعريفي للشركة.'
                            : "Explore Mohamed Abdulrahman Al-Bahar Group's businesses, capabilities, partnerships and corporate information through our company profile brochure."
                    }
                    ctaLabel={locale === 'ar' ? 'اضغط هنا للتحميل' : 'Click here to download'}
                />
            </aside>
        </div>
    )
}

export default ServiceSidebar;